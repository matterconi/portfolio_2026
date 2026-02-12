# Guida Shader Custom — HeroShader.tsx

Ogni sezione spiega **cosa fa**, **dove si trova nel codice**, e **come modificarla**.

---

## 1. UNIFORMS (riga ~83-93) — I tuoi "knob" di controllo

Sono le variabili che passi da JavaScript allo shader GLSL. Cambiale per modificare il comportamento senza toccare il codice GLSL.

| Uniform | Valore attuale | Cosa controlla |
|---------|---------------|----------------|
| `uSpeed` | `0.4` | Velocità dell'animazione. `0.1` = lentissimo, `1.0` = veloce |
| `uNoiseDensity` | `1.3` | Quanto è "compresso" il pattern 3D. Più alto = onde più fitte e piccole |
| `uNoiseStrength` | `4.0` | Altezza delle onde 3D (displacement). `0` = piano piatto, `8` = montagne |
| `uFrequency` | `5.5` | Dettaglio del noise nel colore. Più alto = pattern più fini e intricati |
| `uC1r/g/b` | `0, 1, 0` | **Colore 1** — attualmente verde `#00ff00` |
| `uC2r/g/b` | `0, 1, 1` | **Colore 2** — attualmente cyan `#00ffff` |
| `uC3r/g/b` | `0.706, 0.471, 1.0` | **Colore 3** — attualmente purple `#b478ff` |
| `uGrainStrength` | `0.15` | Intensità del grain. `0` = niente, `0.3` = molto visibile |

### Come convertire un colore HEX in valori RGB per lo shader:
```
#ff5500 → R=255, G=85, B=0 → dividi per 255 → (1.0, 0.333, 0.0)
```

---

## 2. VERTEX SHADER (riga ~117-127) — La forma 3D

Questo shader modifica la **geometria** del piano, creando le onde.

```glsl
vOrigUv = uv;                    // Salva la posizione UV originale (per i colori)
float t = uTime * uSpeed;        // Tempo animato
float distortion = cnoise(position * uNoiseDensity * 0.43 + t);  // Noise 3D
transformed += normal * distortion * uNoiseStrength;              // Deforma
vPos = transformed;              // Passa la posizione deformata al fragment
```

**Cosa puoi modificare:**
- `0.43` — moltiplicatore del noise sulla posizione. Più basso = onde più grandi e morbide
- Cambiare `uNoiseStrength` a `0` per avere un piano piatto (solo colore, niente 3D)
- Aggiungere una seconda ottava di noise per più dettaglio:
  ```glsl
  float distortion = cnoise(position * uNoiseDensity * 0.43 + t)
                    + 0.5 * cnoise(position * uNoiseDensity * 0.86 + t);
  ```

---

## 3. FRAGMENT SHADER — I colori

### 3a. Colore scuro di base (riga ~152)
```glsl
vec3 darkColor = vec3(0.039, 0.039, 0.039); // #0a0a0a
```
Questo è il colore delle zone "vuote". Per cambiarlo, converti il tuo hex:
- Nero puro: `vec3(0.0, 0.0, 0.0)`
- Grigio scuro: `vec3(0.08, 0.08, 0.08)`

### 3b. Posizione orizzontale (riga ~160)
```glsl
float hPos = vOrigUv.x;
```
Usa le UV originali (pre-deformazione) per determinare dove sei sul piano.
- `vOrigUv.x` = gradiente orizzontale (sinistra→destra)
- `vOrigUv.y` = gradiente verticale (basso→alto)
- `length(vOrigUv - 0.5)` = gradiente radiale (centro→bordi)

### 3c. Noise per i colori (riga ~164-165)
```glsl
float n1 = cnoise(vec3(vOrigUv * uFrequency, t * 0.3));
float n2 = cnoise(vec3(vOrigUv.yx * uFrequency * 0.7, t * 0.2 + 5.0));
```
Due strati di noise che "rompono" la linearità del gradiente.
- `uFrequency` controlla quanto sono fini i pattern
- `t * 0.3` / `t * 0.2` — velocità indipendente per ogni strato. Più basso = evoluzione più lenta
- Il `+ 5.0` offset evita che i due noise siano sincronizzati

### 3d. Gradiente orizzontale perturbato (riga ~168)
```glsl
float gradient = hPos + n1 * 0.2 + n2 * 0.1;
```
- `hPos` è il gradiente base (lineare, sx→dx)
- `n1 * 0.2` e `n2 * 0.1` perturbano il gradiente con il noise
- **Aumenta i moltiplicatori** (es. `0.4`, `0.3`) per un effetto più caotico
- **Riducili** (es. `0.05`, `0.02`) per un gradiente quasi lineare

### 3e. SPAZIO VUOTO — colorPresence (riga ~171-173) ⭐ IMPORTANTE
```glsl
float colorPresence = smoothstep(0.45, 0.85, gradient);
float holeNoise = cnoise(vec3(vOrigUv * 3.5, t * 0.25 + 30.0));
colorPresence *= smoothstep(0.0, 0.6, holeNoise + gradient * 0.3);
```

Questa è la parte che controlla **quanto spazio vuoto** c'è.

**Primo smoothstep: `smoothstep(0.45, 0.85, gradient)`**
- Primo numero (`0.45`) = dove INIZIA il colore. Più alto = più spazio vuoto a sinistra
  - `0.2` = colore inizia quasi subito
  - `0.5` = colore inizia a metà
  - `0.7` = colore solo nell'angolo destro
- Secondo numero (`0.85`) = dove il colore è al 100%. Più vicino al primo = transizione più netta
  - `0.85` = transizione graduale
  - `0.50` = transizione brusca (se primo è 0.45)

**holeNoise + secondo smoothstep:**
- `3.5` = scala del noise per i "buchi". Più alto = buchi più piccoli e frequenti
- `smoothstep(0.0, 0.6, ...)` — crea buchi scuri anche nella zona colorata
  - Primo numero più alto = più buchi
  - `gradient * 0.3` — i buchi sono più probabili a sinistra

### 3f. Selezione colore — zone nette (riga ~176-184)
```glsl
float zone = n1 + n2 * 0.5;
vec3 accentColor;
if (zone > 0.3) {
  accentColor = accentGreen;
} else if (zone > -0.3) {
  accentColor = accentCyan;
} else {
  accentColor = accentPurple;
}
```

Questo decide **quale colore** appare in ogni zona, senza blend.

**Come modificare le proporzioni dei colori:**
- `zone > 0.3` — soglia per il verde. **Abbassala** (es. `0.0`) per **più verde**
- `zone > -0.3` — soglia per il cyan. Abbassala per più cyan, alzala per meno
- Tutto sotto `-0.3` diventa purple

**Esempio: 70% verde, 20% cyan, 10% purple:**
```glsl
if (zone > -0.4) {
  accentColor = accentGreen;    // quasi tutto verde
} else if (zone > -0.8) {
  accentColor = accentCyan;     // poco cyan
} else {
  accentColor = accentPurple;   // pochissimo purple
}
```

**Se vuoi blend tra colori** (invece di zone nette):
```glsl
float mixA = smoothstep(-0.5, 0.5, n1);
float mixB = smoothstep(-0.4, 0.6, n2);
vec3 accent1 = mix(accentGreen, accentCyan, mixA);
vec3 accentColor = mix(accent1, accentPurple, mixB * 0.4);
```

### 3g. Mix finale (riga ~187-189)
```glsl
vec3 gradientColor = mix(darkColor, accentColor, colorPresence);
gl_FragColor.rgb = mix(gl_FragColor.rgb, gradientColor, 0.92);
```
- Prima riga: mescola dark→accent in base a `colorPresence`
- `0.92` — quanto il nostro colore sovrascrive il materiale Three.js.
  - `1.0` = colore shader puro
  - `0.5` = 50% shader + 50% lighting/material
  - Valori più bassi = più influenza delle luci

### 3h. Grain (riga ~192-194)
```glsl
float grain = fract(sin(dot(gl_FragCoord.xy + uTime, vec2(12.9898, 78.233))) * 43758.5453);
grain = (grain - 0.5) * uGrainStrength;
gl_FragColor.rgb += grain;
```
Film grain che si sovrappone. **Non si mescola** con i colori, è solo un overlay.
- `uGrainStrength: 0.15` — intensità. `0` per disattivare

---

## 4. GEOMETRIA E CAMERA

### Piano (riga ~203)
```jsx
<planeGeometry args={[10, 10, 256, 256]} />
```
- `10, 10` — dimensione del piano
- `256, 256` — segmenti. Più alto = onde più smooth ma più pesante per la GPU

### Rotazione del piano (riga ~202)
```jsx
rotation={[0, (10 * Math.PI) / 180, (50 * Math.PI) / 180]}
```
- `[rotX, rotY, rotZ]` in radianti
- `rotZ=50°` dà l'inclinazione diagonale
- Cambia a `[0, 0, 0]` per un piano dritto

### Camera (riga ~220-223)
```js
const radius = 3.6;           // Distanza dalla scena. Più basso = più vicino/zoom
const polarAngle = 90°;       // 0°=dall'alto, 90°=di lato, 180°=dal basso
const azimuthAngle = 180°;    // Rotazione orizzontale attorno al centro
```

### Canvas (riga ~251)
```jsx
<Canvas camera={{ fov: 45 }} />
```
- `fov: 45` — campo visivo. Più basso = zoom, più alto = grandangolo
- `fov: 10` + `radius: 24` = vista molto zoomata (come avevamo prima)
- `fov: 45` + `radius: 3.6` = vista ravvicinata con prospettiva

### Luci (riga ~257-258)
```jsx
<ambientLight intensity={1.2 * Math.PI} />        // Luce ambientale uniforme
<directionalLight position={[2, 3, 4]} intensity={0.8 * Math.PI} />  // Luce direzionale
```
- Ambient: illumina tutto uniformemente. Senza questa, le zone non illuminate sono nere
- Directional: crea ombre/riflessi sulle onde 3D. `position` cambia la direzione

### Background (riga ~256)
```jsx
<color attach="background" args={['#0a0a0a']} />
```
Il colore visibile nelle zone dove il piano non copre lo schermo.

---

## 5. RICETTE RAPIDE

**Solo verde + nero, senza altri colori:**
```glsl
vec3 accentColor = accentGreen; // ignora zone, sempre verde
```

**Gradiente verticale invece che orizzontale:**
```glsl
float hPos = vOrigUv.y; // cambia .x in .y
```

**Colore solo al centro (radiale):**
```glsl
float hPos = 1.0 - length(vOrigUv - 0.5) * 2.0;
```

**Animazione più lenta di tutto:**
Cambia `uSpeed` a `0.1`

**Piano piatto (niente onde 3D):**
Cambia `uNoiseStrength` a `0`

# Prompt: Aggiungi Card Dettaglio Progetto a lato della DomeGallery

## Contesto
Ho integrato il componente `DomeGallery` (da React Bits) nella sezione Projects del portfolio, sostituendo il precedente carosello 3D in Three.js. Il componente è puro JSX + CSS, usa `@use-gesture/react` per il drag/rotazione della cupola di immagini, e ha già un comportamento nativo di "enlarge" al click (apre l'immagine ingrandita al centro con animazione).

## File coinvolti
- `app/src/components/ProjectsSection.tsx` — wrappa la galleria e passa le immagini
- `app/src/components/DomeGallery.jsx` — componente galleria (NON modificare la logica interna di drag/rotate/click)
- `app/src/components/DomeGallery.css` — stili della galleria
- `app/data/types.ts` — tipo `Project` con campi: `title`, `shortDescription`, `technologies`, `links`, `images`

## Obiettivo
Aggiungere una **card in evidenza** che appaia a lato (o in overlay laterale) quando l'utente interagisce con un'immagine della galleria, per mostrare informazioni testuali sul progetto associato.

## Comportamento desiderato

### 1. Trigger
- Al **click** su un'immagine della galleria: invece di attivare l'enlarge nativo della DomeGallery, intercetta l'evento e mostra la card dettaglio.
- Oppure: al **click** mostra PRIMA la card dettaglio, e dalla card c'è un pulsante "Ingrandisci" per attivare l'enlarge nativo.
- Da decidere: l'enlarge nativo della DomeGallery va disattivato o convive con la card? **Suggerimento**: se usiamo la card come modalità principale, aggiungere un prop al wrapper per evitare il conflitto (es. `disableEnlarge` o simile).

### 2. Posizionamento
- **Layout a lato**: la galleria occupa la parte sinistra/centrale dello schermo, la card dettaglio scorre in da destra (o appare sopra il contenuto) con una larghezza fissa (~400-500px) o percentuale (max 40% del viewport).
- **Posizione mobile**: in viewport stretti, la card diventa un overlay full-screen o bottom-sheet che scorre su dal basso.
- **Z-index**: la card deve essere sopra la galleria (z-index superiore agli overlay della galleria) ma deve avere un backdrop/blur per distinguerla dallo sfondo.

### 3. Contenuto della card
La card deve mostrare i dati del progetto corrispondente all'immagine cliccata (indice `i` mappato su `projects[i]`):
- **Titolo** (`project.title`)
- **Descrizione breve** (`project.shortDescription`)
- **Tecnologie** (`project.technologies` — lista di badge/tag)
- **Link esterni** (`project.links.live`, `project.links.github` — pulsanti con icone)
- **Immagine hero** (l'immagine stessa della galleria, possibilmente in versione più grande o semplicemente come thumbnail)
- **Pulsante chiusura** (X o icona) per chiudere la card

### 4. Stile
- Sfondo scuro con trasparenza (`bg-neutral-900/90` o simile) con `backdrop-blur`
- Bordo sottile (`border-white/10` o `border-white/20`)
- Border radius consistente con il design (es. `rounded-2xl`)
- Testo bianco/primary, tag tecnologie con sfondo accentuato
- Animazione di ingresso/uscita: slide da destra (`translateX(100%) → translateX(0)`) o fade + scale, durata ~300ms con `ease-out`
- Il contenuto della card deve avere padding generoso e scroll interno se il contenuto è lungo

### 5. Integrazione tecnica
- Gestire lo stato `selectedProject` (o `selectedIndex`) nel `ProjectsSection` (wrapper), non dentro `DomeGallery`.
- Passare una callback al componente wrapper (es. `onSelect`) o usare event delegation per catturare il click sull'immagine.
- Se si intercetta il click nativo della DomeGallery, assicurarsi di non rompere il drag/scroll della galleria.
- **Non modificare** `DomeGallery.jsx` se possibile, o al massimo aggiungere un prop opzionale `onItemClick` che venga chiamato prima dell'enlarge nativo.
- La card deve essere renderizzata nel DOM come sibling della galleria o in un portal su `document.body`, ma posizionata in modo assoluto/fixed relativa al viewport o alla sezione.

### 6. Accessibilità
- Focus trap quando la card è aperta (tab cicla dentro la card)
- Chiusura con tasto `Escape`
- `aria-expanded` o `aria-hidden` appropriati
- Contrasto testo sufficiente

## Esempio di struttura risultante
```
<section id="projects" class="relative w-full h-screen overflow-hidden bg-black">
  <div class="w-full h-full">
    <DomeGallery images={images} onItemClick={handleSelect} />
  </div>

  {/* Card Dettaglio — slide da destra */}
  <AnimatePresence>
    {selectedProject && (
      <motion.div
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0 }}
        className="absolute top-0 right-0 h-full w-[400px] max-w-[40vw] ..."
      >
        {/* contenuto card */}
      </motion.div>
    )}
  </AnimatePresence>
</section>
```

## Note aggiuntive
- Il portfolio usa **Tailwind CSS v4** e **Framer Motion** (già installati).
- Mantenere la semantica HTML e la struttura del codice esistente.
- Se il numero di progetti è minore degli slot della galleria, la mappatura indice→progetto deve gestire il ciclo (es. `projects[i % projects.length]`), ma la card deve sempre mostrare il progetto corretto corrispondente all'immagine cliccata.
- **Stato attuale**: attualmente il click sulla galleria attiva l'enlarge nativo (immagine ingrandita al centro). Valutare se mantenere l'enlarge come "secondo step" (click → card → click ingrandisci) o se sostituirlo completamente con la card.

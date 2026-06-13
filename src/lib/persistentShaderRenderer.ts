import * as THREE from 'three';

const CONTAINER_ID = 'persistent-hero-shader';

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uFillTint;
  uniform float uFrequency;
  uniform float uAmplitude;
  uniform float uRotationSpread;
  uniform float uCutAngle;
  uniform float uSpeed;
  varying vec2 vUv;

  #define S(a,b,t) smoothstep(a,b,t)

  mat2 Rot(float a) {
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
  }

  vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(2127.1, 81.17)), dot(p, vec2(1269.5, 283.37)));
    return fract(sin(p) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);

    float n = mix(
      mix(dot(-1.0 + 2.0 * hash(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
          dot(-1.0 + 2.0 * hash(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
      mix(dot(-1.0 + 2.0 * hash(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
          dot(-1.0 + 2.0 * hash(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
      u.y);
    return 0.5 + 0.5 * n;
  }

  float grainHash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    vec2 uv = vUv;
    float ratio = uResolution.x / uResolution.y;
    float t = uTime * uSpeed;

    vec2 tuv = uv - 0.5;
    float degree = noise(vec2(t * 0.1, tuv.x * tuv.y));
    tuv.y *= 1.0 / ratio;
    tuv *= Rot(radians((degree - 0.5) * uRotationSpread + 180.0));
    tuv.y *= ratio;

    float speed = t * 2.0;
    tuv.x += sin(tuv.y * uFrequency + speed) / uAmplitude;
    tuv.y += sin(tuv.x * uFrequency * 1.5 + speed) / (uAmplitude * 0.5);

    vec3 colorBlack = vec3(0.0);
    vec3 colorBright = uColorA;
    vec3 colorDark = uColorB * 0.35;
    vec3 colorMid = uColorB;

    mat2 rotCut = Rot(radians(uCutAngle));
    float l1 = S(-0.1, 0.05, (tuv * rotCut).x);
    float l2 = S(-0.1, 0.05, (tuv * rotCut).x);
    float y = S(0.3, -0.5, tuv.y);

    float splitAmt = 0.04 + 0.03 * sin(t * 0.3);
    vec2 tuvSplit = tuv + vec2(splitAmt, splitAmt * 0.4);
    float lSplit = S(-0.1, 0.05, (tuvSplit * rotCut).x);
    float ySplit = S(0.3, -0.5, tuvSplit.y);

    vec3 baseCol = mix(mix(colorBlack, colorBright, l1), mix(colorDark, colorMid, l2), y);
    vec3 splitCol = mix(mix(colorBlack, colorBright, lSplit), mix(colorDark, colorMid, lSplit), ySplit);
    vec3 col = mix(baseCol, splitCol, 0.35);

    col = pow(col, vec3(1.3));
    col *= 0.9;

    float darkMask = 1.0 - S(0.01, 0.15, length(col));
    float blotch = noise(uv * 2.5 + t * 0.06 + 3.0);
    col += uFillTint * S(0.3, 0.55, blotch) * darkMask * 0.5;
    col += (grainHash(gl_FragCoord.xy + fract(t * 7.43)) * 2.0 - 1.0) * 0.08;

    gl_FragColor = vec4(col, 1.0);
  }
`;

class PersistentShaderRenderer {
  private camera: THREE.OrthographicCamera | null = null;
  private container: HTMLDivElement | null = null;
  private frameId: number | null = null;
  private geometry: THREE.PlaneGeometry | null = null;
  private material: THREE.ShaderMaterial | null = null;
  private renderer: THREE.WebGLRenderer | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private scene: THREE.Scene | null = null;
  private startedAt = 0;
  private active = false;
  private bounds = { top: 0, left: 0, width: 1, height: 1 };

  ensureMounted() {
    if (typeof window === 'undefined' || this.renderer) return;

    document.querySelectorAll(`#${CONTAINER_ID}`).forEach((element) => element.remove());
    document.body.querySelectorAll(':scope > div[aria-hidden="true"]').forEach((element) => {
      if (!(element instanceof HTMLDivElement)) return;
      if (!element.querySelector('canvas')) return;
      if (element.style.position === 'fixed' && element.style.pointerEvents === 'none' && element.style.zIndex === '12') {
        element.remove();
      }
    });

    this.container = document.createElement('div');
    this.container.id = CONTAINER_ID;
    this.container.setAttribute('aria-hidden', 'true');
    Object.assign(this.container.style, {
      position: 'fixed',
      top: '0px',
      left: '0px',
      width: '1px',
      height: '1px',
      zIndex: '12',
      borderRadius: '1.5rem',
      overflow: 'hidden',
      pointerEvents: 'none',
      opacity: '0',
      transform: 'translate3d(0, 0, 0)',
      transition: 'opacity 300ms ease',
    });
    document.body.prepend(this.container);

    this.renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: false,
      powerPreference: 'high-performance',
      stencil: false,
      depth: false,
    });
    this.renderer.setPixelRatio(1);
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    this.renderer.domElement.style.display = 'block';
    this.container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.geometry = new THREE.PlaneGeometry(2, 2);
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(1, 1) },
        uColorA: { value: new THREE.Vector3(0, 1, 0) },
        uColorB: { value: new THREE.Vector3(0, 0.9, 0.8) },
        uFillTint: { value: new THREE.Vector3(0, 0.06, 0.04) },
        uFrequency: { value: 5.5 },
        uAmplitude: { value: 24.0 },
        uRotationSpread: { value: 820.0 },
        uCutAngle: { value: -5.0 },
        uSpeed: { value: 1.0 },
      },
      depthTest: false,
      depthWrite: false,
    });
    this.scene.add(new THREE.Mesh(this.geometry, this.material));

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.container);
    this.resize();
    this.renderFrame(performance.now());
    window.dispatchEvent(new Event('shaderReady'));
  }

  setBounds(bounds: { top: number; left: number; width: number; height: number }) {
    this.ensureMounted();
    if (!this.container) return;

    const nextBounds = {
      top: Math.round(bounds.top),
      left: Math.round(bounds.left),
      width: Math.max(1, Math.round(bounds.width)),
      height: Math.max(1, Math.round(bounds.height)),
    };
    const sizeChanged = this.bounds.width !== nextBounds.width || this.bounds.height !== nextBounds.height;

    if (this.bounds.top !== nextBounds.top || this.bounds.left !== nextBounds.left) {
      this.container.style.transform = `translate3d(${nextBounds.left}px, ${nextBounds.top}px, 0)`;
    }

    if (sizeChanged) {
      this.container.style.width = `${nextBounds.width}px`;
      this.container.style.height = `${nextBounds.height}px`;
    }

    this.bounds = nextBounds;

    if (sizeChanged) {
      this.resize();
    }
  }

  setActive(active: boolean) {
    if (!active && !this.renderer) {
      this.active = false;
      return;
    }

    if (active) {
      this.ensureMounted();
    }

    this.active = active;

    if (this.container) {
      this.container.style.opacity = active ? '1' : '0';
    }

    if (active) {
      this.start();
    } else {
      this.stop();
    }
  }

  private resize() {
    if (!this.container || !this.renderer || !this.material) return;

    const width = Math.max(1, this.container.clientWidth);
    const height = Math.max(1, this.container.clientHeight);
    this.renderer.setSize(width, height, false);
    this.material.uniforms.uResolution.value.set(width, height);
    this.renderFrame(performance.now());
  }

  private start() {
    if (this.frameId !== null) return;
    if (this.startedAt === 0) this.startedAt = performance.now();
    this.frameId = requestAnimationFrame(this.animate);
  }

  private stop() {
    if (this.frameId === null) return;
    cancelAnimationFrame(this.frameId);
    this.frameId = null;
  }

  private animate = (time: number) => {
    if (!this.active) {
      this.stop();
      return;
    }

    this.renderFrame(time);
    this.frameId = requestAnimationFrame(this.animate);
  };

  private renderFrame(time: number) {
    if (!this.renderer || !this.scene || !this.camera || !this.material) return;
    if (this.startedAt === 0) this.startedAt = time;

    this.material.uniforms.uTime.value = (time - this.startedAt) / 1000;
    this.renderer.render(this.scene, this.camera);
  }
}

export const persistentShaderRenderer = new PersistentShaderRenderer();

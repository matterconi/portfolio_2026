import { Scene, Camera, WebGLRenderer } from 'three';
import { shaderTextRenderer } from './shaderTextRenderer';

interface RenderTask {
  id: string;
  scene: Scene;
  camera: Camera;
  canvas: HTMLCanvasElement;
  enabled: boolean;
  priority: number;
  lastFrameTime: number;
  targetFPS: number;
  visible: boolean;
  beforeRender?: () => void;
}

class SharedRendererManager {
  private renderer: WebGLRenderer | null = null;
  private tasks: Map<string, RenderTask> = new Map();
  private animationId: number | null = null;
  private isRunning = false;
  private canvas: HTMLCanvasElement | null = null;
  private supportsTransferBitmap = false;
  private lastWidth = 0;
  private lastHeight = 0;

  /**
   * Inizializza il renderer condiviso con pre-warm.
   */
  initialize(): WebGLRenderer {
    if (this.renderer) return this.renderer;

    if (typeof window === 'undefined') return null as unknown as WebGLRenderer;

    this.canvas = document.createElement('canvas');
    this.canvas.style.display = 'none';
    document.body.appendChild(this.canvas);

    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance',
      stencil: false,
      depth: true,
      preserveDrawingBuffer: true,
    });

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.autoClear = true;

    this.supportsTransferBitmap =
      typeof (this.canvas as unknown as Record<string, unknown>).transferToImageBitmap === 'function';

    // Pre-warm: primo render dummy per eliminare stutter iniziale
    const dummyScene = new Scene();
    const dummyCamera = new Camera();
    this.renderer.render(dummyScene, dummyCamera);

    return this.renderer;
  }

  /**
   * Registra un task di rendering.
   */
  registerTask(
    id: string,
    scene: Scene,
    camera: Camera,
    canvas: HTMLCanvasElement,
    options: {
      priority?: number;
      targetFPS?: number;
      visible?: boolean;
      beforeRender?: () => void;
    } = {}
  ): void {
    const task: RenderTask = {
      id,
      scene,
      camera,
      canvas,
      enabled: true,
      priority: options.priority ?? 10,
      lastFrameTime: 0,
      targetFPS: options.targetFPS ?? 60,
      visible: options.visible ?? true,
      beforeRender: options.beforeRender,
    };

    this.tasks.set(id, task);

    if (!this.isRunning) {
      this.start();
    }
  }

  /**
   * Rimuove un task.
   */
  unregisterTask(id: string): void {
    this.tasks.delete(id);

    if (this.tasks.size === 0) {
      this.stop();
      this.dispose();
    }
  }

  /**
   * Abilita/disabilita un task.
   */
  setTaskEnabled(id: string, enabled: boolean): void {
    const task = this.tasks.get(id);
    if (task) task.enabled = enabled;
  }

  /**
   * Imposta la visibilità di un task (per lazy rendering).
   */
  setTaskVisible(id: string, visible: boolean): void {
    const task = this.tasks.get(id);
    if (task) task.visible = visible;
  }

  /**
   * Aggiorna target FPS di un task.
   */
  setTaskFPS(id: string, targetFPS: number): void {
    const task = this.tasks.get(id);
    if (task) task.targetFPS = targetFPS;
  }

  /**
   * Loop di rendering principale.
   */
  private animate = (time: number): void => {
    if (!this.renderer || !this.isRunning) return;

    this.animationId = requestAnimationFrame(this.animate);

    // Aggiorna uniform uTime
    shaderTextRenderer.updateTime(time * 0.001);

    const sortedTasks = Array.from(this.tasks.values())
      .filter((task) => task.enabled && task.visible)
      .sort((a, b) => a.priority - b.priority);

    sortedTasks.forEach((task) => {
      const frameDuration = 1000 / task.targetFPS;
      const elapsed = time - task.lastFrameTime;

      if (elapsed >= frameDuration) {
        this.renderTask(task);
        task.lastFrameTime = time;
      }
    });
  };

  /**
   * Renderizza un singolo task.
   */
  private renderTask(task: RenderTask): void {
    if (!this.renderer || !this.canvas) return;

    const { scene, camera, canvas } = task;
    const width = canvas.width || 512;
    const height = canvas.height || 512;

    // Applica variante shader prima del render
    if (task.beforeRender) task.beforeRender();

    // Only call setSize when dimensions actually change
    if (width !== this.lastWidth || height !== this.lastHeight) {
      this.renderer.setSize(width, height, false);
      this.lastWidth = width;
      this.lastHeight = height;
    }

    this.renderer.render(scene, camera);

    // Trasferisci il risultato al canvas del task
    const ctx = canvas.getContext('2d');
    if (ctx && this.canvas) {
      try {
        ctx.clearRect(0, 0, width, height);

        if (this.supportsTransferBitmap) {
          const bitmap = (this.canvas as unknown as Record<string, () => ImageBitmap>).transferToImageBitmap();
          ctx.drawImage(bitmap, 0, 0, width, height);
          bitmap.close();
        } else {
          ctx.drawImage(this.canvas, 0, 0, width, height);
        }
      } catch {
        // Fallback silenzioso
      }
    }
  }

  /**
   * Render singolo frame (per componenti non animati).
   */
  renderOnce(id: string, time?: number): void {
    const task = this.tasks.get(id);
    if (!task) return;

    const currentTime = time !== undefined ? time * 1000 : performance.now();
    shaderTextRenderer.updateTime(currentTime * 0.001);
    this.renderTask(task);
    task.lastFrameTime = currentTime;
  }

  /**
   * Avvia animazione continua per un task specifico.
   * Ritorna una stop function.
   */
  startAnimation(id: string): () => void {
    const task = this.tasks.get(id);
    if (!task) return () => {};

    task.enabled = true;

    if (!this.isRunning) {
      this.start();
    }

    return () => {
      const t = this.tasks.get(id);
      if (t) t.enabled = false;
    };
  }

  /**
   * Avvia il loop di rendering.
   */
  private start(): void {
    if (this.isRunning) return;

    this.initialize();
    this.isRunning = true;
    this.animationId = requestAnimationFrame(this.animate);
  }

  /**
   * Ferma il loop di rendering.
   */
  private stop(): void {
    if (!this.isRunning) return;

    this.isRunning = false;
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  /**
   * Pulisci tutto.
   */
  dispose(): void {
    this.stop();
    this.tasks.clear();

    if (this.renderer) {
      this.renderer.dispose();
      this.renderer = null;
    }

    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
      this.canvas = null;
    }
  }
}

// Singleton
export const sharedRenderer = new SharedRendererManager();

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    sharedRenderer.dispose();
  });
}

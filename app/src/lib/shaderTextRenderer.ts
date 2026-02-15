import { ShaderMaterial, PlaneGeometry, Vector2, Vector3 } from 'three';
import { vertexShader, fragmentShader } from '@/constants/shaders';
import type { ShaderVariant } from '@/components/WaterPlaneShader';

/**
 * Singleton per condividere Material e Geometry tra tutte le istanze di ShaderText.
 * Supporta varianti shader (colori, frequenze, ecc.) tramite setVariant().
 */
class ShaderTextRenderer {
  private material: ShaderMaterial | null = null;
  private geometry: PlaneGeometry | null = null;
  private refCount = 0;

  private initialize(): void {
    if (this.material) return;

    this.material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0.0 },
        uResolution: { value: new Vector2(512, 512) },
        uColorA: { value: new Vector3(0, 1, 0) },
        uColorB: { value: new Vector3(0, 0.9, 0.8) },
        uFillTint: { value: new Vector3(0, 0.06, 0.04) },
        uFrequency: { value: 5.5 },
        uAmplitude: { value: 24.0 },
        uRotationSpread: { value: 820.0 },
        uCutAngle: { value: -5.0 },
        uSpeed: { value: 1.0 },
      },
      transparent: true,
    });

    this.geometry = new PlaneGeometry(2, 2);
  }

  /**
   * Ottieni risorse condivise (Material + Geometry).
   * Incrementa reference count.
   */
  getResources() {
    this.initialize();
    this.refCount++;

    return {
      material: this.material!,
      geometry: this.geometry!,
    };
  }

  /**
   * Rilascia risorse. Dispone quando il ref count arriva a 0.
   */
  releaseResources(): void {
    this.refCount--;

    if (this.refCount <= 0) {
      this.material?.dispose();
      this.geometry?.dispose();
      this.material = null;
      this.geometry = null;
      this.refCount = 0;
    }
  }

  /**
   * Applica una variante shader alle uniforms del material condiviso.
   * Chiamato prima del render di ogni task per differenziare A/B/C.
   */
  setVariant(variant: ShaderVariant, width: number, height: number): void {
    if (!this.material) return;

    const u = this.material.uniforms;
    u.uResolution.value.set(width, height);
    u.uColorA.value.set(...variant.colorA);
    u.uColorB.value.set(...variant.colorB);
    u.uFillTint.value.set(...variant.fillTint);
    u.uFrequency.value = variant.frequency ?? 5.5;
    u.uAmplitude.value = variant.amplitude ?? 24.0;
    u.uRotationSpread.value = variant.rotationSpread ?? 820.0;
    u.uCutAngle.value = variant.cutAngle ?? -5.0;
    u.uSpeed.value = variant.speed ?? 1.0;
  }

  /**
   * Aggiorna uniform uTime per l'animazione.
   * Chiamato dal sharedRenderer nel loop globale.
   */
  updateTime(time: number): void {
    if (this.material) {
      this.material.uniforms.uTime.value = time;
    }
  }
}

export const shaderTextRenderer = new ShaderTextRenderer();

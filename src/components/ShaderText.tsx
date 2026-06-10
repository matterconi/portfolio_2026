'use client';

import { useRef, useEffect, useId, useMemo } from 'react';
import { Scene, OrthographicCamera, Mesh } from 'three';
import { sharedRenderer } from '@/lib/sharedRenderer';
import { shaderTextRenderer } from '@/lib/shaderTextRenderer';
import type { ShaderVariant } from './WaterPlaneShader';

interface ShaderTextProps {
  children?: string;
  className?: string;
  fontSize?: number;
  fontWeight?: string | number;
  fontFamily?: string;
  shaderVariant: ShaderVariant;
  shouldAnimate?: boolean;
}

/**
 * Renders shader output masked by text shape.
 * Uses a visible <canvas> + CSS mask-image (inline SVG letter).
 * No toDataURL, no SVG pattern, no React re-renders per frame.
 */
const ShaderText: React.FC<ShaderTextProps> = ({
  children = 'A',
  className = '',
  fontSize = 480,
  fontWeight = '900',
  fontFamily = 'Arial, Helvetica, sans-serif',
  shaderVariant,
  shouldAnimate = true,
}) => {
  const uniqueId = useId();
  const taskId = `shader-text-${uniqueId.replace(/:/g, '-')}`;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stopAnimationRef = useRef<(() => void) | null>(null);
  const variantRef = useRef(shaderVariant);
  variantRef.current = shaderVariant;

  // Build the CSS mask-image SVG data URL for the letter shape
  const maskDataUrl = useMemo(() => {
    const escapedText = children
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Use a fixed viewBox so percentage-based text positioning works reliably
    const vw = 550;
    const vh = 500;
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${vw} ${vh}'><text x='${vw / 2}' y='${vh / 2}' dominant-baseline='central' text-anchor='middle' font-size='${fontSize}' font-weight='${fontWeight}' font-family='${fontFamily}' fill='white'>${escapedText}</text></svg>`;

    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  }, [children, fontSize, fontWeight, fontFamily]);

  // Setup Three.js scene + register with shared renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new Scene();
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // Match canvas pixel size to its display size
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio, 2);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);

    const { material, geometry } = shaderTextRenderer.getResources();
    const mesh = new Mesh(geometry, material);
    scene.add(mesh);

    sharedRenderer.registerTask(taskId, scene, camera, canvas, {
      beforeRender: () => {
        shaderTextRenderer.setVariant(
          variantRef.current,
          canvas.width,
          canvas.height
        );
      },
    });

    if (shouldAnimate) {
      stopAnimationRef.current = sharedRenderer.startAnimation(taskId);
    } else {
      sharedRenderer.renderOnce(taskId, performance.now() * 0.001);
    }

    return () => {
      if (stopAnimationRef.current) {
        stopAnimationRef.current();
        stopAnimationRef.current = null;
      }

      sharedRenderer.unregisterTask(taskId);
      shaderTextRenderer.releaseResources();
    };
  }, [taskId, shouldAnimate]);

  // Handle resize — update canvas pixel dimensions
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
        WebkitMaskImage: maskDataUrl,
        maskImage: maskDataUrl,
        WebkitMaskSize: 'contain',
        maskSize: 'contain' as string,
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat' as string,
        WebkitMaskPosition: 'center',
        maskPosition: 'center' as string,
      } as React.CSSProperties}
    />
  );
};

export default ShaderText;

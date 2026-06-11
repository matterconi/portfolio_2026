'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// ----- Types -----

export interface ShaderVariant {
  /** Primary bright color [r, g, b] 0-1 */
  colorA: [number, number, number];
  /** Secondary darker color [r, g, b] 0-1 */
  colorB: [number, number, number];
  /** Soft fill tint in dark areas [r, g, b] 0-1 */
  fillTint: [number, number, number];
  /** Wave frequency (default 5.5) */
  frequency?: number;
  /** Wave amplitude divisor — higher = subtler waves (default 24) */
  amplitude?: number;
  /** Noise rotation intensity in degrees (default 820) */
  rotationSpread?: number;
  /** Rotation angle for the smoothstep cut, degrees (default -5) */
  cutAngle?: number;
  /** Time multiplier for animation speed (default 1) */
  speed?: number;
}

// ----- GLSL -----

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

    // Rotate with noise
    float degree = noise(vec2(t * 0.1, tuv.x * tuv.y));
    tuv.y *= 1.0 / ratio;
    tuv *= Rot(radians((degree - 0.5) * uRotationSpread + 180.0));
    tuv.y *= ratio;

    // Wave warp
    float speed = t * 2.0;
    tuv.x += sin(tuv.y * uFrequency + speed) / uAmplitude;
    tuv.y += sin(tuv.x * uFrequency * 1.5 + speed) / (uAmplitude * 0.5);

    // Colors from uniforms
    vec3 colorBlack = vec3(0.0);
    vec3 colorBright = uColorA;
    vec3 colorDark = uColorB * 0.35;
    vec3 colorMid = uColorB;

    mat2 rotCut = Rot(radians(uCutAngle));

    // Base field
    float l1 = S(-0.1, 0.05, (tuv * rotCut).x);
    float l2 = S(-0.1, 0.05, (tuv * rotCut).x);
    float y = S(0.3, -0.5, tuv.y);

    // Chromatic offset
    float splitAmt = 0.04 + 0.03 * sin(t * 0.3);
    vec2 tuvSplit = tuv + vec2(splitAmt, splitAmt * 0.4);
    float lSplit = S(-0.1, 0.05, (tuvSplit * rotCut).x);
    float ySplit = S(0.3, -0.5, tuvSplit.y);

    vec3 baseCol = mix(mix(colorBlack, colorBright, l1), mix(colorDark, colorMid, l2), y);
    vec3 splitCol = mix(mix(colorBlack, colorBright, lSplit), mix(colorDark, colorMid, lSplit), ySplit);

    // Channel mix — use the two most prominent channels from the palette
    vec3 col = mix(baseCol, splitCol, 0.35);

    // Dark crush
    col = pow(col, vec3(1.3));
    col *= 0.9;

    // Soft fill in dark areas
    float darkMask = 1.0 - S(0.01, 0.15, length(col));
    float blotch = noise(uv * 2.5 + t * 0.06 + 3.0);
    col += uFillTint * S(0.3, 0.55, blotch) * darkMask * 0.5;

    // Film grain
    col += (grainHash(gl_FragCoord.xy + fract(t * 7.43)) * 2.0 - 1.0) * 0.08;

    gl_FragColor = vec4(col, 1.0);
  }
`;

// ----- Component -----

function ShaderQuad({ active, variant }: { active: boolean; variant: ShaderVariant }) {
  const { size } = useThree();
  const hasNotified = useRef(false);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uColorA: { value: new THREE.Vector3(...variant.colorA) },
      uColorB: { value: new THREE.Vector3(...variant.colorB) },
      uFillTint: { value: new THREE.Vector3(...variant.fillTint) },
      uFrequency: { value: variant.frequency ?? 5.5 },
      uAmplitude: { value: variant.amplitude ?? 24.0 },
      uRotationSpread: { value: variant.rotationSpread ?? 820.0 },
      uCutAngle: { value: variant.cutAngle ?? -5.0 },
      uSpeed: { value: variant.speed ?? 1.0 },
    }),
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const prevSize = useRef({ w: size.width, h: size.height });
  if (prevSize.current.w !== size.width || prevSize.current.h !== size.height) {
    uniforms.uResolution.value.set(size.width, size.height);
    prevSize.current = { w: size.width, h: size.height };
  }

  useFrame((_, delta) => {
    if (!active) return;

    if (!hasNotified.current) {
      hasNotified.current = true;
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('shaderReady'));
      }
    }
    uniforms.uTime.value += delta;
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function WaterPlaneShader({
  active = true,
  variant,
}: {
  active?: boolean;
  variant?: ShaderVariant;
}) {
  const defaultVariant: ShaderVariant = {
    colorA: [0, 1, 0],
    colorB: [0, 0.9, 0.8],
    fillTint: [0, 0.06, 0.04],
  };

  return (
    <Canvas
      style={{ position: 'absolute', inset: 0 }}
      gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
      dpr={1}
      frameloop={active ? 'always' : 'never'}
      orthographic
      camera={{ near: 0, far: 1, position: [0, 0, 0.5] }}
    >
      <ShaderQuad active={active} variant={variant ?? defaultVariant} />
    </Canvas>
  );
}

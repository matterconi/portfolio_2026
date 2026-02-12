'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

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
  varying vec2 vUv;

  #define S(a,b,t) smoothstep(a,b,t)

  mat2 Rot(float a) {
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
  }

  // iq noise
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

  // Film grain
  float grainHash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    vec2 uv = vUv;
    float ratio = uResolution.x / uResolution.y;

    vec2 tuv = uv;
    tuv -= 0.5;

    // Rotate with noise
    float degree = noise(vec2(uTime * 0.1, tuv.x * tuv.y));

    tuv.y *= 1.0 / ratio;
    tuv *= Rot(radians((degree - 0.5) * 820.0 + 180.0));
    tuv.y *= ratio;

    // Wave warp
    float frequency = 5.5;
    float amplitude = 24.0;
    float speed = uTime * 2.0;

    tuv.x += sin(tuv.y * frequency + speed) / amplitude;
    tuv.y += sin(tuv.x * frequency * 1.5 + speed) / (amplitude * 0.5);

    // Colors
    vec3 colorBlack = vec3(0.0, 0.0, 0.0);
    vec3 colorGreen = vec3(0.0, 1.0, 0.0);
    vec3 colorDarkCyan = vec3(0.0, 0.25, 0.2);
    vec3 colorCyan = vec3(0.0, 0.9, 0.8);

    mat2 rot5 = Rot(radians(-5.0));

    // Base field
    float l1 = S(-0.1, 0.05, (tuv * rot5).x);
    float l2 = S(-0.1, 0.05, (tuv * rot5).x);
    float y = S(0.3, -0.5, tuv.y);

    // Subtle chromatic offset — in post-rotation space
    float splitAmt = 0.04 + 0.03 * sin(uTime * 0.3);
    vec2 tuvSplit = tuv + vec2(splitAmt, splitAmt * 0.4);
    float lSplit = S(-0.1, 0.05, (tuvSplit * rot5).x);
    float ySplit = S(0.3, -0.5, tuvSplit.y);

    // Base color with split B channel blended in
    vec3 baseCol = mix(mix(colorBlack, colorGreen, l1), mix(colorDarkCyan, colorCyan, l2), y);
    vec3 splitCol = mix(mix(colorBlack, colorGreen, lSplit), mix(colorDarkCyan, colorCyan, lSplit), ySplit);

    vec3 col = vec3(0.0, baseCol.g, mix(baseCol.b, splitCol.b, 0.6));

    // Gentle dark crush — keep it serene
    col = pow(col, vec3(1.3));
    col *= 0.9;

    // Soft fill in dark areas — very subtle green/cyan tint
    float darkMask = 1.0 - S(0.01, 0.15, length(col));
    float blotch = noise(uv * 2.5 + uTime * 0.06 + 3.0);
    col += vec3(0.0, 0.06, 0.04) * S(0.3, 0.55, blotch) * darkMask * 0.5;

    // Film grain
    col += (grainHash(gl_FragCoord.xy + fract(uTime * 7.43)) * 2.0 - 1.0) * 0.08;

    gl_FragColor = vec4(col, 1.0);
  }
`;

// ----- Component -----

function ShaderQuad() {
  const { size } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
    }),
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const prevSize = useRef({ w: size.width, h: size.height });
  if (prevSize.current.w !== size.width || prevSize.current.h !== size.height) {
    uniforms.uResolution.value.set(size.width, size.height);
    prevSize.current = { w: size.width, h: size.height };
  }

  useFrame((_, delta) => {
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

export default function WaterPlaneShader() {
  return (
    <Canvas
      style={{ position: 'absolute', inset: 0 }}
      gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
      dpr={1}
      orthographic
      camera={{ near: 0, far: 1, position: [0, 0, 0.5] }}
    >
      <ShaderQuad />
    </Canvas>
  );
}

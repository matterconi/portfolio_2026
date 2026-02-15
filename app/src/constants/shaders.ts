export const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

export const fragmentShader = /* glsl */ `
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

    // Channel mix
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

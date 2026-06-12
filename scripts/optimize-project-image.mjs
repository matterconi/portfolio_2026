#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { dirname, extname, isAbsolute, join, resolve } from 'node:path';

const [, , sourceArg, outputArg, widthArg = '1200', qualityArg = '82'] = process.argv;

if (!sourceArg || !outputArg) {
  console.error('Usage: npm run image:project -- <source> <output-name-or-path> [width=1200] [quality=82]');
  process.exit(1);
}

const source = resolve(sourceArg);
if (!existsSync(source)) {
  console.error(`Source image not found: ${source}`);
  process.exit(1);
}

const width = Number.parseInt(widthArg, 10);
const quality = Number.parseInt(qualityArg, 10);

if (!Number.isFinite(width) || width <= 0) {
  console.error(`Invalid width: ${widthArg}`);
  process.exit(1);
}

if (!Number.isFinite(quality) || quality < 1 || quality > 100) {
  console.error(`Invalid quality: ${qualityArg}`);
  process.exit(1);
}

const outputBase = isAbsolute(outputArg) ? outputArg : join('public/images/projects', outputArg);
const output = resolve(extname(outputBase) ? outputBase : `${outputBase}.webp`);
mkdirSync(dirname(output), { recursive: true });

const result = spawnSync(
  'cwebp',
  ['-q', String(quality), '-m', '6', '-resize', String(width), '0', source, '-o', output],
  { stdio: 'inherit' },
);

if (result.error) {
  console.error('Unable to run cwebp. Install it with: brew install webp');
  process.exit(1);
}

process.exit(result.status ?? 0);

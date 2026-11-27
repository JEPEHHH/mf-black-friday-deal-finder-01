// Hand-in program for Bargain Beacon. Node 22, standard library only, no network.
// It copies app/ and screenshots/ into the output directory and writes dossier.json
// with make.fun's library, which the grader rebuilds byte for byte for its check.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const target = process.env.MAKEFUN_OUTPUT_DIR || '/output';

// The grader's limits, kept in one place so a change is easy to spot.
const limits = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216
};

mkdirSync(target, { recursive: true });
cpSync(join(here, 'app'), join(target, 'app'), { recursive: true });
mkdirSync(join(target, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(target, 'screenshots'), { recursive: true });
}

writeFileSync(
  join(target, 'dossier.json'),
  buildDossier(target, limits),
  'utf8'
);

// Post-build: drop a package.json "type" marker into each output dir so Node
// interprets dist/esm/*.js as ES modules and dist/cjs/*.js as CommonJS,
// regardless of the root package.json "type".
import { renameSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
writeFileSync(join(root, 'dist/esm/package.json'), `${JSON.stringify({ type: 'module' }, null, 2)}\n`);
writeFileSync(join(root, 'dist/cjs/package.json'), `${JSON.stringify({ type: 'commonjs' }, null, 2)}\n`);
renameSync(join(root, 'dist/cjs/worker-entry.cjs.js'), join(root, 'dist/cjs/worker.js'));
console.log('fixup-dual: wrote dist/esm/package.json and dist/cjs/package.json');

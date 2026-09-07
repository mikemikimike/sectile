import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { syncPublicSignatures } from '../tools/tooling/public-signatures.mjs';
import { publishedPackageDirectories } from './lib/published-packages.mjs';
import { root } from './lib/repository.mjs';

async function main() {
  const args = process.argv.slice(2).filter((arg) => arg !== '--');
  const write = args.includes('--write');
  const requested = args.filter((arg) => arg !== '--write').map((arg) => arg.replace(/^@sectile\//u, ''));
  for (const name of requested) assert.ok(publishedPackageDirectories.includes(name), `Unknown package or option: ${name}`);
  const selected = requested.length === 0 ? publishedPackageDirectories : [...new Set(requested)];
  for (const name of selected) await syncPublicSignatures(resolve(root, 'packages', name), write);
  console.log(`public signatures ${write ? 'updated' : 'passed'}: ${selected.length} packages`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();

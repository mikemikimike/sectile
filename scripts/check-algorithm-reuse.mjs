#!/usr/bin/env node
import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { collectAlgorithmReuseInventory, renderAlgorithmReuseInventory, validateGeneratedAlgorithmReuse } from './lib/algorithm-reuse.mjs';
import { root } from './lib/repository.mjs';

export async function syncAlgorithmReuse(repositoryRoot, write = false) {
  const path = (relative) => resolve(repositoryRoot, relative);
  const manifest = JSON.parse(await readFile(path('verification/algorithm-reuse/manifest.json'), 'utf8'));
  const inventory = await collectAlgorithmReuseInventory(repositoryRoot, manifest);
  const inventoryPath = path('verification/algorithm-reuse/inventory.json');
  const documentationPath = path('docs/engineering/algorithm-reuse.md');
  if (write) {
    await writeFile(inventoryPath, `${JSON.stringify(inventory, null, 2)}\n`, 'utf8');
    await writeFile(documentationPath, renderAlgorithmReuseInventory(inventory), 'utf8');
    return { status: 'updated', packages: inventory.packages.length, findings: inventory.findings.length };
  }
  const stored = JSON.parse(await readFile(inventoryPath, 'utf8'));
  validateGeneratedAlgorithmReuse(inventory, stored, await readFile(documentationPath, 'utf8'));
  const gates = JSON.parse(await readFile(path('verification/algorithm-reuse/gates.json'), 'utf8'));
  const packageJSON = JSON.parse(await readFile(path('package.json'), 'utf8'));
  assert.equal(gates.schemaVersion, 1, 'unsupported algorithm-reuse gate schema');
  assert.equal(gates.command, 'pnpm check:algorithm-reuse');
  assert.equal(packageJSON.scripts['check:algorithm-reuse'], 'node scripts/check-algorithm-reuse.mjs');
  assert.equal(new Set(gates.workItems).size, gates.workItems.length, 'duplicate algorithm-reuse work-item gate');
  return { status: 'passed', packages: inventory.packages.length, findings: inventory.findings.length, gatedWorkItems: gates.workItems.length };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2).filter((arg) => arg !== '--');
  assert.ok(args.length === 0 || (args.length === 1 && args[0] === '--write'), 'Usage: check-algorithm-reuse.mjs [--write]');
  console.log(JSON.stringify(await syncAlgorithmReuse(root, args[0] === '--write')));
}

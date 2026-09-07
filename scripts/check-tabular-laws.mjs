import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { root } from './lib/repository.mjs';

const registry = JSON.parse(await readFile(join(root, 'verification/tabular/law-registry.json'), 'utf8'));
const evidence = JSON.parse(await readFile(join(root, 'verification/tabular/law-evidence.json'), 'utf8'));
const ids = registry.laws.map((law) => law.id);
assert.equal(new Set(ids).size, ids.length);
assert.deepEqual(Object.keys(evidence.evidence).sort(), [...ids].sort());
for (const id of ids) {
  const path = evidence.evidence[id];
  const source = await readFile(join(root, path), 'utf8');
  assert.equal(source.includes(id), true, `${path} does not name ${id}`);
}
console.log(JSON.stringify({ status: 'passed', laws: ids.length, evidenceFiles: new Set(Object.values(evidence.evidence)).size }, null, 2));

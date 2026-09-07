import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
  classifyFindings,
  collectAlgorithmReuseInventory,
  renderAlgorithmReuseInventory,
  scanSource,
  validateGeneratedAlgorithmReuse,
  validateManifest,
} from './lib/algorithm-reuse.mjs';

const manifest = JSON.parse(await readFile('verification/algorithm-reuse/manifest.json', 'utf8'));

test('algorithm reuse inventory covers all packages and approved migration owners', async () => {
  const inventory = await collectAlgorithmReuseInventory(process.cwd(), manifest);
  assert.deepEqual(new Set(inventory.findings.map(({ path }) => path.split('/')[1])), new Set(inventory.packages));
  assert.ok(inventory.findings.length > 0);
  assert.ok(inventory.findings.every((entry) => entry.classification !== 'migration-required' || typeof entry.owner === 'string'));
});

test('intentional hot-path bypass fixtures are rejected as unclassified', () => {
  const fixtures = [
    ['raw identity lookup', 'values.find((value) => value.id === id)'],
    ['repeated immutable view', 'new IndexedSequence(values)'],
    ['whole-domain validation', 'const valid = tryCreateWidgetState(state)'],
    ['discarded index', 'new Map(values.map((value) => [value.id, value]))'],
    ['duplicate measurement', 'element.getBoundingClientRect()'],
    ['controller rebuild', 'watch(() => props.items, connect)'],
  ];
  for (const [name, source] of fixtures) {
    const findings = scanSource('packages/vue/src/intentional-fixture.ts', source, manifest.detectors);
    assert.ok(findings.length > 0, `${name}: detector did not fire`);
    assert.throws(() => classifyFindings(findings, { ...manifest, rules: [] }), /unclassified/u, name);
  }
});

test('multiply classified, multiply owned, and stale generated inventory fixtures fail', async () => {
  const finding = scanSource('packages/core/src/fixture.ts', 'values.find((value) => value)', manifest.detectors);
  const duplicateRules = [
    { id: 'a', detectors: ['raw-identity-lookup'], paths: ['packages/core/src/fixture.ts'], classification: 'reuse', owner: null, rationale: 'fixture' },
    { id: 'b', detectors: ['raw-identity-lookup'], paths: ['packages/core/src/fixture.ts'], classification: 'reuse', owner: null, rationale: 'fixture' },
  ];
  assert.throws(() => classifyFindings(finding, { ...manifest, rules: duplicateRules }), /multiply classified/u);
  assert.throws(() => validateManifest({
    ...manifest,
    rules: [{ id: 'owned', detectors: ['*'], paths: ['packages/core/src/fixture.ts'], classification: 'migration-required', owner: ['WI-013', 'WI-014'], rationale: 'fixture' }],
  }), /exactly one migration owner/u);
  const inventory = await collectAlgorithmReuseInventory(process.cwd(), manifest);
  assert.throws(
    () => validateGeneratedAlgorithmReuse(inventory, inventory, `${renderAlgorithmReuseInventory(inventory)}stale\n`),
    /documentation drifted/u,
  );
});

test('every downstream runtime work item retains the reuse ratchet', async () => {
  const gates = JSON.parse(await readFile('verification/algorithm-reuse/gates.json', 'utf8'));
  assert.equal(gates.schemaVersion, 1);
  assert.equal(gates.command, 'pnpm check:algorithm-reuse');
  assert.equal(new Set(gates.workItems).size, 33);
  assert.equal(gates.workItems.length, 33);
});

test('reuse checks preserve stored evidence until an explicit update', async () => {
  const { mkdir, mkdtemp, writeFile, rm } = await import('node:fs/promises');
  const { tmpdir } = await import('node:os');
  const { join } = await import('node:path');
  const { syncAlgorithmReuse } = await import('./check-algorithm-reuse.mjs');
  const { publishedPackageDirectories } = await import('./lib/published-packages.mjs');
  const fixture = await mkdtemp(join(tmpdir(), 'sectile-reuse-'));
  try {
    for (const name of publishedPackageDirectories) await mkdir(join(fixture, 'packages', name, 'src'), { recursive: true });
    await mkdir(join(fixture, 'verification/algorithm-reuse'), { recursive: true });
    await mkdir(join(fixture, 'docs/engineering'), { recursive: true });
    await writeFile(join(fixture, 'verification/algorithm-reuse/manifest.json'), JSON.stringify(manifest));
    await writeFile(join(fixture, 'verification/algorithm-reuse/gates.json'), JSON.stringify({ schemaVersion: 1, command: 'pnpm check:algorithm-reuse', workItems: [] }));
    await writeFile(join(fixture, 'package.json'), JSON.stringify({ scripts: { 'check:algorithm-reuse': 'node scripts/check-algorithm-reuse.mjs' } }));
    await syncAlgorithmReuse(fixture, true);
    await syncAlgorithmReuse(fixture);
    const path = join(fixture, 'docs/engineering/algorithm-reuse.md');
    const stored = await readFile(path, 'utf8');
    await writeFile(path, `${stored}stale\n`);
    await assert.rejects(syncAlgorithmReuse(fixture), /documentation drifted/u);
    assert.equal(await readFile(path, 'utf8'), `${stored}stale\n`);
    await syncAlgorithmReuse(fixture, true);
    await syncAlgorithmReuse(fixture);
    assert.equal(await readFile(path, 'utf8'), stored);
  } finally { await rm(fixture, { recursive: true, force: true }); }
});

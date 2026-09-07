import assert from 'node:assert/strict';
import { cp, mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { root } from '../lib/repository.mjs';
import { spawnSyncPortable } from '../../tools/tooling/portable-process.mjs';
import { benchmarkSourceMetadata } from './source-metadata.mjs';

const [mode = 'build', ...args] = process.argv.slice(2);
assert.ok(['build', 'dev', 'docs'].includes(mode), 'Usage: run.mjs [build|dev|docs] [--prepared]');
assert.ok(args.length === 0 || (args.length === 1 && args[0] === '--prepared'), 'Only --prepared is supported.');
const benchmarkRoot = join(root, 'benchmarks/virtual-ecosystem');
function run(arguments_, cwd, env = process.env) {
  const result = spawnSyncPortable('pnpm', arguments_, { cwd, env, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

if (args[0] !== '--prepared') {
  run(['-r', '--filter', './packages/*', '--workspace-concurrency=1', 'run', 'build'], root);
}
const env = { ...process.env, SECTILE_BENCHMARK_SOURCE: JSON.stringify(benchmarkSourceMetadata()) };
run(['run', mode === 'dev' ? 'dev' : 'build', ...(mode === 'docs' ? ['--base', './'] : [])], benchmarkRoot, env);
if (mode === 'docs') {
  const destination = join(root, 'docs/public/benchmark-runner');
  await rm(destination, { recursive: true, force: true });
  await mkdir(destination, { recursive: true });
  await cp(join(benchmarkRoot, 'dist'), destination, { recursive: true });
}

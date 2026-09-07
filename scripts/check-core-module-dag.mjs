#!/usr/bin/env node
import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { analyzeCoreModuleDAG, renderCoreModuleDAG, validateGeneratedArtifacts } from './lib/core-module-dag.mjs';
import { root } from './lib/repository.mjs';

const args = process.argv.slice(2);
assert.ok(args.length === 0 || (args.length === 1 && args[0] === '--write'), 'Usage: check-core-module-dag.mjs [--write]');
const graph = await analyzeCoreModuleDAG(resolve(root, 'packages/core'));
const graphPath = resolve(root, 'verification/core-layers/graph.json');
const documentationPath = resolve(root, 'docs/engineering/core-module-dag.md');
if (args[0] === '--write') {
  await mkdir(resolve(root, 'verification/core-layers'), { recursive: true });
  await writeFile(graphPath, `${JSON.stringify(graph, null, 2)}\n`);
  await writeFile(documentationPath, renderCoreModuleDAG(graph));
} else {
  validateGeneratedArtifacts(graph, JSON.parse(await readFile(graphPath, 'utf8')), await readFile(documentationPath, 'utf8'));
}
console.log(JSON.stringify({ status: args[0] === '--write' ? 'updated' : 'passed', modules: graph.modules.length, edges: graph.edges.length, publicSubpaths: graph.publicSubpaths.length }));

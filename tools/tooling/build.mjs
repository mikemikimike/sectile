#!/usr/bin/env node
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, realpathSync } from 'node:fs';
import { rm } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { compactJavaScript } from './compact-javascript.mjs';

/** Keep language, environment and input policy in the package's TypeScript project. */
export function packageBuildCommand(packageRoot, mode = 'production') {
  assert.ok(mode === 'production' || mode === 'verification', `Unknown build mode: ${mode}`);
  const cwd = resolve(packageRoot);
  const manifest = JSON.parse(readFileSync(resolve(cwd, 'package.json'), 'utf8'));
  assert.ok(manifest.name?.startsWith('@sectile/'), 'Build from a Sectile package directory.');
  const production = mode === 'production';
  const project = production && existsSync(resolve(cwd, 'tsconfig.build.json'))
    ? 'tsconfig.build.json' : 'tsconfig.json';
  assert.ok(existsSync(resolve(cwd, project)), `Missing package project: ${project}`);
  const require = createRequire(resolve(cwd, 'package.json'));
  const compilerPackage = require.resolve('typescript/package.json');
  const compilerManifest = JSON.parse(readFileSync(compilerPackage, 'utf8'));
  assert.equal(typeof compilerManifest.bin?.tsc, 'string', 'TypeScript must expose its tsc CLI.');
  const compiler = resolve(dirname(compilerPackage), compilerManifest.bin.tsc);
  const output = production ? 'dist' : '.verification-dist';
  const args = [
    compiler, '--project', project,
    '--noEmit', 'false', '--noEmitOnError', 'true',
    '--composite', 'false', '--incremental', 'false',
    '--allowImportingTsExtensions', 'false',
    '--declaration', String(production), '--declarationMap', 'false',
    '--emitDeclarationOnly', 'false',
    '--rootDir', 'src', '--outDir', output,
    '--sourceMap', String(production), '--inlineSourceMap', 'false', '--inlineSources', 'false',
    '--newLine', 'lf', '--pretty', 'false',
    ...(production ? [] : ['--isolatedDeclarations', 'false']),
  ];
  return { cwd, args, output: resolve(cwd, output), production };
}

export function readBuildConfig(packageRoot, mode) {
  const command = packageBuildCommand(packageRoot, mode);
  const result = spawnSync(process.execPath, [...command.args, '--showConfig'], {
    cwd: command.cwd, encoding: 'utf8',
  });
  if (result.error) throw result.error;
  assert.equal(result.status, 0, result.stdout + result.stderr);
  return JSON.parse(result.stdout);
}

async function main() {
  const [mode = 'production', ...options] = process.argv.slice(2);
  assert.ok(options.length === 0 || (options.length === 1 && options[0] === '--show-config'),
    'Usage: build.mjs [production|verification] [--show-config]');
  const command = packageBuildCommand(process.cwd(), mode);
  if (options[0] === '--show-config') {
    console.log(JSON.stringify(readBuildConfig(command.cwd, mode), null, 2));
    return;
  }
  await rm(command.output, { recursive: true, force: true });
  const result = spawnSync(process.execPath, command.args, { cwd: command.cwd, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) { process.exitCode = result.status ?? 1; return; }
  if (command.production) await compactJavaScript(command.output);
}

if (process.argv[1] && existsSync(process.argv[1])
  && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))) await main();

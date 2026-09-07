import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import test from 'node:test';
import { publishedPackageDirectories } from './lib/published-packages.mjs';
import { listFiles, readJSON, relativeToRoot, root } from './lib/repository.mjs';
import { loadPublishedPackageGraph } from './lib/workspace-graph.mjs';

test('published packages follow their workspace dependency order', async () => {
  const graph = await loadPublishedPackageGraph();
  const position = new Map(graph.order.map(({ name }, index) => [name, index]));
  assert.deepEqual(new Set(graph.order.map(({ directory }) => directory)), new Set(publishedPackageDirectories));
  for (const entry of graph.order) {
    for (const dependency of entry.dependencies) {
      assert.ok(position.get(dependency) < position.get(entry.name), `${dependency} must precede ${entry.name}`);
    }
  }
});

test('full verification packs the same publication artifacts used by release', async () => {
  const source = await readFile(join(root, 'scripts', 'verify.mjs'), 'utf8');
  assert.match(source, /prepare publication artifacts/u);
  assert.match(source, /publish-packages\.mjs/u);
  assert.match(source, /'--pack-only'/u);
  assert.match(source, /'--prepared'/u);
  assert.match(source, /--pack-destination=\$\{publicationPackDirectory\}/u);
  assert.match(source, /--tarball-directory=\$\{publicationPackDirectory\}/u);
});

test('runtime tests consume verification artifacts instead of production dist', async () => {
  const offenders = [];
  for (const directory of publishedPackageDirectories) {
    for (const relativeDirectory of ['tests', 'type-tests']) {
      const testRoot = join(root, 'packages', directory, relativeDirectory);
      let paths;
      try {
        paths = await listFiles(testRoot);
      } catch (error) {
        if (error?.code === 'ENOENT') continue;
        throw error;
      }
      for (const path of paths) {
        const source = await readFile(path, 'utf8');
        if (/(?:\.\.\/)+dist\//u.test(source)) offenders.push(relativeToRoot(path));
      }
    }
  }
  assert.deepEqual(offenders, []);
});

test('package script entrypoints are local or declared tooling binaries', async () => {
  const { access } = await import('node:fs/promises');
  const { relative, resolve } = await import('node:path');
  for (const directory of publishedPackageDirectories) {
    const packageRoot = join(root, 'packages', directory);
    const manifest = await readJSON(join(packageRoot, 'package.json'));
    assert.equal(manifest.devDependencies['@sectile/tooling'], 'workspace:*');
    assert.equal(manifest.dependencies?.['@sectile/tooling'], undefined);
    assert.equal(manifest.peerDependencies?.['@sectile/tooling'], undefined);
    assert.equal(manifest.scripts.verify, undefined, `${manifest.name} owns a composite verify script`);
    const visited = new Set();
    const inspectLocalImports = async (entry) => {
      if (visited.has(entry)) return;
      visited.add(entry);
      const source = await readFile(entry, 'utf8');
      for (const match of source.matchAll(/(?:from\s+|import\s+)['"](\.[^'"]+\.mjs)['"]/gu)) {
        const dependency = resolve(entry, '..', match[1]);
        assert.equal(relative(packageRoot, dependency).startsWith('..'), false, `${manifest.name}: ${entry} imports ${match[1]}`);
        await inspectLocalImports(dependency);
      }
    };
    for (const [task, command] of Object.entries(manifest.scripts)) {
      for (const match of command.matchAll(/(?:^|&&\s+)node\s+([^\s]+\.mjs)\b/gu)) {
        const entry = resolve(packageRoot, match[1]);
        assert.equal(relative(packageRoot, entry).startsWith('..'), false, `${manifest.name} ${task}`);
        await access(entry);
        await inspectLocalImports(entry);
      }
    }
  }
});

test('workspace verification reuses package build artifacts instead of repeating typecheck builds', async () => {
  const source = await readFile(join(root, 'scripts', 'verify.mjs'), 'utf8');
  const pipeline = source.slice(source.indexOf('const packagePipelines'), source.indexOf('const steps ='));
  assert.equal(pipeline.includes("'typecheck',"), false);
  assert.match(pipeline, /@sectile\/chart[^\n]+typecheck:public:prepared/u);
  assert.match(pipeline, /@sectile\/vue[\s\S]+typecheck:public:prepared/u);
  assert.match(pipeline, /releaseRequested \? 'check:verification:determinism' : 'check:verification'/u);

  const chart = await readJSON(join(root, 'packages', 'chart', 'package.json'));
  assert.equal(chart.scripts['typecheck:public:prepared'], 'tsc --project type-tests/tsconfig.json --pretty false');
  assert.match(chart.scripts['typecheck:public'], /run build && pnpm --silent run typecheck:public:prepared/u);

  const vue = await readJSON(join(root, 'packages', 'vue', 'package.json'));
  assert.match(vue.scripts['typecheck:public'], /run build && pnpm --silent run typecheck:public:prepared/u);
  assert.ok(vue.scripts['typecheck:public:prepared'].includes('type-tests/tsconfig.json'));

  const core = await readJSON(join(root, 'packages', 'core', 'package.json'));
  assert.equal(core.scripts['check:verification:determinism'], 'node scripts/check-verification.mjs --determinism');

  assert.match(source, /reproducible package builds/u);
  assert.match(source, /check-reproducible-builds\.mjs/u);
  assert.match(source, /'--prepared'/u);
  const reproducibility = await readFile(join(root, 'scripts', 'check-reproducible-builds.mjs'), 'utf8');
  assert.match(reproducibility, /verifyReproducibleBuild/u);
});

test('package build modes share effective source policy and isolate their outputs', async () => {
  const { spawnSync } = await import('node:child_process');
  const { packageBuildCommand, readBuildConfig } = await import('@sectile/tooling/build');
  for (const directory of publishedPackageDirectories) {
    const packageRoot = join(root, 'packages', directory);
    const command = packageBuildCommand(packageRoot);
    const source = spawnSync(process.execPath, [command.args[0], '--project', 'tsconfig.json', '--showConfig'], {
      cwd: packageRoot, encoding: 'utf8', timeout: 30_000,
    });
    assert.ifError(source.error);
    assert.equal(source.status, 0, source.stdout + source.stderr);
    const policy = JSON.parse(source.stdout).compilerOptions;
    for (const mode of ['production', 'verification']) {
      const config = readBuildConfig(packageRoot, mode);
      for (const option of ['target', 'module', 'moduleResolution', 'lib', 'types', 'strict', 'skipLibCheck']) {
        assert.deepEqual(config.compilerOptions[option], policy[option], `${directory} ${mode}: ${option}`);
      }
      assert.equal(config.compilerOptions.outDir, mode === 'production' ? './dist' : './.verification-dist');
      assert.equal(config.compilerOptions.declaration, mode === 'production');
      assert.equal(config.compilerOptions.sourceMap, mode === 'production');
      assert.equal(config.compilerOptions.noEmitOnError, true);
      if (directory === 'core' || directory === 'chart') {
        assert.equal(config.files.some((path) => path.includes('/internal/reference/')), mode === 'verification');
      }
    }
  }
});

test('shared package builder preserves other outputs and fails closed on invalid input', async () => {
  const { mkdir, mkdtemp, readdir, rm, symlink, writeFile } = await import('node:fs/promises');
  const { spawnSync } = await import('node:child_process');
  const { createRequire } = await import('node:module');
  const { dirname } = await import('node:path');
  await mkdir(join(root, '.tmp'), { recursive: true });
  const fixture = await mkdtemp(join(root, '.tmp', 'build-contract-'));
  const compiler = createRequire(join(root, 'packages/core/package.json')).resolve('typescript/package.json');
  const tooling = createRequire(import.meta.url).resolve('@sectile/tooling/package.json');
  const run = (...args) => {
    const entry = createRequire(join(fixture, 'package.json')).resolve('@sectile/tooling/build');
    const result = spawnSync(process.execPath, [entry, ...args], {
      cwd: fixture, encoding: 'utf8', timeout: 30_000,
    });
    assert.ifError(result.error);
    return result;
  };
  const pass = (...args) => {
    const result = run(...args);
    assert.equal(result.status, 0, result.stdout + result.stderr);
    return result;
  };
  try {
    await mkdir(join(fixture, 'src/internal/reference'), { recursive: true });
    await mkdir(join(fixture, 'node_modules/@sectile'), { recursive: true });
    await symlink(dirname(compiler), join(fixture, 'node_modules/typescript'), 'junction');
    await symlink(dirname(tooling), join(fixture, 'node_modules/@sectile/tooling'), 'junction');
    await writeFile(join(fixture, 'package.json'), JSON.stringify({ name: '@sectile/build-fixture', type: 'module', devDependencies: { '@sectile/tooling': 'workspace:*', typescript: '7.0.2' } }));
    await writeFile(join(fixture, 'tsconfig.json'), JSON.stringify({
      extends: '@sectile/tooling/tsconfig.base.json',
      compilerOptions: { noEmit: true, lib: ['ES2022'] }, include: ['src/**/*.ts'],
    }));
    await writeFile(join(fixture, 'tsconfig.build.json'), JSON.stringify({
      extends: './tsconfig.json', exclude: ['src/internal/reference/**/*.ts'],
    }));
    await writeFile(join(fixture, 'src/index.ts'), 'export const value: number = 1;\n');
    await writeFile(join(fixture, 'src/internal/reference/oracle.ts'), 'export const oracle: number = 2;\n');
    pass('production');
    const production = await readFile(join(fixture, 'dist/index.js'), 'utf8');
    assert.ok((await readFile(join(fixture, 'dist/index.d.ts'), 'utf8')).includes('value'));
    assert.equal((await readdir(join(fixture, 'dist'), { recursive: true })).some((path) => path.includes('oracle')), false);
    pass('verification');
    const verification = await readFile(join(fixture, '.verification-dist/index.js'), 'utf8');
    assert.ok((await readFile(join(fixture, '.verification-dist/internal/reference/oracle.js'), 'utf8')).includes('oracle'));
    assert.equal((await readdir(join(fixture, '.verification-dist'), { recursive: true })).some((path) => /\.(?:map|d\.ts)$/u.test(path)), false);
    assert.equal(await readFile(join(fixture, 'dist/index.js'), 'utf8'), production);
    assert.notEqual(run('unknown-mode').status, 0);
    assert.equal(await readFile(join(fixture, 'dist/index.js'), 'utf8'), production);
    pass('production', '--show-config');
    assert.equal(await readFile(join(fixture, 'dist/index.js'), 'utf8'), production);
    await writeFile(join(fixture, 'src/index.ts'), 'export const value: unknown = document;\n');
    const rejected = run('production');
    assert.notEqual(rejected.status, 0);
    assert.match(rejected.stdout + rejected.stderr, /Cannot find name 'document'/u);
    await assert.rejects(readFile(join(fixture, 'dist/index.js')), { code: 'ENOENT' });
    assert.equal(await readFile(join(fixture, '.verification-dist/index.js'), 'utf8'), verification);
  } finally { await rm(fixture, { recursive: true, force: true }); }
});

test('Vue tests use managed Happy DOM windows', async () => {
  const testRoot = join(root, 'packages', 'vue', 'tests');
  const offenders = [];
  for (const path of await listFiles(testRoot)) {
    if (!path.endsWith('.test.mjs')) continue;
    const source = await readFile(path, 'utf8');
    if (/from 'happy-dom'/u.test(source)) offenders.push(relativeToRoot(path));
  }
  assert.deepEqual(offenders, []);

  const helper = await readFile(join(testRoot, 'happy-dom.mjs'), 'utf8');
  assert.match(helper, /__VUE_DEVTOOLS_GLOBAL_HOOK__/u);
  assert.match(helper, /happyDOM\.abort\(\)/u);
  assert.match(helper, /happyDOM\.close\(\)/u);
});

test('package ownership accepts local files and rejects upwards imports, commands and configs', async () => {
  const { assertPackageCommand, assertPackageSource } = await import('./check-workspace-boundaries.mjs');
  const owner = join(root, '.tmp/ownership-fixture');
  for (const command of ['node scripts/check.mjs', 'sectile-build production', 'tsc -p tsconfig.json']) assertPackageCommand(command);
  for (const command of ['node ../scripts/check.mjs', 'pnpm --filter @sectile/core build', 'pnpm -w build']) {
    assert.throws(() => assertPackageCommand(command), /outside|orchestration/u);
  }
  assertPackageSource(owner, join(owner, 'src/nested/index.ts'), "import '../local.js'; import '@sectile/core/result';");
  for (const source of [
    "import '../../other/src/index.js';",
    "readFile(new URL('../../policy.json', import.meta.url));",
    '{"extends":"../../tsconfig.json"}',
    "resolve(import.meta.dirname, '../../shared/check.mjs');",
  ]) assert.throws(() => assertPackageSource(owner, join(owner, 'src/index.ts'), source), /outside package/u);
});

test('public signature checks are read-only and explicit updates share their collector', async () => {
  const { mkdtemp, mkdir, writeFile, rm } = await import('node:fs/promises');
  const { tmpdir } = await import('node:os');
  const { syncPublicSignatures } = await import('@sectile/tooling/public-signatures');
  const fixture = await mkdtemp(join(tmpdir(), 'sectile-signature-'));
  try {
    await mkdir(join(fixture, 'dist'));
    await writeFile(join(fixture, 'package.json'), JSON.stringify({ name: '@fixture/consumer', exports: { '.': { types: './dist/index.d.ts' } } }));
    await writeFile(join(fixture, 'dist/index.d.ts'), 'export declare const value: number;\n');
    await syncPublicSignatures(fixture, true);
    const path = join(fixture, 'testing/public-signatures.json');
    const stored = await readFile(path, 'utf8');
    await syncPublicSignatures(fixture);
    await writeFile(join(fixture, 'dist/index.d.ts'), 'export declare const value: string;\n');
    await assert.rejects(syncPublicSignatures(fixture), /signature drift/u);
    assert.equal(await readFile(path, 'utf8'), stored);
    await syncPublicSignatures(fixture, true);
    await syncPublicSignatures(fixture);
  } finally { await rm(fixture, { recursive: true, force: true }); }
});

import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import { dirname, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { root } from './lib/repository.mjs';

const sourceExtension = /\.(?:[cm]?js|[cm]?ts|tsx|jsx|vue)$/u;
const configName = /(?:^|\/)tsconfig[^/]*\.json$/u;
const dependencyFields = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];
const inside = (owner, target) => { const path = relative(owner, target); return path !== '..' && !path.startsWith(`..${sep}`); };

export function assertPackageCommand(command, label = 'package') {
  assert.equal(/\.\.[/\\]|(?:^|\s)(?:packages|tools|docs)[/\\]/u.test(command), false, `${label}: command accesses outside its package: ${command}`);
  assert.equal(/\b(?:pnpm|npm|yarn)\b[^;&]*(?:--filter|--workspace-root|(?:^|\s)-w(?:\s|$))/u.test(command), false, `${label}: workspace orchestration belongs to the root: ${command}`);
}

export function assertPackageReference(directory, importer, specifier) {
  const prefix = specifier.split('${')[0].replaceAll('\\', '/');
  assert.equal(inside(directory, resolve(dirname(importer), prefix)), true, `${importer}: reference outside package ${directory}: ${specifier}`);
}

export function assertPackageSource(directory, path, source) {
  // Imports, URL inputs, config aliases and literal filesystem paths share the
  // same ownership rule. Computed paths still require review at their owner.
  for (const match of source.matchAll(/(['"`])(\.\.(?:[/\\][^'"`\n]*)?)\1/gu)) {
    assertPackageReference(directory, path, match[2]);
  }
}

function dependencies(manifest) {
  return new Set(dependencyFields.flatMap((field) => Object.keys(manifest[field] ?? {})));
}

function assertDependency(manifests, manifest, declared, specifier, label) {
  if (!specifier.startsWith('@sectile/')) return false;
  const [scope, name, ...parts] = specifier.split('/');
  const dependency = `${scope}/${name}`;
  assert.ok(dependency === manifest.name || declared.has(dependency), `${label}: undeclared dependency ${dependency}`);
  const target = manifests.get(dependency);
  assert.ok(target, `${label}: unknown workspace package ${dependency}`);
  const subpath = parts.length === 0 ? '.' : `./${parts.join('/')}`;
  assert.ok(Object.hasOwn(target.manifest.exports ?? {}, subpath), `${label}: bypasses ${dependency} exports with ${specifier}`);
  assert.equal(/(^|\/)(src|dist|\.verification-dist)(\/|$)/u.test(specifier), false, `${label}: imports a package implementation path: ${specifier}`);
  return true;
}

export async function checkWorkspaceBoundaries() {
  const directories = [resolve(root, 'docs')];
  for (const parent of ['packages', 'benchmarks', 'tools']) {
    for (const entry of await readdir(resolve(root, parent), { withFileTypes: true })) {
      const directory = resolve(root, parent, entry.name);
      if (entry.isDirectory() && existsSync(resolve(directory, 'package.json'))) directories.push(directory);
    }
  }
  const manifests = new Map();
  for (const directory of directories) {
    const manifest = JSON.parse(await readFile(resolve(directory, 'package.json'), 'utf8'));
    manifests.set(manifest.name, { directory, manifest });
  }
  const rootManifest = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));
  const rootDependencies = dependencies(rootManifest);
  const files = [...new Set(execFileSync('git', ['ls-files', '-co', '--exclude-standard', '-z'], { cwd: root, encoding: 'utf8' }).split('\0'))]
    .filter((path) => path && existsSync(resolve(root, path)));
  let sourceFiles = 0;
  let workspaceImports = 0;
  for (const { directory, manifest } of manifests.values()) {
    const declared = dependencies(manifest);
    for (const [name, command] of Object.entries(manifest.scripts ?? {})) assertPackageCommand(command, `${manifest.name} ${name}`);
    if (manifest.name === '@sectile/tooling') assert.equal(manifest.private, true, 'Repository tooling is private.');
    else {
      assert.equal(manifest.dependencies?.['@sectile/tooling'], undefined, `${manifest.name}: tooling is development-only`);
      assert.equal(manifest.peerDependencies?.['@sectile/tooling'], undefined, `${manifest.name}: tooling is development-only`);
    }
    for (const file of files) {
      const path = resolve(root, file);
      if (!inside(directory, path) || !(sourceExtension.test(file) || configName.test(file))) continue;
      sourceFiles++;
      const source = await readFile(path, 'utf8');
      assertPackageSource(directory, path, source);
      if (configName.test(file)) {
        const config = JSON.parse(source);
        for (const base of [config.extends ?? []].flat()) {
          if (base.startsWith('.')) assertPackageReference(directory, path, base);
          else assertDependency(manifests, manifest, declared, base, file);
        }
        continue;
      }
      for (const specifier of importSpecifiers(source)) {
        if (specifier.startsWith('.')) assertPackageReference(directory, path, specifier);
        else if (assertDependency(manifests, manifest, declared, specifier, file)) {
          assert.equal(relative(directory, path).startsWith(`src${sep}`) && specifier.startsWith('@sectile/tooling/'), false, `${file}: runtime imports development tooling`);
          workspaceImports++;
        }
      }
    }
  }
  for (const file of files.filter((path) => path.startsWith('verification/') && sourceExtension.test(path))) {
    sourceFiles++;
    const source = await readFile(resolve(root, file), 'utf8');
    for (const specifier of importSpecifiers(source)) {
      if (specifier.startsWith('.')) {
        const target = relative(root, resolve(root, dirname(file), specifier)).split(sep).join('/');
        assert.equal(target.startsWith('packages/'), false, `${file}: directly imports a product package file: ${specifier}`);
      } else if (assertDependency(manifests, rootManifest, rootDependencies, specifier, file)) workspaceImports++;
    }
  }
  return { status: 'passed', packages: manifests.size, sourceFiles, workspaceImports };
}

function importSpecifiers(source) {
  return [...source.matchAll(/(?:from\s+|import\s*(?:\(\s*)?|require(?:\.resolve)?\(\s*)(['"])([^'"]+)\1/gu)]
    .map((match) => match[2]).filter((specifier) => !specifier.includes('${'));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(JSON.stringify(await checkWorkspaceBoundaries(), null, 2));
}

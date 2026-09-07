import assert from 'node:assert/strict';
import { join } from 'node:path';
import { execFileSyncPortable } from '../../tools/tooling/portable-process.mjs';
import { publishedPackageDirectories } from './published-packages.mjs';
import { readJSON, root } from './repository.mjs';

const dependencyFields = ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies'];

// Packing resolves private development dependencies as well as published ones.
// Ask the workspace owner, so this also works before node_modules exists.
export function loadWorkspacePackageVersions(repositoryRoot = root) {
  const projects = JSON.parse(execFileSyncPortable('pnpm', ['list', '--recursive', '--depth', '-1', '--json'], {
    cwd: repositoryRoot,
    encoding: 'utf8',
  }));
  assert.ok(Array.isArray(projects), 'pnpm must report a workspace project array');
  const versions = new Map();
  for (const project of projects) {
    // Unversioned applications are not dependency version providers.
    if (project.version === undefined) continue;
    assert.equal(typeof project.name, 'string', 'workspace package name required');
    assert.equal(typeof project.version, 'string', `${project.name}: workspace version required`);
    assert.equal(versions.has(project.name), false, `duplicate workspace package: ${project.name}`);
    versions.set(project.name, project.version);
  }
  return versions;
}

export async function loadPublishedPackageGraph() {
  const packages = await Promise.all(publishedPackageDirectories.map(async (directory) => {
    const manifest = await readJSON(join(root, 'packages', directory, 'package.json'));
    return { directory, manifest, name: manifest.name };
  }));
  const names = new Set(packages.map((entry) => entry.name));
  const byName = new Map(packages.map((entry) => [entry.name, entry]));

  for (const entry of packages) {
    entry.dependencies = dependencyFields
      .flatMap((field) => Object.entries(entry.manifest[field] ?? {}))
      .filter(([name, version]) => names.has(name) && String(version).startsWith('workspace:'))
      .map(([name]) => name)
      .filter((name, index, values) => values.indexOf(name) === index);
  }

  return Object.freeze({
    byName,
    packages: Object.freeze(packages),
    order: Object.freeze(topologicalOrder(packages, byName)),
  });
}

function topologicalOrder(packages, byName) {
  const complete = new Set();
  const ordered = [];
  while (ordered.length < packages.length) {
    let progressed = false;
    for (const entry of packages) {
      if (complete.has(entry.name)) continue;
      if (!entry.dependencies.every((name) => complete.has(byName.get(name).name))) continue;
      complete.add(entry.name);
      ordered.push(entry);
      progressed = true;
    }
    if (!progressed) {
      const blocked = packages.filter(({ name }) => !complete.has(name)).map(({ name }) => name);
      throw new Error(`workspace dependency cycle: ${blocked.join(', ')}`);
    }
  }
  return ordered;
}

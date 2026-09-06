import assert from 'node:assert/strict';
import { setImmediate } from 'node:timers/promises';
import { createFacadeConnection } from '@sectile/core/adapter-runtime';

if (typeof globalThis.gc !== 'function') throw new Error('The facade heap witness requires --expose-gc.');

const counters = { disconnectLookups: 0, disconnectCalls: 0, failures: 0 };
const fixtures = [];
const probes = [];
for (const mode of ['success', 'error', 'undefined', 'null', 'lookup']) {
  for (let cycle = 0; cycle < 8; cycle += 1) {
    const fixture = createFixture(mode);
    fixtures.push(fixture);
    for (let index = 0; index < 64; index += 1) probes.push(subscribeProbe(fixture.facade, index));
  }
}

await collect();
assert.equal(countLive('callback'), probes.length, 'connected facades must retain their subscribers');
assert.equal(countLive('payload'), probes.length, 'subscribers must retain their captured payloads');

for (const { facade, mode, failure } of fixtures) {
  if (mode === 'success') facade.destroy();
  else {
    assert.throws(() => facade.destroy(), (error) => Object.is(error, failure));
    counters.failures += 1;
  }
  facade.destroy();
}

let retainedSubscribers;
let retainedPayloads;
for (let attempt = 0; attempt < 8; attempt += 1) {
  await collect();
  retainedSubscribers = countLive('callback');
  retainedPayloads = countLive('payload');
  if (retainedSubscribers === 0 && retainedPayloads === 0) break;
}
assert.equal(retainedSubscribers, 0, 'destroy must release subscribers even after delegated cleanup fails');
assert.equal(retainedPayloads, 0, 'destroy must release subscriber closure payloads');

// Keep the facades strongly reachable throughout collection: collecting the owner
// itself would conceal its failure to release the subscriber registry.
for (const { facade } of fixtures) {
  assert.equal(facade.getSnapshot().state, 0);
  assert.equal(facade.send(1), false);
  facade.destroy();
}
assert.deepEqual(counters, { disconnectLookups: 40, disconnectCalls: 32, failures: 32 });
console.log(JSON.stringify({
  facades: fixtures.length,
  subscribed: probes.length,
  ...counters,
  retainedSubscribers,
  retainedPayloads,
}));

function createFixture(mode) {
  const failure = mode === 'undefined' ? undefined : mode === 'null' ? null : new Error('disconnect failed');
  const result = createFacadeConnection({}, () => ({
    ok: true,
    value: {
      getSnapshot: () => ({ state: 0 }),
      handleEvent: () => true,
      get disconnect() {
        counters.disconnectLookups += 1;
        if (mode === 'lookup') throw failure;
        return () => {
          counters.disconnectCalls += 1;
          if (mode !== 'success') throw failure;
        };
      },
    },
  }));
  assert.equal(result.ok, true);
  return { facade: result.value, mode, failure };
}

function subscribeProbe(facade, id) {
  const payload = { id };
  const callback = () => payload.id;
  facade.subscribe(callback);
  return { callback: new WeakRef(callback), payload: new WeakRef(payload) };
}

function countLive(property) {
  return probes.reduce((count, probe) => count + Number(probe[property].deref() !== undefined), 0);
}

async function collect() {
  // WeakRef keeps each dereferenced value alive until the current job ends.
  await setImmediate();
  globalThis.gc();
  await setImmediate();
  globalThis.gc();
}

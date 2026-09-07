import test from 'node:test';
import assert from 'node:assert/strict';
import { applyToastEvent, createToastState, tryCreateToastState } from '../../.verification-dist/toast.js';

test('toast queue announces, pauses, and dismisses after elapsed time', () => {
  let state = createToastState([], false, { defaultDurationMs: 1_000 });
  const pushed = applyToastEvent(state, { type: 'push', toast: { id: 'saved', title: 'Saved', kind: 'success' } }, { defaultDurationMs: 1_000 }).value;
  state = pushed.state;
  assert.deepEqual(pushed.commands, [{ type: 'announce-toast', id: 'saved', kind: 'success' }]);
  state = applyToastEvent(state, 'pause').value.state;
  state = applyToastEvent(state, { type: 'tick', elapsedMs: 1_000 }).value.state;
  assert.equal(state.items.length, 1);
  state = applyToastEvent(state, 'resume').value.state;
  const elapsed = applyToastEvent(state, { type: 'tick', elapsedMs: 1_000 }).value;
  assert.equal(elapsed.state.items.length, 0);
  assert.deepEqual(elapsed.commands, [{ type: 'toast-dismissed', id: 'saved', reason: 'timeout' }]);
});

test('toast queue applies a visible limit and rejects duplicate identifiers', () => {
  const state = createToastState([{ id: 'one', title: 'One' }], false, { maxVisible: 1 });
  const pushed = applyToastEvent(state, { type: 'push', toast: { id: 'two', title: 'Two' } }, { maxVisible: 1 }).value;
  assert.deepEqual(pushed.state.items.map((item) => item.id), ['two']);
  assert.equal(pushed.commands[0].reason, 'overflow');
  assert.equal(applyToastEvent(pushed.state, { type: 'push', toast: { id: 'two', title: 'Again' } }, { maxVisible: 1 }).ok, false);
});

test('toast queue preserves user-defined kinds and defaults blank kinds to info', () => {
  const state = createToastState([
    { id: 'deploying', title: 'Deploying', kind: '  deployment-pending  ' },
    { id: 'default', title: 'Default', kind: '   ' },
  ]);
  assert.equal(state.items[0].kind, 'deployment-pending');
  assert.equal(state.items[1].kind, 'info');

  const pushed = applyToastEvent(state, { type: 'push', toast: { id: 'custom', title: 'Custom', kind: 'product-specific' } }).value;
  assert.deepEqual(pushed.commands.at(-1), { type: 'announce-toast', id: 'custom', kind: 'product-specific' });
});

test('toast queue keeps a controlled timeout proposal stable after it expires', () => {
  const initial = createToastState([{ id: 'saved', title: 'Saved', durationMs: 1_000 }]);
  const expired = Object.freeze({
    items: Object.freeze([Object.freeze({ ...initial.items[0], remainingMs: 0 })]),
    paused: false,
  });
  const elapsed = applyToastEvent(expired, { type: 'tick', elapsedMs: 100 }).value;
  assert.equal(elapsed.state.items[0].remainingMs, 0);
  assert.deepEqual(elapsed.commands, []);
});

test('toast construction reads each input identity once at 1k, 4k and 16k items', () => {
  for (const size of [1_000, 4_000, 16_000]) {
    let reads = 0;
    const input = Array.from({ length: size }, (_, id) => ({
      get id() { reads += 1; return id; }, title: 'x', durationMs: null,
    }));
    const state = createToastState(input);
    assert.equal(reads, size, 'uniqueness validation does not rescan prefixes');
    assert.equal(state.items.length, size);
    assert.equal(state.items[0].id, 0);
    assert.equal(state.items.at(-1).id, size - 1);
    assert.ok(Object.isFrozen(state) && Object.isFrozen(state.items));
  }
});

test('canonical toast transitions retain constant-size pause and inert-tick work after every producer', () => {
  for (const size of [1_000, 4_000, 16_000]) {
    let state = createToastState(Array.from({ length: size }, (_, id) => ({ id, title: 'x', durationMs: null })));
    for (const event of ['pause', { type: 'tick', elapsedMs: 1 }, 'resume', { type: 'tick', elapsedMs: 0 }]) {
      const previous = state;
      const observed = toastWork(() => applyToastEvent(state, event));
      assert.equal(observed.value.ok, true);
      assert.equal(observed.trims, 0);
      assert.equal(observed.mappedItems, 0);
      state = observed.value.value.state;
      assert.equal(state.items, previous.items);
      if (typeof event === 'object') assert.equal(state, previous);
    }
    for (const event of [
      { type: 'push', toast: { id: size, title: 'Added', durationMs: 10 } },
      { type: 'update', id: size, toast: { title: 'Updated' } },
      { type: 'tick', elapsedMs: 1 },
      { type: 'dismiss', id: size },
      'dismiss-all',
    ]) {
      const changed = applyToastEvent(state, event);
      assert.equal(changed.ok, true);
      const previous = changed.value.state;
      const observed = toastWork(() => applyToastEvent(previous, 'pause'));
      assert.equal(observed.value.ok, true);
      assert.equal(observed.trims, 0, `${String(event.type ?? event)} keeps canonical item validation`);
      assert.equal(observed.mappedItems, 0);
      assert.equal(observed.value.value.state.items, previous.items);
      state = applyToastEvent(observed.value.value.state, 'resume').value.state;
    }
  }
});

test('foreign toast state remains validated after successful events and later item mutation', () => {
  const item = { ...createToastState([{ id: 'a', title: 'A' }]).items[0] };
  const foreign = { items: [item], paused: false };
  const observed = toastWork(() => applyToastEvent(foreign, 'pause'));
  assert.equal(observed.value.ok, true);
  assert.ok(observed.trims > 0 && observed.mappedItems > 0);
  const paused = observed.value.value.state;
  assert.equal(paused.items, foreign.items, 'foreign state keeps its existing aliasing semantics');
  assert.equal(Object.isFrozen(paused), true);
  item.title = ' ';
  assert.equal(applyToastEvent(paused, 'resume').error.code, 'toast-title-empty');
  item.title = 'A';
  foreign.items.push({ ...item });
  const duplicate = applyToastEvent(paused, 'resume');
  assert.equal(duplicate.error.class, 'transition-rejection');
  assert.equal(duplicate.error.code, 'toast-id-duplicate');
  foreign.items.pop();
  item.durationMs = 0;
  assert.equal(applyToastEvent(paused, 'resume').error.code, 'toast-duration-invalid');
  item.durationMs = null;
  item.remainingMs = null;
  assert.equal(applyToastEvent(paused, 'resume').ok, true);
});

test('toast provenance preserves per-call limits, duplicate errors and overflow ordering', () => {
  const state = createToastState(['a', 'b', 'c'].map((id) => ({ id, title: id, durationMs: null })));
  for (const maxVisible of [0, -1, 1.5, NaN, Number.NEGATIVE_INFINITY]) {
    for (const event of ['pause', 'resume', 'dismiss-all', { type: 'tick', elapsedMs: 0 }]) {
      const rejected = applyToastEvent(state, event, { maxVisible });
      assert.equal(rejected.error.class, 'transition-rejection');
      assert.equal(rejected.error.code, 'toast-max-visible-invalid');
    }
  }
  const paused = applyToastEvent(state, 'pause', { maxVisible: 1 }).value.state;
  assert.equal(paused.items, state.items);
  assert.equal(applyToastEvent(paused, { type: 'tick', elapsedMs: -1 }).error.code, 'toast-elapsed-invalid');
  const pushed = applyToastEvent(paused, { type: 'push', toast: { id: 'd', title: 'D' } }, { maxVisible: 1 }).value;
  assert.deepEqual(pushed.state.items.map((item) => item.id), ['d']);
  assert.deepEqual(pushed.commands, [
    ...['a', 'b', 'c'].map((id) => ({ type: 'toast-dismissed', id, reason: 'overflow' })),
    { type: 'announce-toast', id: 'd', kind: 'info' },
  ]);
  assert.equal(tryCreateToastState([{ id: 0, title: 'A' }, { id: '0', title: 'B' }]).ok, true);
  const duplicate = tryCreateToastState([{ id: 0, title: 'A' }, { id: -0, title: 'B' }], false, { maxVisible: 1 });
  assert.equal(duplicate.error.class, 'construction');
  assert.equal(duplicate.error.code, 'toast-id-duplicate', 'validation includes items preceding the visible slice');
});

function toastWork(run) {
  const trim = String.prototype.trim;
  const map = Array.prototype.map;
  let trims = 0;
  let mappedItems = 0;
  try {
    String.prototype.trim = function () { trims += 1; return trim.call(this); };
    Array.prototype.map = function (callback, thisArg) {
      return map.call(this, (...values) => { mappedItems += 1; return callback.call(thisArg, ...values); });
    };
    const value = run();
    return { value, trims, mappedItems };
  } finally {
    String.prototype.trim = trim;
    Array.prototype.map = map;
  }
}

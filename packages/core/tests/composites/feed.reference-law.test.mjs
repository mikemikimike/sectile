import assert from 'node:assert/strict'; import test from 'node:test'; import { createSequence } from '../../.verification-dist/structures/sequence.js'; import { createFeedState, applyFeedEvent, synchronizeFeedWindow } from '../../.verification-dist/feed.js'; import { createReferenceFeedState, applyReferenceFeedEvent } from '../../.verification-dist/internal/reference/composites/feed.js'; import { unwrap } from '../support.mjs'; test('finite feed window transitions match an independent reference', () => { const items = createSequence(['a', 'b']); for (const current of [null, 'a', 'b']) for (const pending of [null, 'before', 'after']) for (const event of ['next', 'previous', 'request-before', 'request-after', 'clear-request', { type: 'focus', id: 'b' }]) { const actual = applyFeedEvent(items, createFeedState(items, current, 2, pending), event); const expected = applyReferenceFeedEvent(items, createReferenceFeedState(current, 2, pending), event); assert.deepEqual(observe(actual), observeRef(expected)); } }); function observe(r) { return r.ok ? { ok: true, state: r.value.state, commands: r.value.commands } : { ok: false, errorClass: r.error.class, errorCode: r.error.code }; } function observeRef(r) { return r.ok ? { ok: true, state: r.value.state, commands: r.value.commands } : { ok: false, errorClass: r.errorClass, errorCode: r.errorCode }; }

test('feed replacement distinguishes explicit null from omitted and undefined cursors', () => {
  const items = createSequence([0, '0', 'last']);
  for (const previous of [null, 0, '0', 'last']) {
    const state = createFeedState(items, previous, 1);
    for (const replacement of [{}, { current: undefined }, { current: null }, { current: 0 }, { current: '0' }]) {
      const next = unwrap(synchronizeFeedWindow(items, state, { revision: 2, ...replacement }));
      const expected = replacement.current === undefined ? previous ?? 0 : replacement.current;
      assert.equal(next.cursor.current, expected);
      assert.equal(next.revision, 2);
      assert.equal(next.size, items.size);
      assert.equal(state.cursor.current, previous);
      assert.equal(state.revision, 1);
    }
    assert.equal(synchronizeFeedWindow(items, state, { revision: 2, current: 'missing' }).error.code, 'feed-cursor-outside-window');
  }
});

test('feed accepts an explicit empty replacement and navigates from a cleared cursor', () => {
  const items = createSequence(['a', 'b']);
  const state = createFeedState(items, 'b', 1);
  const cleared = unwrap(synchronizeFeedWindow(items, state, { revision: 2, current: null }));
  assert.equal(cleared.cursor.current, null);
  for (const [event, id] of [['next', 'a'], ['previous', 'b']]) {
    const next = unwrap(applyFeedEvent(items, cleared, event));
    assert.equal(next.state.cursor.current, id);
    assert.deepEqual(next.commands, [{ type: 'focus', id }]);
  }
  const emptyItems = createSequence([]);
  const empty = unwrap(synchronizeFeedWindow(emptyItems, state, { revision: 2, current: null, start: 0, total: 0 }));
  assert.equal(empty.cursor.current, null);
  assert.equal(empty.size, 0);
  assert.equal(empty.total, 0);
  assert.equal(unwrap(applyFeedEvent(emptyItems, empty, 'next')).state, empty);
  assert.equal(unwrap(synchronizeFeedWindow(items, empty, { revision: 3, total: null })).cursor.current, 'a');
  // Omission still validates a retained non-null cursor against the new Core domain.
  assert.equal(synchronizeFeedWindow(emptyItems, state, { revision: 2 }).error.code, 'feed-cursor-outside-window');
});

test('explicit null keeps Feed generation, revision, range and total validation intact', () => {
  const items = createSequence(['a', 'b']);
  const initial = createFeedState(items, 'b', 1, null, { total: 4 });
  const pending = unwrap(applyFeedEvent(items, initial, 'request-after')).state;
  const before = structuredClone(pending);
  const valid = { revision: 2, requestGeneration: 1, current: null, start: 0, total: 4 };
  for (const [change, code] of [
    [{ revision: 1 }, 'collection-window-revision-stale'],
    [{ requestGeneration: undefined }, 'collection-window-request-generation-required'],
    [{ requestGeneration: 2 }, 'collection-window-request-stale'],
    [{ start: -1 }, 'collection-window-start-invalid'],
    [{ start: Number.MAX_SAFE_INTEGER, total: null }, 'collection-window-range-invalid'],
    [{ total: 1 }, 'collection-window-total-invalid'],
  ]) {
    const result = synchronizeFeedWindow(items, pending, { ...valid, ...change });
    assert.equal(result.ok, false);
    assert.equal(result.error.code, code);
    assert.deepEqual(pending, before);
  }
  const empty = unwrap(synchronizeFeedWindow(createSequence([]), pending, { ...valid, total: 0 }));
  assert.equal(empty.cursor.current, null);
  assert.equal(empty.pending, null);
  assert.equal(empty.requestGeneration, 1);
  assert.equal(empty.revision, 2);
});

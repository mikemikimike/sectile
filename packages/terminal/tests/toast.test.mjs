import test from 'node:test'; import assert from 'node:assert/strict'; import { createToast } from '../.verification-dist/toast.js';
test('terminal toast exposes deterministic ticking and Escape dismissal', () => { const toast = createToast({ defaultDurationMs: 1_000 }); toast.push({ id: 'saved', title: 'Saved' }); toast.tick(500); assert.equal(toast.state.items[0].remainingMs, 500); toast.handleKeyboardInput({ key: 'escape' }); assert.equal(toast.state.items.length, 0); });

test('terminal toast publishes committed state before announce callback errors escape', () => {
  const trace = [];
  const callbackError = new Error('announce callback failed');
  const toast = createToast({
    onAnnounce: (item) => { trace.push(`announce:${item.id}`); throw callbackError; },
    onUpdate: () => { trace.push('update'); throw new Error('secondary update callback failed'); },
  });
  toast.subscribe((snapshot) => trace.push(`observer:${snapshot.revision}`));

  assert.throws(
    () => toast.push({ id: 'saved', title: 'Saved' }),
    (error) => error === callbackError,
  );
  assert.equal(toast.getSnapshot().revision, 1);
  assert.equal(toast.getSnapshot().state.items.length, 1);
  assert.deepEqual(trace, ['announce:saved', 'observer:1', 'update']);
});

test('terminal toast does not publish rejected transitions', () => {
  const trace = [];
  const toast = createToast({ onUpdate: () => trace.push('update') });
  toast.subscribe((snapshot) => trace.push(`observer:${snapshot.revision}`));

  assert.equal(toast.dismiss('missing'), false);
  assert.equal(toast.getSnapshot().revision, 0);
  assert.deepEqual(trace, []);
});

test('terminal toast publishes a nested transition once at its latest revision', () => {
  const trace = [];
  let nested = false;
  let toast;
  toast = createToast({
    onAnnounce: (item) => {
      trace.push(`announce:${item.id}`);
      if (!nested) {
        nested = true;
        assert.equal(toast.push({ id: 'nested', title: 'Nested' }), true);
      }
    },
    onUpdate: () => trace.push('update'),
  });
  toast.subscribe((snapshot) => trace.push(`observer:${snapshot.revision}`));

  assert.equal(toast.push({ id: 'outer', title: 'Outer' }), true);
  assert.equal(toast.getSnapshot().revision, 2);
  assert.deepEqual(trace, ['announce:outer', 'announce:nested', 'observer:2', 'update']);
});

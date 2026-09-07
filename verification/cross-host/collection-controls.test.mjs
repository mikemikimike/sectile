import assert from 'node:assert/strict';
import test from 'node:test';
import { createCarousel as createDOMCarousel } from '@sectile/dom/carousel';
import { createFeed as createDOMFeed } from '@sectile/dom/feed';
import { createGridControl as createDOMGrid } from '@sectile/dom/grid';
import { createCarousel as createTerminalCarousel } from '@sectile/terminal/carousel';
import { createFeed as createTerminalFeed } from '@sectile/terminal/feed';
import { createGridControl as createTerminalGrid } from '@sectile/terminal/grid';

test('DOM and terminal grids preserve navigation, disabled, selection, and edit traces', () => {
  const options = { rows: [['a', 'b', 'c'], ['d', null, 'e']], defaultHighlightedValue: 'a', disabledItems: ['b'], policies: { boundary: 'wrap-axis' } };
  const DOM = createDOMGrid({ ...options, root: new FakeElement() });
  const terminal = createTerminalGrid(options);
  assertTrace(DOM, terminal, ['right', 'down', 'select', 'start-edit', 'cancel-edit', { type: 'focus', id: 'd' }]);
});

test('DOM and terminal carousels preserve boundaries, pause state, and controlled sync', () => {
  for (const controlled of [false, true]) {
    const options = { slides: ['a', 'b', 'c'], policies: { wrap: false }, ...(controlled ? { value: 'a', paused: false } : { defaultValue: 'a', defaultPaused: false }) };
    const DOM = createDOMCarousel({ ...options, root: new FakeElement() });
    const terminal = createTerminalCarousel(options);
    assertTrace(DOM, terminal, ['previous', 'next', 'last', 'next', 'toggle-pause', { type: 'pause-for', reason: 'hover' }, { type: 'resume-for', reason: 'hover' }]);
    assert.deepEqual(DOM.getPosition(), terminal.getPosition());
    if (controlled) {
      assert.deepEqual(DOM.syncControlledValues({ value: 'c', paused: true }), terminal.syncControlledValues({ value: 'c', paused: true }));
      assert.deepEqual(DOM.getSnapshot(), terminal.getSnapshot());
    }
  }
});

test('DOM and terminal feeds preserve revisioned request and window traces', () => {
  const requests = { DOM: [], terminal: [] };
  const DOM = createDOMFeed({ root: new FakeElement(), items: ['a', 'b'], revision: 1, onRequestWindow: (...request) => requests.DOM.push(request) });
  const terminal = createTerminalFeed({ items: ['a', 'b'], revision: 1, onRequestWindow: (...request) => requests.terminal.push(request) });
  assertTrace(DOM, terminal, ['next', 'request-after']);
  assert.deepEqual(requests.DOM, requests.terminal);
  assert.deepEqual(DOM.syncWindow({ items: ['b', 'c'], revision: 2, highlightedValue: 'b' }), terminal.syncWindow({ items: ['b', 'c'], revision: 2, highlightedValue: 'b' }));
  assertTrace(DOM, terminal, ['next', 'request-before', 'clear-request']);
});

test('Feed hosts preserve nullable initialization and explicit window ownership', async () => {
  for (const create of [createDOMFeed, createTerminalFeed]) {
    for (const items of [[], [0, '0']]) {
      const cases = [{}, { defaultHighlightedValue: undefined }, { defaultHighlightedValue: null }];
      if (items.length > 0) cases.push({ defaultHighlightedValue: 0 }, { defaultHighlightedValue: '0' });
      for (const input of cases) {
        const changes = [];
        const feed = create({ root: new FakeElement(), items, revision: 1, ...input, onHighlightedValueChange: (id) => changes.push(id) });
        try {
          assert.equal(feed.state.cursor.current, input.defaultHighlightedValue === undefined ? items[0] ?? null : input.defaultHighlightedValue);
          assert.deepEqual(changes, [], 'initialization is not a user highlight proposal');
          let revision = 1;
          for (const highlightedValue of [null, ...items]) {
            const result = feed.syncWindow({ items, revision: ++revision, highlightedValue });
            assert.equal(result.ok, true);
            assert.equal(result.value.state.cursor.current, highlightedValue);
          }
          assert.deepEqual(changes, [], 'owner synchronization does not echo a highlight proposal');
        } finally { feed.destroy(); }
      }
    }
  }
  await Promise.resolve();
});

test('Feed hosts publish null and empty windows once while rejecting stale responses atomically', async () => {
  for (const create of [createDOMFeed, createTerminalFeed]) {
    const root = new FakeElement();
    const a = new FakeElement();
    const b = new FakeElement();
    const publications = [];
    const changes = [];
    const requests = [];
    const feed = create({
      root, items: ['a', 'b'], revision: 1, total: 4, defaultHighlightedValue: 'b',
      onHighlightedValueChange: (id) => changes.push(id),
      onRequestWindow: (...request) => requests.push(request),
      onUpdate: () => publications.push(['update', feed.state.cursor.current]),
    });
    feed.subscribe((snapshot) => publications.push(['snapshot', snapshot.state.cursor.current]));
    const dom = typeof feed.setItemAttributes === 'function';
    if (dom) { feed.setItemAttributes(a, 'a'); feed.setItemAttributes(b, 'b'); }
    const sync = (window, expected) => {
      publications.length = 0;
      const result = feed.syncWindow(window);
      assert.equal(result.ok, true, result.error?.message);
      assert.equal(result.value, feed.getSnapshot());
      assert.equal(feed.state.cursor.current, expected);
      assert.deepEqual(publications, [['snapshot', expected], ['update', expected]]);
      return result;
    };
    try {
      sync({ items: ['a', 'b'], revision: 2, highlightedValue: null }, null);
      await Promise.resolve();
      assert.deepEqual(changes, []);
      if (dom) {
        assert.equal(a.tabIndex, -1);
        assert.equal(b.tabIndex, -1);
        assert.equal(root.focusCalls, 1);
        assert.equal(b.focusCalls, 0);
      }
      assert.equal(feed.handleEvent('request-after'), true);
      assert.deepEqual(requests, [['after', null, 2, 1]]);
      await Promise.resolve();
      const pending = feed.getSnapshot();
      const response = { items: [], revision: 3, requestGeneration: 1, highlightedValue: null, start: 0, total: 0 };
      for (const [change, code] of [
        [{ revision: 2 }, 'collection-window-revision-stale'],
        [{ requestGeneration: undefined }, 'collection-window-request-generation-required'],
        [{ requestGeneration: 2 }, 'collection-window-request-stale'],
        [{ start: -1 }, 'collection-window-start-invalid'],
        [{ items: ['x', 'y'], total: 1 }, 'collection-window-total-invalid'],
      ]) {
        publications.length = 0;
        const rejected = feed.syncWindow({ ...response, ...change });
        assert.equal(rejected.ok, false);
        assert.equal(rejected.error.code, code);
        assert.equal(feed.getSnapshot(), pending);
        assert.deepEqual(publications, []);
        if (dom) assert.equal(a.listeners.get('click').size, 1);
      }
      sync(response, null);
      assert.equal(feed.state.size, 0);
      assert.equal(feed.state.total, 0);
      assert.equal(feed.state.pending, null);
      assert.equal(feed.state.requestGeneration, 1);
      if (dom) {
        assert.equal(a.listeners.get('click').size, 0);
        assert.equal(b.listeners.get('click').size, 0);
      }
      await Promise.resolve();
      assert.deepEqual(changes, []);
      sync({ items: ['a', 'b'], revision: 4, total: null }, 'a');
      assert.equal(feed.handleEvent('next'), true);
      assert.equal(feed.state.cursor.current, 'b');
      assert.deepEqual(changes, ['b']);
      sync({ items: ['b', 'c'], revision: 5, highlightedValue: undefined }, 'b');
      sync({ items: ['c', 'd'], revision: 6 }, 'c');
      assert.deepEqual(changes, ['b']);
      await Promise.resolve();
    } finally { feed.destroy(); }
    if (dom) assert.equal(root.listeners.get('keydown').size, 0);
  }
});

function assertTrace(DOM, terminal, events) {
  assert.deepEqual(DOM.getSnapshot(), terminal.getSnapshot());
  for (const event of events) {
    assert.equal(DOM.handleEvent(event), terminal.handleEvent(event));
    assert.deepEqual(DOM.getSnapshot(), terminal.getSnapshot());
  }
}

class FakeElement {
  attributes = new Map(); listeners = new Map(); tabIndex = -1; focusCalls = 0;
  addEventListener(type, listener) { const listeners = this.listeners.get(type) ?? new Set(); listeners.add(listener); this.listeners.set(type, listeners); }
  removeEventListener(type, listener) { this.listeners.get(type)?.delete(listener); }
  setAttribute(name, value) { this.attributes.set(name, value); }
  removeAttribute(name) { this.attributes.delete(name); }
  focus() { this.focusCalls += 1; }
}

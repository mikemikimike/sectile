---
title: Core
description: Use renderer-neutral interaction state, ordered collections, exact ranges, and deterministic transitions.
---

# Core

`@sectile/core` is useful when interaction rules need to work independently of Vue, the DOM, a terminal, or another renderer. It gives you ordered identity, selection and cursor state, exact ranges, deterministic component transitions, typed failures, and host-neutral commands.

If you only need ready-to-render Vue components, start with [`@sectile/vue`](/packages/vue). Install Core directly when application logic or a custom host needs the same interaction semantics without a rendering dependency.

## Install

```sh
pnpm add @sectile/core
```

Import the focused subpath for the capability you use:

```ts
import { createSequence } from '@sectile/core/sequence'
import { createBoundedRange } from '@sectile/core/range'
import { applyListboxEvent, createListboxState } from '@sectile/core/listbox'
```

See the [Core API reference](/api/core) for every public import path.

## Move through ordered application items

A `Sequence` keeps stable IDs in application order and can move from one ID to the next eligible ID. This is useful for keyboard navigation, command palettes, workflow steps, and any other interaction where the records themselves live elsewhere.

```ts
import { createSequence } from '@sectile/core/sequence'

const steps = createSequence([
  'draft',
  'review',
  'publish',
])

const next = steps.move('draft', 1, 'stop', {
  eligible: id => id !== 'review',
})

if (next.kind === 'found') {
  console.log(next.id) // "publish"
}
```

The sequence owns identity and order, not the records associated with those IDs. Keep labels, payloads, network state, and rendered elements in your application or host layer.

Pass `'wrap'` as the boundary argument when navigation should continue from the opposite edge. For large or externally constrained scans, `maxScan` lets the caller make the work ceiling explicit.

## Snap user input to an exact range

Range values are decimal strings, so a stepped control does not need to rely on floating-point increments. Define the valid lattice once, then clamp, snap, or translate between ticks and values.

```ts
import { createBoundedRange } from '@sectile/core/range'

const opacity = createBoundedRange({
  min: '0',
  max: '1',
  step: '0.05',
})

const snapped = opacity.snap('0.63')
if (snapped === null) throw new Error('Invalid opacity')

console.log(snapped) // "0.65"
console.log(opacity.tickOf(snapped)) // 13
console.log(opacity.valueAt(20)) // "1"
```

This pattern is useful for sliders, quantity fields, percentages, zoom levels, and other controls whose valid values lie on a known decimal step. Keep the string value while exact decimal behavior matters; convert at an application boundary only when the destination requires another representation.

## Drive interaction state without a renderer

Composite Core modules combine the smaller structures into complete interaction transitions. A Listbox, for example, can own cursor and selection behavior while your host decides how to focus or activate a rendered item.

```ts
import {
  applyListboxEvent,
  createListboxState,
  type ListboxEvent,
} from '@sectile/core/listbox'
import { createSequence } from '@sectile/core/sequence'

const items = createSequence(['all', 'open', 'closed'])

let state = createListboxState(items, {
  current: 'all',
  selected: ['all'],
})

function requestFocus(id: string) {
  console.log('focus', id)
}

function openItem(id: string) {
  console.log('activate', id)
}

function dispatch(event: ListboxEvent<string>) {
  const result = applyListboxEvent(items, state, event, {
    selectionMode: 'single',
    selectionFollowsFocus: true,
    boundary: 'wrap',
  })

  if (!result.ok) return result

  state = result.value.state

  for (const command of result.value.commands) {
    if (command.type === 'focus') requestFocus(command.id)
    if (command.type === 'activate') openItem(command.id)
  }

  return result
}

dispatch('next')
console.log(state.cursor.current) // "open"
console.log(state.selection.selected) // ["open"]
```

The transition changes Core state and returns ordered commands; it does not call the DOM, move focus, scroll, or render anything itself. A host adapter performs those effects after accepting the returned state.

For a ready-made web or framework integration, use [`@sectile/dom`](/packages/dom) or [`@sectile/vue`](/packages/vue) instead of recreating that host boundary in application code.

## Handle invalid input without guessing

Constructors whose failure is part of normal input handling have `try*` forms that return a typed `Result`. Use them when input comes from configuration, persisted data, or another boundary you do not fully control.

```ts
import { tryCreateSequence } from '@sectile/core/sequence'

const result = tryCreateSequence(['primary', 'primary'])

if (!result.ok) {
  console.error(result.error.code) // "duplicate-id"
} else {
  useSequence(result.value)
}

function useSequence(sequence: { readonly size: number }) {
  console.log(sequence.size)
}
```

Use the throwing constructor, such as `createSequence`, when invalid input is a programming error and an exception is the intended failure policy.

## Choose the next package

Core deliberately stops before renderer- or domain-specific work:

- Use [`@sectile/vue`](/packages/vue) for Vue components and lifecycle integration.
- Use [`@sectile/dom`](/packages/dom) for browser host behavior without Vue.
- Use [`@sectile/temporal`](/packages/temporal) for civil dates, times, calendars, and picker date arithmetic.
- Use [`@sectile/virtual`](/packages/virtual) for collection extents, viewport queries, dynamic measurement, and virtual layout.

When you need the underlying contracts rather than another application example, continue with [Foundations](core/foundations.md), [Structures and state](core/structures.md), or [Transitions and composition](core/transitions.md). The complete list of supported subpaths stays in the [Core API reference](/api/core).

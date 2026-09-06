---
title: DOM
description: Connect Sectile interaction behavior to application-owned browser elements, forms, popups, and large surfaces.
---

# DOM

`@sectile/dom` connects Sectile interaction behavior to browser elements that your application already renders. It translates keyboard, pointer, focus, and composition input; projects accessibility and state attributes; and owns the browser listeners and resources needed by the connection. Markup, application data, and visual styling remain application concerns.

Use this package when the application owns its HTML or when a framework integration is not needed. For Vue templates and component lifecycle, use [`@sectile/vue`](/packages/vue) instead.

## Install

```sh
pnpm add @sectile/dom
```

Prefer focused component paths in application code so each DOM capability stays explicit:

```ts
import { createCheckbox } from '@sectile/dom/checkbox'
import { createPopover } from '@sectile/dom/popover'
```

The [DOM API reference](/api/dom) lists every supported import path. Domain integrations such as Form, Temporal, Virtual, Tabular, and Chart require their corresponding optional package only when that integration is used.

## Connect behavior to existing markup

A direct `create*` factory takes the elements the application already owns and returns a live connection. This checkbox uses a button as its interactive element and a separate label to show the accepted state.

```html
<button class="newsletter-toggle" type="button" data-newsletter-toggle>
  Receive product updates
</button>
<p>Current preference: <strong data-newsletter-state>off</strong></p>
```

```ts
import { createCheckbox } from '@sectile/dom/checkbox'

const element = document.querySelector<HTMLElement>('[data-newsletter-toggle]')
const stateLabel = document.querySelector<HTMLElement>('[data-newsletter-state]')

if (element === null || stateLabel === null) {
  throw new Error('Newsletter controls are missing')
}

const checkbox = createCheckbox({
  element,
  defaultValue: false,
})

const render = () => {
  stateLabel.textContent = checkbox.state.checked === true ? 'on' : 'off'
}

const unsubscribe = checkbox.subscribe(render)
render()

window.addEventListener('pagehide', () => {
  unsubscribe()
  checkbox.destroy()
}, { once: true })
```

The connection handles browser input and keeps the element's semantic projection synchronized. In this example the element receives the checkbox role, `aria-checked`, and state data attributes as the value changes; the application only renders the extra status text it wants to show.

Direct connections share a small lifecycle surface: `state` reads accepted state, `send()` sends semantic input, `update()` synchronizes an externally owned value where supported, `subscribe()` observes accepted updates, and `destroy()` releases the connection. Component-specific methods are added when a component needs operations such as collection registration or position updates.

## Keep application-owned state controlled

Use `defaultValue` when the DOM connection should own the initial value. Use `value` and the matching change callback when application state is authoritative.

```ts
const settings = {
  newsletter: false,
}

const checkbox = createCheckbox({
  element,
  value: settings.newsletter,
  onValueChange(nextValue) {
    settings.newsletter = nextValue
    checkbox.update(settings.newsletter)
  },
})
```

A controlled interaction proposes the next value through `onValueChange`; it does not silently replace the application's value. After the application accepts the proposal, `update()` synchronizes the DOM connection with that accepted value. The same ownership model is used across Sectile controls; see [State ownership](/guides/state-ownership).

## Connect a popup without giving up the markup

Popup connections work with application-owned trigger and content elements. They coordinate open state, dismissal, focus, accessibility projection, and positioning while leaving the content structure and styles intact.

```html
<button type="button" data-help-trigger>Delivery details</button>
<div class="delivery-popover" data-help-popover hidden>
  Orders placed before 15:00 ship on the same business day.
</div>
```

```ts
import { createPopover } from '@sectile/dom/popover'

const trigger = document.querySelector<HTMLElement>('[data-help-trigger]')
const root = document.querySelector<HTMLElement>('[data-help-popover]')

if (trigger === null || root === null) {
  throw new Error('Delivery popover markup is missing')
}

const popover = createPopover({
  trigger,
  root,
  label: 'Delivery details',
  side: 'bottom',
  align: 'start',
})

window.addEventListener('pagehide', () => {
  popover.destroy()
}, { once: true })
```

The direct Popover connection manages its functional visibility by default and positions the content relative to the trigger. Dialogs, menus, selects, comboboxes, tooltips, drawers, and date pickers expose their own focused DOM entry points with the same application-owned-markup model.

For CSS exit motion, see [Motion](/guides/motion). Renderer-owned visibility is available on the transient-surface APIs that explicitly expose it; the ordinary direct connection keeps visibility, focus, dismissal, and positioning coordinated for imperative DOM use.

## Preserve native browser behavior

Sectile does not replace browser editing behavior that HTML already provides. Text inputs keep native selection and IME composition, form controls keep their native form relationship, and focus effects target real elements.

Choose native elements when they already match the intended control. Use a non-native element only when the product needs a different structure; the DOM connection then projects the accessibility and state attributes required for that structure.

## Style projected state

DOM connections do not provide a theme. Style application classes and the state attributes Sectile projects onto the elements.

```css
.newsletter-toggle {
  border: 1px solid var(--control-border);
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
}

.newsletter-toggle[data-state='checked'] {
  background: var(--control-accent);
  color: var(--control-on-accent);
}

.newsletter-toggle[data-disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
```

Compound surfaces also expose stable `data-scope` and `data-part` hooks. [Styling](/guides/styling) covers the shared conventions, and [Motion](/guides/motion) covers transitions driven by public state attributes.

## Destroy connections with the owning UI

A connection should live for exactly as long as the UI that owns its elements. Call `destroy()` when a route, view, or owning component removes those elements. Unsubscribe application listeners at the same boundary.

```ts
const unsubscribe = checkbox.subscribe(render)

function disposeNewsletterControls() {
  unsubscribe()
  checkbox.destroy()
}
```

Destroying a connection releases the browser resources owned by that connection. If the application creates several independent connections, each one has its own cleanup boundary.

## Add domain integrations only when needed

The base DOM package depends on Core and does not require the larger domain packages. Install an optional peer only for the feature that uses it.

| Need | Additional package | DOM entry point | Guide |
| --- | --- | --- | --- |
| Form validation and submission | `@sectile/form` | `@sectile/dom/form` | [DOM forms](/packages/form/dom/) |
| Dates, times, calendars, pickers | `@sectile/temporal` | e.g. `@sectile/dom/temporal/date-picker` | [Temporal](/packages/temporal) |
| Virtualized lists and surfaces | `@sectile/virtual` | `@sectile/dom/virtual` | [Virtual DOM connection](/packages/virtual/dom) |
| Tables and grids | `@sectile/tabular` | `@sectile/dom/tabular` | [Tabular DOM composition](/packages/tabular/dom) |
| Charts | `@sectile/chart` | `@sectile/dom/chart` | [DOM chart rendering](/packages/chart/dom) |

These packages continue to own their renderer-neutral domain behavior. The DOM integration supplies browser elements, input, measurement, focus, rendering resources, and cleanup around that behavior.

## Use lower-level APIs only when the lifecycle requires them

Direct factories are the usual starting point. When state and element lifecycles must be separated, many component subpaths also expose lower-level controllers and attribute helpers. For example, `createCheckboxController()` can own checkbox state without an element, and `getCheckboxAttributes()` can project a snapshot into application-managed DOM.

This level is useful for delegated event systems, custom renderers, or application infrastructure that cannot let one direct connection own an element. The [DOM API reference](/api/dom) is the canonical index of public package entry points; use the relevant component subpath when you need its lower-level public types and helpers.

## Handle recoverable setup failures

`create*` factories return a ready connection and throw when the supplied configuration is invalid. Use the matching `tryCreate*` factory when setup data comes from a recoverable boundary and construction failure should remain a typed result.

```ts
import { tryCreateCheckbox } from '@sectile/dom/checkbox'

const result = tryCreateCheckbox({ element })

if (!result.ok) {
  console.error(result.error.code)
} else {
  const checkbox = result.value
  window.addEventListener('pagehide', () => checkbox.destroy(), { once: true })
}
```

## Continue by task

- Browse [Components](/components/) for interaction previews and DOM usage code for individual controls.
- Use [State ownership](/guides/state-ownership) when application state owns a component value.
- Use [Styling](/guides/styling) and [Motion](/guides/motion) for public state hooks and transitions.
- Use the [DOM API reference](/api/dom) when you need the exact public package path for a DOM capability.

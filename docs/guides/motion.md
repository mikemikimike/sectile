# Motion

Sectile does not ship an animation runtime or visual theme. Components expose public state, presence, direction, and gesture hooks so ordinary CSS can describe motion without changing the interaction contract.

Use motion to explain a state change, not to make every component move. Keep the final open/closed/selected state understandable when animation is disabled.

## Popup enter and exit

Dialog, Alert Dialog, Drawer, Popover, Tooltip, Select, Combobox, Menu, Cascade Select, and date-picker popups expose `data-state="open|closed"` on their rendered popup parts. Presence-managed popup content stays available long enough for a finite CSS exit animation to finish. Set `unmountOnExit` when you want that content removed after the exit motion completes.

```vue
<DialogRoot :unmount-on-exit="true">
  <DialogTrigger>Open settings</DialogTrigger>
  <DialogOverlay class="dialog-overlay" />
  <DialogContent class="dialog-content">
    <!-- ... -->
  </DialogContent>
</DialogRoot>
```

```css
.dialog-overlay[data-state='open'] {
  animation: overlay-in 160ms ease-out;
}

.dialog-overlay[data-state='closed'] {
  animation: overlay-out 120ms ease-in;
}

.dialog-content[data-state='open'] {
  animation: dialog-in 180ms cubic-bezier(.2, .8, .2, 1);
}

.dialog-content[data-state='closed'] {
  animation: dialog-out 140ms ease-in;
}

@keyframes overlay-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes overlay-out {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes dialog-in {
  from { opacity: 0; transform: translateY(8px) scale(.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes dialog-out {
  from { opacity: 1; transform: translateY(0) scale(1); }
  to { opacity: 0; transform: translateY(6px) scale(.985); }
}
```

The same pattern works for another popup by changing the scope or class. Keep interaction behavior on the Sectile parts; the CSS only changes presentation.

## Expansion and disclosure indicators

For Accordion and Disclosure, a small indicator rotation is usually clearer than trying to animate the entire document flow. `data-state` reflects the public open/closed state.

```css
[data-scope='accordion'][data-part='trigger'] .chevron {
  transition: transform 160ms ease;
}

[data-scope='accordion'][data-part='trigger'][data-state='open'] .chevron {
  transform: rotate(180deg);
}
```

This keeps layout stable while still making the expansion change visible.

## Selection and checked state

Checked, selected, active, and pressed controls expose state attributes on the relevant parts. Use transitions for color/geometry changes and reserve keyframes for a meaningful confirmation cue.

```css
[data-scope='checkbox'][data-part='root'] {
  transition:
    background-color 120ms ease,
    border-color 120ms ease,
    transform 120ms ease;
}

[data-scope='checkbox'][data-part='root'][data-state='checked'] {
  transform: scale(1.04);
}

[data-scope='checkbox'][data-part='indicator'][data-state='checked'] {
  animation: check-in 140ms cubic-bezier(.2, .8, .2, 1);
}

@keyframes check-in {
  from { opacity: 0; transform: scale(.65); }
  to { opacity: 1; transform: scale(1); }
}
```

Tabs, Navigation Menu, Radio Group, Toggle Group, Listbox, and similar controls can use the same principle against their documented state attributes.

## Drawer swipe motion

Drawer exposes live swipe movement as CSS custom properties and the gesture phase through `data-swipe`. Apply the pointer movement directly during the drag, then animate only cancellation or completion.

```css
[data-scope='drawer'][data-part='content'] {
  transform: translate(
    var(--sectile-drawer-swipe-movement-x, 0px),
    var(--sectile-drawer-swipe-movement-y, 0px)
  );
}

[data-scope='drawer'][data-part='content'][data-swipe='move'] {
  transition: none;
}

[data-scope='drawer'][data-part='content'][data-swipe='cancel'],
[data-scope='drawer'][data-part='content'][data-swipe='end'] {
  transition: transform 180ms cubic-bezier(.2, .8, .2, 1);
}
```

`--sectile-drawer-swipe-progress` is also available when opacity, backdrop intensity, or another visual treatment should follow gesture progress.

## Reduced motion

Every motion example should have a motion-free path. Do not merely make the animation slightly shorter when the user has requested reduced motion; remove non-essential transitions and keyframes.

```css
@media (prefers-reduced-motion: reduce) {
  .dialog-overlay,
  .dialog-content,
  [data-scope='accordion'][data-part='trigger'] .chevron,
  [data-scope='checkbox'][data-part='root'],
  [data-scope='checkbox'][data-part='indicator'],
  [data-scope='drawer'][data-part='content'] {
    animation: none !important;
    transition: none !important;
  }
}
```

The component's state and accessibility semantics remain the same with motion disabled.

## Component-specific examples

The component pages build on these patterns with runnable examples. Start with [Dialog](/components/dialog), [Drawer](/components/drawer), [Accordion](/components/accordion), [Checkbox](/components/checkbox), and [Toast](/components/toast), then use the [API reference](/api/components/) to confirm the exact public parts and attributes for another component.

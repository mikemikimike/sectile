---
title: Terminal
description: Connect Sectile interaction behavior to terminal input, application-owned TUI rendering, or the optional Node screen helpers.
---

# Terminal

`@sectile/terminal` connects terminal keyboard input and text rendering to Sectile interaction state. Component connections handle the same selection, navigation, editing, and controlled-state rules as other hosts, while the terminal application decides how rows, panels, colors, routing, and application data are rendered.

Use the component adapters with an existing TUI renderer, or combine them with the optional screen and Node helpers when a compact application can render directly to a TTY.

## Install

```sh
pnpm add @sectile/terminal
```

Import the component or host capability you need:

```ts
import { createCheckbox } from '@sectile/terminal/checkbox'
import { createTTYKeyboard } from '@sectile/terminal/node'
```

The [Terminal API reference](/api/terminal) lists the supported public import paths.

## Connect a component to terminal input

Terminal component connections do not require a screen implementation. An existing TUI can translate its keyboard events into `TerminalKeyboardInput`, pass them to the connection, then render the accepted state through its own view system.

```ts
import { createCheckbox } from '@sectile/terminal/checkbox'
import type { TerminalKeyboardInput } from '@sectile/terminal/keyboard'

const analytics = createCheckbox({ defaultValue: false })

function handleInput(input: TerminalKeyboardInput) {
  if (!analytics.handleKeyboardInput(input)) return
  renderSettings({ includeAnalytics: analytics.state.checked === true })
}
```

`handleKeyboardInput()` returns `false` when the key is outside the component's interaction domain. The application can then route that input elsewhere. For this Checkbox, <kbd>Space</kbd> and <kbd>Enter</kbd> toggle the value; unrelated keys remain available to the surrounding terminal UI.

A connection also exposes `state`, `subscribe()`, `update()`, and `destroy()` through the common Sectile facade. Component-specific methods handle terminal input and richer operations where needed.

## Run the same interaction on a Node TTY

For a Node terminal application, `createTTYKeyboard()` converts stdin keypresses into `TerminalKeyboardInput`. The optional screen helpers can turn a small layout tree into terminal cells, and `createTerminalScreenWriter()` writes the resulting frame.

The following example assumes Node 24 or later and an interactive TTY. It toggles one Checkbox, redraws when the terminal is resized, and restores the TTY when the application closes.

```ts
import { createCheckbox } from '@sectile/terminal/checkbox'
import {
  createTerminalScreenWriter,
  createTTYKeyboard,
} from '@sectile/terminal/node'
import {
  renderTerminalScreen,
  terminalBox,
  terminalColumn,
  terminalText,
} from '@sectile/terminal/screen'

const analytics = createCheckbox({ defaultValue: false })
const writer = createTerminalScreenWriter(process.stdout, {
  alternateScreen: true,
})

let closed = false
let keyboard: { close(): void } | undefined

function render() {
  const checked = analytics.state.checked === true
  const mark = checked ? 'x' : ' '
  const view = terminalBox(
    terminalColumn([
      terminalText('Project settings', { style: 'accent' }),
      terminalText(`› [${mark}] Include analytics`, {
        style: checked ? 'selected' : 'default',
      }),
      terminalText('Space/Enter toggles · q quits', { style: 'muted' }),
    ], { gap: 1, width: 'fill', height: 'fill' }),
    { title: 'Settings', padding: 1, width: 'fill', height: 'fill' },
  )

  writer.render(renderTerminalScreen(view, {
    columns: process.stdout.columns ?? 80,
    rows: process.stdout.rows ?? 24,
    appearance: writer.appearance,
  }))
}

const unsubscribe = analytics.subscribe(render)
const keyboardResult = createTTYKeyboard(process.stdin, (input) => {
  if (input.key === 'q') {
    close()
    process.exitCode = 0
    return
  }
  analytics.handleKeyboardInput(input)
})

if (!keyboardResult.ok) {
  unsubscribe()
  analytics.destroy()
  writer.close()
  throw new Error(keyboardResult.error.message)
}

keyboard = keyboardResult.value
const handleResize = () => render()
process.stdout.on('resize', handleResize)

function close() {
  if (closed) return
  closed = true
  process.stdout.off('resize', handleResize)
  keyboard?.close()
  unsubscribe()
  analytics.destroy()
  writer.close()
}

process.once('SIGINT', () => {
  close()
  process.exitCode = 130
})
process.once('SIGTERM', () => {
  close()
  process.exitCode = 143
})
process.once('exit', close)

render()
```

The application still owns process policy. A view that can unmount without ending the process should remove its own signal and resize listeners at that lifecycle boundary instead of treating process exit as component cleanup.

## Keep application-owned values controlled

Use a default value when the connection owns its current state. When application state is authoritative, pass the current value and accept proposed changes through the matching callback.

```ts
const settings = { includeAnalytics: false }

const analytics = createCheckbox({
  value: settings.includeAnalytics,
  onValueChange(nextValue) {
    settings.includeAnalytics = nextValue === true
    analytics.update(settings.includeAnalytics)
    renderSettings(settings)
  },
})
```

The callback receives a proposal. The Terminal connection reflects the new controlled value after the owner accepts it with `update()`.

## Match keyboard behavior to the rendered shape

Terminal navigation follows the spatial structure the user sees rather than a browser-specific key map.

| Surface | Common keys |
| --- | --- |
| Vertical list | <kbd>↑</kbd> / <kbd>↓</kbd> |
| Horizontal list | <kbd>←</kbd> / <kbd>→</kbd> |
| Vertical hierarchy | <kbd>→</kbd> enters or expands; <kbd>←</kbd> or <kbd>Esc</kbd> returns |
| Current level | <kbd>Home</kbd> / <kbd>End</kbd> |
| Activation | <kbd>Enter</kbd> / <kbd>Space</kbd> |

Individual component pages document additional editing, paging, and range commands. `@sectile/terminal/reorder` provides explicit movement inputs for reorderable sequences and trees, while `@sectile/terminal/layer-stack` coordinates dismissal order for application-owned popup layers.

## Render text and color for terminal capabilities

The screen helpers are optional. `terminalRow()`, `terminalColumn()`, `terminalBox()`, and `terminalText()` build a fixed frame; `createTerminalAppearance()` supplies semantic roles such as `accent`, `selected`, `current`, `disabled`, and `danger`.

```ts
import { createTerminalAppearance } from '@sectile/terminal/appearance'

const appearance = createTerminalAppearance({
  theme: {
    accent: { foreground: 'bright-cyan', bold: true },
    selected: { foreground: 'bright-green', bold: true },
  },
})
```

The Node writer detects available color and Unicode support when it creates its default appearance. Styling is reduced to supported terminal capabilities rather than requiring the application to emit terminal-specific escape sequences itself.

## Keep editing Unicode-safe

Terminal text helpers measure grapheme clusters and rendered cell width rather than assuming one JavaScript code unit equals one terminal cell. Editable text can keep its logical caret as a UTF-16 offset and attach it to the rendered text node:

```ts
terminalText(input, {
  cursor: {
    codeUnitOffset: selection.focusCodeUnitOffset,
    shape: 'bar',
  },
})
```

The screen renderer maps that offset through grapheme clusters, double-width characters, wrapping, padding, and clipping before the Node writer positions the physical terminal cursor.

## Close the resources your application opened

`createTTYKeyboard()` owns one active stdin TTY connection at a time. Its `close()` method removes the Sectile keypress listener and restores the stream's previous raw/flowing state. `createTerminalScreenWriter().close()` restores cursor visibility and leaves the alternate screen when one was opened.

Component connections have their own `destroy()` method. Close input, output, component connections, subscriptions, and application-owned signal or resize listeners together when the owning terminal view ends.

## Use date and time controls directly

Terminal includes Temporal-backed date and time controls such as fields, calendars, and pickers. They use the same civil date/time semantics described in the [Temporal guide](/packages/temporal) while translating terminal-specific keyboard input locally.

Sectile Form currently has DOM and Vue integrations, not a Terminal Form adapter. Terminal applications coordinate form-level validation and submission in their application layer while individual Terminal controls retain their component behavior.

## Try the interaction in the browser

This preview uses a real `@sectile/terminal/checkbox` connection with a browser-hosted terminal display. It demonstrates the interaction only; it is not a Sectile command-line program. Focus the preview and press <kbd>Space</kbd> or <kbd>Enter</kbd>.

<TerminalCheckboxDemo />

## Handle recoverable setup failures

Direct `create*` factories return ready connections and throw for invalid construction. Use the matching `tryCreate*` factory when setup failure should remain a typed result. `createTTYKeyboard()` already returns a result because an interactive TTY may be unavailable or already owned.

## Continue by task

- Browse [Components](/components/) for Terminal interaction examples on supported components.
- Use the [Temporal guide](/packages/temporal) for date and time value semantics.
- Use the [Terminal API reference](/api/terminal) for exact component, keyboard, screen, appearance, and Node import paths.

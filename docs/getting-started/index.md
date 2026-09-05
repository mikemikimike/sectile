# Getting Started

Sectile gives you accessible interaction behavior without deciding how your product should look. Start with the host you already use, get one component working, then add your own styles and motion.

## 1. Choose and install a host

For a Vue application, choose **Vue**. Choose **DOM** when you already create browser elements yourself. Terminal and Core are lower-level starting points for terminal interfaces and custom rendering.

<HostInstall />

Vue applications already need `vue`; Sectile's Vue package provides the component subpaths. Development, SSR, and Node terminal integration require Node.js 24 or newer.

## 2. Import only the component you need

Every component has a focused public subpath. The selector below follows the host choice above.

<PackageImport component="checkbox" />

## 3. Run one example end to end

The examples below do not depend on docs-only CSS or hidden markup. The Vue example contains its state, markup, and styling in one SFC. The DOM example includes the HTML queried by the connection code and its cleanup. The Core and Terminal examples run as `main.mjs` with Node.js 24 or newer.

::: code-group
```vue [Vue · Example.vue]
<script setup lang="ts">
import { ref } from 'vue'
import { CheckboxIndicator, CheckboxRoot } from '@sectile/vue/checkbox'

const checked = ref<boolean | 'indeterminate'>(false)
</script>

<template>
  <CheckboxRoot v-model="checked" class="setting">
    <span class="box" aria-hidden="true">
      <CheckboxIndicator class="indicator">✓</CheckboxIndicator>
    </span>
    <span>Include analytics</span>
  </CheckboxRoot>

  <p>Analytics: {{ checked === true ? 'included' : 'excluded' }}</p>
</template>

<style scoped>
.setting {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  min-height: 2.75rem;
  padding: 0.65rem 0.8rem;
  border: 1px solid #a8b0bd;
  border-radius: 0.6rem;
  background: white;
  color: #16181d;
  font: inherit;
}

.box {
  display: grid;
  width: 1.25rem;
  height: 1.25rem;
  place-items: center;
  border: 1px solid currentColor;
  border-radius: 0.3rem;
}

.setting[data-state='unchecked'] .indicator {
  opacity: 0;
}

.setting[data-state='checked'] .box {
  background: #16181d;
  color: white;
}
</style>
```

```html [DOM · index.html]
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Sectile Checkbox</title>
    <style>
      .setting {
        display: inline-flex;
        align-items: center;
        gap: 0.75rem;
        min-height: 2.75rem;
        padding: 0.65rem 0.8rem;
        border: 1px solid #a8b0bd;
        border-radius: 0.6rem;
        background: white;
        color: #16181d;
        font: inherit;
      }

      .box {
        display: grid;
        width: 1.25rem;
        height: 1.25rem;
        place-items: center;
        border: 1px solid currentColor;
        border-radius: 0.3rem;
      }

      [data-checkbox][data-state='unchecked'] .indicator {
        opacity: 0;
      }

      [data-checkbox][data-state='checked'] .box {
        background: #16181d;
        color: white;
      }
    </style>
  </head>
  <body>
    <button class="setting" data-checkbox type="button">
      <span class="box" aria-hidden="true">
        <span class="indicator">✓</span>
      </span>
      <span>Include analytics</span>
    </button>
    <p data-status>Analytics: excluded</p>

    <script type="module">
      import { createCheckbox } from '@sectile/dom/checkbox'

      const button = document.querySelector('[data-checkbox]')
      const status = document.querySelector('[data-status]')

      const checkbox = createCheckbox({
        element: button,
        defaultValue: false,
        onValueChange(value) {
          status.textContent = `Analytics: ${value === true ? 'included' : 'excluded'}`
        },
      })

      window.addEventListener('pagehide', () => checkbox.disconnect(), { once: true })
    </script>
  </body>
</html>
```

```js [Core · main.mjs]
import { applyCheckboxEvent, createCheckboxState } from '@sectile/core/checkbox'

let state = createCheckboxState(false)
console.log('before:', state.checked)

const toggled = applyCheckboxEvent(state, 'toggle')
if (!toggled.ok) throw new Error(toggled.error.message)

state = toggled.value.state
console.log('after:', state.checked)
```

```js [Terminal · main.mjs]
import { createCheckbox } from '@sectile/terminal/checkbox'

const checkbox = createCheckbox({ defaultValue: false })

process.stdin.setRawMode?.(true)
process.stdin.setEncoding('utf8')
process.stdin.resume()

function render() {
  const checked = checkbox.getSnapshot().state.checked === true
  process.stdout.write(
    `\u001B[2J\u001B[H[${checked ? 'x' : ' '}] Include analytics\n\n` +
    'Space/Enter toggles, q quits.\n',
  )
}

function quit() {
  process.stdin.setRawMode?.(false)
  process.stdin.pause()
  process.stdout.write('\n')
  process.exit(0)
}

process.stdin.on('data', (input) => {
  if (input === 'q' || input === '\u0003') return quit()
  if (input === ' ') checkbox.handleKeyboardInput({ key: 'space' })
  if (input === '\r') checkbox.handleKeyboardInput({ key: 'enter' })
  render()
})

render()
```
:::

Use the Vue example as a component in an existing Vue application. The DOM example assumes a bundler such as Vite so its bare package import is resolved. After installing the selected package above, the Core and Terminal examples run with `node main.mjs`.

## 4. Add product styles

Components expose stable `data-scope`, `data-part`, and state attributes. You can style them with ordinary CSS without wrapping the component in a Sectile theme.

```css
[data-scope='checkbox'][data-part='root'] {
  display: inline-flex;
  inline-size: 1.25rem;
  block-size: 1.25rem;
  align-items: center;
  justify-content: center;
  border: 1px solid currentColor;
  border-radius: 0.3rem;
}

[data-scope='checkbox'][data-part='root'][data-state='checked'] {
  background: CanvasText;
  color: Canvas;
}
```

Read [Styling](/guide/styling) for reusable selectors and [Motion](/guides/motion) for enter, exit, indicator, and swipe animation patterns.

## 5. Control state only when you need to

Most components can own their initial state. When application state must be authoritative, use the controlled prop/event pair shown in each component's **Controlled** example. [Controlled state](/guide/state-ownership) explains the shared pattern.

## Where to go next

- [Components](/components/) — compare several runnable variants of each UI pattern.
- [Guides](/guides/) — solve styling, positioning, form, date, virtual-list, table, and chart tasks.
- [API](/api/) — look up exact props, events, slots, types, parts, keyboard behavior, and package exports.

You do not need to learn Sectile's internal architecture before using a component.

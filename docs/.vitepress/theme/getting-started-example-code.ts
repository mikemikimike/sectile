import type { Host } from './host-preference.js';

const vue = String.raw`<script setup lang="ts">
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
</style>`;

const dom = String.raw`<!doctype html>
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
          status.textContent = 'Analytics: ' + (value === true ? 'included' : 'excluded')
        },
      })

      window.addEventListener('pagehide', () => checkbox.disconnect(), { once: true })
    </script>
  </body>
</html>`;

const core = String.raw`import { applyCheckboxEvent, createCheckboxState } from '@sectile/core/checkbox'

let state = createCheckboxState(false)

function render() {
  console.log(state.checked === true ? '[x] Include analytics' : '[ ] Include analytics')
}

function dispatch(event) {
  const result = applyCheckboxEvent(state, event)
  if (!result.ok) throw new Error(result.error.message)

  state = result.value.state

  for (const command of result.value.commands) {
    if (command.type === 'checked-changed') {
      console.log('checked changed to', command.checked)
    }
  }

  render()
}

render()
dispatch('toggle')`;

const terminal = String.raw`import { createCheckbox } from '@sectile/terminal/checkbox'

const checkbox = createCheckbox({ defaultValue: false })

process.stdin.setRawMode?.(true)
process.stdin.setEncoding('utf8')
process.stdin.resume()

function render() {
  const checked = checkbox.getSnapshot().state.checked === true
  const mark = checked ? 'x' : ' '
  process.stdout.write(
    '\u001B[2J\u001B[H[' + mark + '] Include analytics\n\n' +
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

render()`;

export const gettingStartedCheckboxSources: Readonly<Record<Host, string>> = Object.freeze({
  core,
  dom,
  terminal,
  vue,
});

export const gettingStartedCheckboxLanguages: Readonly<Record<Host, string>> = Object.freeze({
  core: 'js',
  dom: 'html',
  terminal: 'js',
  vue: 'vue',
});

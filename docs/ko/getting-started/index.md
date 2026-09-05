# 시작하기

Sectile은 화면 표현과 상호작용 규칙을 분리합니다. 이 페이지에서는 실행 환경을 설치하고 Checkbox 하나를 동작시키는 데 필요한 최소 구성을 다룹니다.

## 1. 실행 환경 설치하기

Vue 애플리케이션에서는 **Vue**, 브라우저 요소를 직접 다루는 애플리케이션에서는 **DOM**을 사용합니다. 터미널 인터페이스에는 **Terminal**, 별도 렌더러를 만드는 경우에는 **Core**를 사용할 수 있습니다.

<HostInstall />

Vue 애플리케이션에는 `vue`가 필요하며 `@sectile/vue`는 컴포넌트별 공개 가져오기 경로를 제공합니다. 개발, SSR, Node 터미널 연동에는 Node.js 24 이상이 필요합니다.

## 2. 컴포넌트 가져오기

각 컴포넌트는 독립된 공개 가져오기 경로를 가집니다. 아래 예시는 위에서 선택한 실행 환경에 맞는 Checkbox 경로를 보여 줍니다.

<PackageImport component="checkbox" />

## 3. 하나의 예제를 끝까지 실행하기

아래 예제는 문서 전용 CSS나 숨겨진 마크업에 의존하지 않습니다. Vue 예제는 단일 파일 컴포넌트 하나에 상태, 마크업, 스타일을 모두 담았고, DOM 예제는 연결 코드가 사용하는 HTML과 정리 코드까지 포함합니다. Core와 Terminal 예제는 Node.js 24 이상에서 `main.mjs`로 바로 실행할 수 있습니다.

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

Vue 예제는 기존 Vue 프로젝트의 컴포넌트로 사용할 수 있습니다. DOM 예제는 `@sectile/dom/checkbox` 같은 패키지 경로를 해석할 수 있도록 Vite 같은 번들러 환경을 전제로 합니다. Core와 Terminal 예제는 위에서 해당 패키지를 설치한 뒤 `node main.mjs`로 실행합니다.

## 4. 제품 스타일 적용하기

컴포넌트는 안정적인 `data-scope`, `data-part`와 상태 속성을 노출합니다. 별도 Sectile 테마 없이 일반 CSS로 스타일링할 수 있습니다.

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

재사용 가능한 선택자는 [스타일 적용](/ko/guide/styling)에서, 열림·닫힘·표시자·스와이프 애니메이션은 [모션](/ko/guides/motion)에서 설명합니다.

## 5. 상태를 직접 관리해야 할 때

대부분의 컴포넌트는 내부 상태로 시작할 수 있습니다. 애플리케이션이 기준 상태를 직접 가져야 한다면 각 컴포넌트의 상태 제어 예시에 나온 속성과 이벤트를 사용합니다. 공통 방식은 [상태 제어](/ko/guide/state-ownership)에서 설명합니다.

## 다음으로 볼 곳

- [컴포넌트](/ko/components/) — UI 패턴별로 여러 실행 가능한 변형을 비교합니다.
- [가이드](/ko/guides/) — 스타일, 위치, 폼, 날짜, 가상 목록, 표, 차트 작업을 해결합니다.
- [API](/ko/api/) — 정확한 속성, 이벤트, 슬롯, 타입, 공개 파트, 키보드 동작과 패키지 `export`를 찾습니다.

컴포넌트를 사용하기 위해 Sectile 내부 구조를 먼저 배울 필요는 없습니다.

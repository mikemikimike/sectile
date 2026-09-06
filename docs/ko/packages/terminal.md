---
title: Terminal
description: Sectile 상호작용을 터미널 입력, 애플리케이션이 소유한 TUI, 선택적인 Node 화면 도우미에 연결합니다.
---

# Terminal

`@sectile/terminal`은 터미널 키 입력과 텍스트 출력을 Sectile 상호작용 상태에 연결합니다. 컴포넌트 연결 객체는 다른 실행 환경과 같은 선택, 탐색, 편집, 제어 상태 규칙을 따릅니다. 행과 패널의 배치, 색상, 화면 전환, 애플리케이션 데이터 표현은 터미널 애플리케이션이 결정합니다.

기존 TUI 렌더러에 컴포넌트 연결 객체만 붙여 쓸 수도 있고, 작은 터미널 애플리케이션이라면 선택 기능인 화면 도우미와 Node 도우미로 TTY에 직접 출력할 수도 있습니다.

## 설치

```sh
pnpm add @sectile/terminal
```

필요한 컴포넌트와 터미널 기능을 각각의 공개 경로에서 가져옵니다.

```ts
import { createCheckbox } from '@sectile/terminal/checkbox'
import { createTTYKeyboard } from '@sectile/terminal/node'
```

지원하는 공개 경로 전체는 [Terminal API 참조](/ko/api/terminal)에 정리되어 있습니다.

## 기존 TUI 입력에 컴포넌트 연결하기

터미널 컴포넌트 연결 객체는 Sectile 화면 렌더러 없이도 사용할 수 있습니다. 기존 TUI가 키 입력을 `TerminalKeyboardInput`으로 바꿔 연결 객체에 전달하고, 확정된 상태는 자신의 화면 체계로 렌더링하면 됩니다.

```ts
import { createCheckbox } from '@sectile/terminal/checkbox'
import type { TerminalKeyboardInput } from '@sectile/terminal/keyboard'

const analytics = createCheckbox({ defaultValue: false })

function handleInput(input: TerminalKeyboardInput) {
  if (!analytics.handleKeyboardInput(input)) return
  renderSettings({ includeAnalytics: analytics.state.checked === true })
}
```

`handleKeyboardInput()`은 해당 컴포넌트가 처리하지 않는 키를 받으면 `false`를 반환합니다. 그러면 애플리케이션이 그 입력을 다른 화면이나 명령으로 넘길 수 있습니다. 위 체크박스는 <kbd>Space</kbd>와 <kbd>Enter</kbd>를 처리하고 다른 키는 주변 터미널 UI에 남겨 둡니다.

연결 객체에서는 공통으로 `state`, `subscribe()`, `update()`, `destroy()`를 사용할 수 있습니다. 터미널 입력이나 더 복잡한 조작이 필요한 컴포넌트는 여기에 전용 메서드를 추가합니다.

## Node TTY에서 같은 상호작용 실행하기

Node 터미널 애플리케이션에서는 `createTTYKeyboard()`가 표준 입력의 키 입력을 `TerminalKeyboardInput`으로 바꿉니다. 선택 기능인 화면 도우미는 작은 레이아웃 트리를 터미널 셀로 만들고, `createTerminalScreenWriter()`가 완성된 화면을 TTY에 출력합니다.

다음 코드는 Node 24 이상과 상호작용 가능한 TTY를 전제로 합니다. 체크박스 하나를 토글하고, 터미널 크기가 바뀌면 화면을 다시 그리며, 종료할 때 입력과 화면 상태를 복원합니다.

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
      terminalText('프로젝트 설정', { style: 'accent' }),
      terminalText(`› [${mark}] 분석 기능 포함`, {
        style: checked ? 'selected' : 'default',
      }),
      terminalText('Space/Enter: 변경 · q: 종료', { style: 'muted' }),
    ], { gap: 1, width: 'fill', height: 'fill' }),
    { title: '설정', padding: 1, width: 'fill', height: 'fill' },
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

프로세스를 언제 끝낼지는 애플리케이션이 결정합니다. 프로세스를 유지한 채 터미널 화면만 내릴 수 있는 구조라면, 그 화면이 사라질 때 애플리케이션이 등록한 신호·크기 변경 리스너도 함께 제거해야 합니다.

## 애플리케이션 상태로 값 제어하기

연결 객체가 값을 소유하게 하려면 기본값을 전달합니다. 애플리케이션 상태가 최종 값을 결정한다면 현재 값과 변경 콜백을 함께 사용합니다.

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

변경 콜백은 새 값을 제안합니다. 애플리케이션이 그 값을 받아들인 뒤 `update()`를 호출하면 Terminal 연결 객체도 확정된 값으로 맞춰집니다.

## 화면 배치에 맞는 키 사용하기

터미널 탐색 키는 브라우저의 키 배치가 아니라 사용자가 보는 화면 구조를 따릅니다.

| 화면 구조 | 기본 키 |
| --- | --- |
| 세로 목록 | <kbd>↑</kbd> / <kbd>↓</kbd> |
| 가로 목록 | <kbd>←</kbd> / <kbd>→</kbd> |
| 세로 계층 | <kbd>→</kbd>로 진입·펼치기, <kbd>←</kbd> 또는 <kbd>Esc</kbd>로 돌아가기 |
| 현재 단계의 처음·끝 | <kbd>Home</kbd> / <kbd>End</kbd> |
| 실행 | <kbd>Enter</kbd> / <kbd>Space</kbd> |

편집, 페이지 이동, 범위 조절처럼 추가 입력이 필요한 경우에는 각 컴포넌트 문서에서 해당 키를 설명합니다. `@sectile/terminal/reorder`는 순서와 트리 구조를 옮기는 입력을 제공하고, `@sectile/terminal/layer-stack`은 애플리케이션이 소유한 팝업 레이어의 닫기 순서를 맞춥니다.

## 터미널 기능에 맞게 텍스트와 색상 출력하기

화면 도우미는 선택 기능입니다. `terminalRow()`, `terminalColumn()`, `terminalBox()`, `terminalText()`로 고정 크기 화면을 구성하고, `createTerminalAppearance()`로 `accent`, `selected`, `current`, `disabled`, `danger` 같은 의미 역할의 모양을 정할 수 있습니다.

```ts
import { createTerminalAppearance } from '@sectile/terminal/appearance'

const appearance = createTerminalAppearance({
  theme: {
    accent: { foreground: 'bright-cyan', bold: true },
    selected: { foreground: 'bright-green', bold: true },
  },
})
```

Node 화면 출력기는 기본 모양을 만들 때 터미널의 색상·Unicode 지원 범위를 확인합니다. 색상 표현은 감지한 터미널 기능 수준에 맞춰 자동으로 조정되므로 애플리케이션이 이스케이프 시퀀스를 직접 조립할 필요가 없습니다.

## Unicode 문자와 캐럿 위치 유지하기

터미널 텍스트 도우미는 JavaScript 코드 단위 하나를 터미널 셀 하나로 가정하지 않습니다. 문자소 묶음과 실제 셀 너비를 기준으로 계산하며, 편집 중인 텍스트의 논리적 캐럿은 UTF-16 위치로 유지해 텍스트 노드에 연결할 수 있습니다.

```ts
terminalText(input, {
  cursor: {
    codeUnitOffset: selection.focusCodeUnitOffset,
    shape: 'bar',
  },
})
```

화면 렌더러는 문자소 묶음, 두 칸 문자, 줄바꿈, 안쪽 여백, 잘라내기를 반영해 이 위치를 실제 셀 좌표로 바꿉니다. Node 화면 출력기는 계산된 좌표에 물리 터미널 커서를 놓습니다.

## 애플리케이션이 연 자원 닫기

`createTTYKeyboard()`는 표준 입력 TTY 스트림 하나에 활성 입력 연결을 하나만 둡니다. `close()`를 호출하면 Sectile이 등록한 키 입력 리스너를 제거하고 스트림의 이전 원시 입력 모드와 흐름 상태를 복원합니다. `createTerminalScreenWriter().close()`는 커서를 다시 표시하고, 대체 화면을 열었다면 원래 화면으로 돌아갑니다.

컴포넌트 연결 객체에는 별도의 `destroy()`가 있습니다. 소유한 터미널 화면이 끝날 때 입력, 출력, 컴포넌트 연결 객체, 구독, 애플리케이션이 등록한 신호·크기 변경 리스너를 같은 수명 주기에서 정리합니다.

## 날짜와 시간 컨트롤 사용하기

Terminal 패키지에는 Temporal을 사용하는 날짜·시간 입력란, 달력, 선택기가 포함됩니다. 값과 달력 계산은 [Temporal 안내](/ko/packages/temporal)의 날짜·시간 규칙을 따르고, 터미널 전용 키 입력만 Terminal 계층에서 처리합니다.

Sectile Form은 현재 DOM과 Vue 연결을 제공합니다. Terminal용 Form 연결은 없으므로 폼 전체의 검증과 제출 흐름은 터미널 애플리케이션이 조정하고, 개별 Terminal 컨트롤은 자신의 상호작용 규칙을 유지합니다.

## 브라우저에서 상호작용 확인하기

아래 미리보기는 실제 `@sectile/terminal/checkbox` 연결 객체와 브라우저 안의 터미널 화면을 사용합니다. Sectile 명령줄 프로그램을 실행하는 화면은 아닙니다. 미리보기에 포커스를 둔 뒤 <kbd>Space</kbd> 또는 <kbd>Enter</kbd>를 누르면 값을 바꿀 수 있습니다.

<TerminalCheckboxDemo />

## 생성 실패를 정상 흐름에서 처리하기

직접 `create*` 생성 함수는 바로 사용할 수 있는 연결 객체를 반환하며 잘못된 설정에서는 예외를 던집니다. 생성 실패를 정상 흐름에서 다뤄야 한다면 대응하는 `tryCreate*`로 `Result`를 받습니다. `createTTYKeyboard()`는 상호작용 가능한 TTY가 없거나 이미 다른 연결이 소유한 경우가 있으므로 처음부터 `Result`를 반환합니다.

## 작업별 다음 문서

- 지원하는 컴포넌트의 Terminal 상호작용은 [컴포넌트](/ko/components/)의 예제에서 확인할 수 있습니다.
- 날짜와 시간 값의 의미와 달력 계산은 [Temporal 안내](/ko/packages/temporal)에서 다룹니다.
- 컴포넌트, 키보드, 화면, 모양, Node의 정확한 공개 경로는 [Terminal API 참조](/ko/api/terminal)에서 확인할 수 있습니다.

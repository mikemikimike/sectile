---
title: Core
description: 화면 표현 방식과 무관한 상호작용 상태, 순서가 있는 컬렉션, 정확한 범위 값과 결정적인 상태 전이를 다룹니다.
---

# Core

`@sectile/core`는 Vue, DOM, 터미널 같은 화면 환경과 분리해서 상호작용 규칙을 다룰 때 사용합니다. 순서와 선택 상태, 정확한 범위 값, 컴포넌트 상태 전이, 타입으로 구분되는 실패 결과와 실행 환경에 종속되지 않는 명령을 제공합니다.

Vue 컴포넌트가 바로 필요하다면 [`@sectile/vue`](/ko/packages/vue)를 사용합니다. 애플리케이션 로직이나 별도의 실행 환경에서 같은 상호작용 규칙이 필요할 때 Core를 직접 설치합니다.

## 설치

```sh
pnpm add @sectile/core
```

필요한 기능의 공개 경로에서 가져옵니다.

```ts
import { createSequence } from '@sectile/core/sequence'
import { createBoundedRange } from '@sectile/core/range'
import { applyListboxEvent, createListboxState } from '@sectile/core/listbox'
```

지원하는 공개 경로 전체는 [Core API 참조](/ko/api/core)에 정리되어 있습니다.

## 순서가 있는 항목에서 다음 대상 찾기

`Sequence`는 안정적인 ID를 애플리케이션 순서대로 보관하고, 현재 ID에서 다음으로 이동할 수 있는 ID를 찾습니다. 키보드 탐색, 명령 팔레트, 작업 단계처럼 실제 데이터와 탐색 순서를 분리하고 싶은 경우에 사용할 수 있습니다.

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

`Sequence`가 소유하는 것은 ID와 순서입니다. 각 ID에 연결된 이름, 데이터, 네트워크 상태, 화면 요소는 애플리케이션이나 실행 환경에서 관리합니다.

끝에서 반대편으로 이어서 탐색하려면 경계 인자로 `'wrap'`을 전달합니다. 큰 목록처럼 탐색량에 상한이 필요하면 `maxScan`으로 한 번의 탐색에서 확인할 최대 항목 수를 명시할 수 있습니다.

## 입력 값을 정확한 범위에 맞추기

범위 값은 소수 문자열로 다룹니다. 일정한 간격으로 값이 바뀌는 컨트롤에서도 부동소수점 덧셈에 의존하지 않고 유효한 값을 계산할 수 있습니다. 최소값, 최대값, 간격을 한 번 정한 뒤 입력 값을 범위 안으로 제한하거나 가장 가까운 단계에 맞춥니다.

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

슬라이더, 수량 입력, 비율, 확대 배율처럼 정해진 소수 간격을 따르는 값에 적합합니다. 정확한 소수 계산이 필요한 동안에는 문자열 값을 유지하고, 다른 표현이 필요한 경계에서만 변환합니다.

## 화면 없이 상호작용 상태 바꾸기

Core의 컴포넌트 모듈은 작은 상태 구조를 실제 상호작용 전이로 조합합니다. 예를 들어 Listbox는 현재 항목과 선택 상태를 관리하고, 실제 화면의 포커스 이동이나 항목 실행은 명령으로 반환해 실행 환경이 처리하게 합니다.

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

상태 전이는 다음 Core 상태와 순서가 있는 명령을 반환합니다. DOM을 직접 호출하거나 실제 포커스를 옮기고 화면을 그리지는 않습니다. 호출하는 실행 환경은 반환된 상태를 받아들인 뒤 `focus`, `activate` 같은 명령을 실제 동작으로 연결합니다.

브라우저나 Vue에서 바로 사용할 연결 계층이 필요하다면 이 경계를 애플리케이션에서 다시 만들기보다 [`@sectile/dom`](/ko/packages/dom)이나 [`@sectile/vue`](/ko/packages/vue)를 사용합니다.

## 잘못된 입력을 형식이 있는 값으로 처리하기

설정 파일이나 저장된 데이터처럼 애플리케이션이 완전히 통제하지 않는 값 때문에 생성이 실패할 수 있다면 `try*` 형태를 사용합니다. 예외를 던지는 대신 `Result`로 실패를 받을 수 있습니다.

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

잘못된 값이 프로그래밍 오류라면 `createSequence`처럼 예외를 던지는 생성 함수를 사용합니다.

## 기능별 패키지 선택

Core는 화면 환경이나 특정 도메인이 맡아야 하는 동작까지 포함하지 않습니다.

- Vue 컴포넌트와 Vue 수명 주기 연결은 [`@sectile/vue`](/ko/packages/vue)에서 다룹니다.
- Vue 없이 브라우저 요소에 동작을 연결하려면 [`@sectile/dom`](/ko/packages/dom)을 사용합니다.
- 날짜, 시간, 달력, 날짜 선택 계산은 [`@sectile/temporal`](/ko/packages/temporal)이 담당합니다.
- 큰 컬렉션의 크기, 화면 범위 조회, 동적 측정과 가상 배치는 [`@sectile/virtual`](/ko/packages/virtual)에서 다룹니다.

사용 예제보다 Core 자체의 공개 계약을 자세히 확인하려면 [기본 계약](core/foundations.md), [구조와 상태](core/structures.md), [상태 전이와 조합](core/transitions.md)을 이어서 볼 수 있습니다. 지원하는 공개 경로 전체는 [Core API 참조](/ko/api/core)에 있습니다.

---
title: Temporal
description: 달력 날짜와 하루 안의 시각, 범위, 달력, 선택기 상태를 화면 환경이나 시간대와 분리해 다룹니다.
---

# Temporal

`@sectile/temporal`은 달력 날짜, 하루 안의 시각, 범위, 달력, 선택기 상태를 Vue나 DOM 같은 화면 환경과 분리해서 다룰 때 사용합니다. `2026-09-18`은 달력의 하루로, `09:30`은 하루 안의 시각으로 유지되며 애플리케이션이 명시적으로 시간대나 특정 시점과 결합하기 전에는 다른 의미로 바뀌지 않습니다.

바로 사용할 화면 컴포넌트가 필요하다면 [`@sectile/vue`](/ko/packages/vue)나 [`@sectile/dom`](/ko/packages/dom)을 사용합니다. 입력 검증, 일정 규칙, 서버 로직, 테스트, 별도의 실행 환경에서 날짜와 시간 규칙 자체가 필요할 때 Temporal을 직접 설치합니다.

## 설치

```sh
pnpm add @sectile/temporal
```

필요한 기능의 공개 경로에서 가져옵니다.

```ts
import { createDateValue } from '@sectile/temporal/date-field'
import { createTimeValue } from '@sectile/temporal/time-field'
import { createDatePickerState } from '@sectile/temporal/date-picker'
```

지원하는 공개 경로 전체는 [Temporal API 참조](/ko/api/temporal)에 정리되어 있습니다.

## 달력 날짜와 시간대를 분리하기

애플리케이션의 값이 특정 시점이 아니라 달력 날짜나 하루 안의 시각을 뜻한다면 Temporal 값을 그대로 사용합니다. ISO 형태의 문자열로 바꾸는 과정에서도 실행 환경의 시간대를 조회하지 않습니다.

```ts
import {
  createDateValue,
  formatDateValue,
} from '@sectile/temporal/date-field'
import {
  createTimeValue,
  formatTimeValue,
} from '@sectile/temporal/time-field'

const releaseDate = createDateValue(2026, 9, 18)
const cutoffTime = createTimeValue(17, 30)

const payload = {
  releaseDate: formatDateValue(releaseDate),
  cutoffTime: formatTimeValue(cutoffTime),
}

console.log(payload)
// { releaseDate: "2026-09-18", cutoffTime: "17:30" }
```

생일, 예약 날짜, 영업 시간처럼 UTC로 자동 변환하면 의미가 달라지는 값에 적합합니다. 특정 시점이 필요한 경계에서는 애플리케이션이 시간대를 명시하고 그때 변환합니다.

## 잘못된 날짜를 자동으로 고치지 않기

사용자 입력, 네트워크 응답, 저장 데이터처럼 잘못된 값이 들어올 수 있는 경계에서는 파싱 함수와 `try*` 생성 함수가 실패를 `Result`로 반환합니다.

```ts
import { parseDateValue } from '@sectile/temporal/date-field'

const result = parseDateValue('2026-02-30')

if (!result.ok) {
  console.error(result.error.code) // "invalid-date-day"
} else {
  console.log(result.value)
}
```

`parseDateValue()`는 `YYYY-MM-DD` 형식의 값을 읽습니다. 사용자 언어에 맞는 날짜 표기와 숫자 모양은 Temporal 값에 넣지 않고 화면을 만드는 쪽에서 처리합니다.

## 달력 단위로 날짜 계산하기

날짜 계산은 경과한 밀리초가 아니라 달력의 일·월·연 단위를 따릅니다. 예를 들어 1월 31일에서 한 달 뒤로 이동하면 2월에 존재하는 마지막 날짜로 맞춰집니다.

```ts
import {
  addDateMonths,
  createDateValue,
  formatDateValue,
} from '@sectile/temporal/date-field'

const billingDate = createDateValue(2026, 1, 31)
const next = addDateMonths(billingDate, 1)

if (!next.ok) throw new Error(next.error.message)

console.log(formatDateValue(next.value)) // "2026-02-28"
```

같은 날짜 모듈에서 일·연 단위 이동, 비교, 범위, 요일 확인, 범위 포함 여부를 다룰 수 있습니다. 하루 안의 시각을 계산할 때는 `@sectile/temporal/time-field`의 시간 연산을 사용합니다.

## 선택할 수 없는 날짜를 건너뛰기

날짜 선택기 상태는 확정된 날짜와 현재 강조된 날짜를 따로 관리합니다. 정책으로 선택 가능한 범위를 제한하거나 특정 날짜를 선택할 수 없게 만들 수 있으며, 같은 상태와 입력에서는 같은 탐색 결과가 나옵니다.

```ts
import {
  applyDatePickerEvent,
  createDatePickerState,
  type DatePickerPolicies,
} from '@sectile/temporal/date-picker'
import {
  createDateValue,
  dateDayOfWeek,
  formatDateValue,
} from '@sectile/temporal/date-field'

const policies: DatePickerPolicies = {
  weekStartsOn: 1,
  unavailable: value => dateDayOfWeek(value) >= 6,
}

let state = createDatePickerState({
  value: createDateValue(2026, 9, 18),
  open: true,
})

const moved = applyDatePickerEvent(state, 'next-day', policies)
if (!moved.ok) throw new Error(moved.error.message)
state = moved.value.state

console.log(formatDateValue(state.highlighted)) // "2026-09-21"
console.log(state.value === null ? null : formatDateValue(state.value))
// "2026-09-18"

const selected = applyDatePickerEvent(state, 'select-highlighted', policies)
if (!selected.ok) throw new Error(selected.error.message)
state = selected.value.state

if (state.value !== null) {
  console.log(formatDateValue(state.value)) // "2026-09-21"
}
console.log(state.open) // false
```

첫 번째 상태 전이는 선택할 수 없는 주말을 건너뛰어 강조 날짜를 월요일로 옮기지만 확정된 금요일 값은 그대로 둡니다. `select-highlighted`를 적용하면 월요일이 새 값으로 확정되고 선택기가 닫힙니다. 화면 환경에서 포커스나 다른 효과를 반영해야 할 때는 상태 전이가 함께 반환한 `commands`를 처리할 수 있습니다.

날짜 범위, 월, 연도, 날짜와 시각을 함께 선택한다면 해당 선택기 공개 경로를 사용합니다. 지원하는 선택기 전체 목록은 [Temporal API 참조](/ko/api/temporal)에서 확인할 수 있습니다.

## 빈 달력의 첫 화면을 고정하기

아직 선택된 날짜가 없는 달력은 처음 보여줄 월을 정할 기준 날짜가 필요합니다. Temporal은 현재 날짜를 스스로 읽지 않으므로 서버 렌더링, 스냅샷, 백그라운드 작업, 반복 가능한 테스트에서 기준을 직접 전달할 수 있습니다.

```ts
import { createDateValue } from '@sectile/temporal/date-field'
import { createDatePickerState } from '@sectile/temporal/date-picker'

const referenceDate = createDateValue(2026, 9, 1)
const state = createDatePickerState({ referenceDate })

console.log(state.value) // null
console.log(state.view) // { year: 2026, month: 9 }
```

서버와 브라우저가 같은 첫 달력을 만들어야 한다면 초기화할 때 같은 `referenceDate`를 사용합니다. 브라우저와 터미널 연결은 편의를 위해 실행 환경의 현재 날짜를 넣을 수 있지만, 결과를 고정해야 하는 경우에는 명시한 기준 날짜가 우선합니다. Vue에서는 `@sectile/vue/temporal/temporal-provider`로 하위 영역에 같은 기준 날짜를 공유할 수 있습니다.

## 작업별 다음 문서

- [값과 입력란](temporal/values.md) — 날짜·시각 값, 파싱, 입력란, 범위.
- [달력과 선택기](temporal/calendars.md) — 달력 표시, 탐색, 선택 가능 여부, 선택기 구성.
- [결정적인 화면 생성](temporal/determinism.md) — `referenceDate`, 서버 렌더링, 브라우저 연결, 실행 환경 기본값.
- [`@sectile/vue`](/ko/packages/vue), [`@sectile/dom`](/ko/packages/dom), [`@sectile/terminal`](/ko/packages/terminal) — 화면 출력과 플랫폼 연결.
- [Temporal API 참조](/ko/api/temporal) — 지원하는 공개 경로 전체.

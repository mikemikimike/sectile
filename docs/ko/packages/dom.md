---
title: DOM
description: Sectile 상호작용을 애플리케이션이 소유한 브라우저 요소, 폼, 팝업, 대규모 화면에 연결합니다.
---

# DOM

`@sectile/dom`은 애플리케이션이 이미 렌더링한 브라우저 요소에 Sectile 상호작용을 연결합니다. 키보드, 포인터, 포커스, 조합 입력을 해석하고 접근성·상태 속성을 요소에 반영하며, 연결에 필요한 브라우저 리스너와 자원을 관리합니다. 마크업, 애플리케이션 데이터, 시각 스타일은 애플리케이션이 결정합니다.

HTML을 애플리케이션이 직접 소유하거나 프레임워크 연결 계층이 필요하지 않을 때 이 패키지를 사용합니다. Vue가 렌더링과 컴포넌트 수명 주기를 맡는다면 [`@sectile/vue`](/ko/packages/vue)를 사용합니다.

## 설치

```sh
pnpm add @sectile/dom
```

기능별 공개 경로에서 가져오면 어떤 DOM 기능을 쓰는지 가져오기 구문만 봐도 드러납니다.

```ts
import { createCheckbox } from '@sectile/dom/checkbox'
import { createPopover } from '@sectile/dom/popover'
```

지원하는 공개 경로 전체는 [DOM API 참조](/ko/api/dom)에 정리되어 있습니다. Form, Temporal, Virtual, Tabular, Chart 연결은 해당 기능을 사용할 때만 각각의 선택 패키지가 필요합니다.

## 기존 마크업에 동작 연결하기

직접 `create*` 생성 함수는 애플리케이션이 소유한 요소를 받아 바로 사용할 수 있는 연결 객체를 만듭니다. 다음 체크박스는 버튼을 상호작용 요소로 사용하고, 확정된 상태를 별도 문구에 표시합니다.

```html
<button class="newsletter-toggle" type="button" data-newsletter-toggle>
  제품 소식 받기
</button>
<p>현재 설정: <strong data-newsletter-state>끔</strong></p>
```

```ts
import { createCheckbox } from '@sectile/dom/checkbox'

const element = document.querySelector<HTMLElement>('[data-newsletter-toggle]')
const stateLabel = document.querySelector<HTMLElement>('[data-newsletter-state]')

if (element === null || stateLabel === null) {
  throw new Error('제품 소식 설정 요소를 찾을 수 없습니다')
}

const checkbox = createCheckbox({
  element,
  defaultValue: false,
})

const render = () => {
  stateLabel.textContent = checkbox.state.checked === true ? '켬' : '끔'
}

const unsubscribe = checkbox.subscribe(render)
render()

window.addEventListener('pagehide', () => {
  unsubscribe()
  checkbox.destroy()
}, { once: true })
```

연결 객체는 브라우저 입력을 처리하고 요소의 접근성·상태 속성을 현재 상태와 맞춥니다. 위 예제에서는 값이 바뀔 때 체크박스 역할, `aria-checked`, 상태 데이터 속성이 함께 갱신됩니다. 별도의 상태 문구는 애플리케이션이 필요에 따라 렌더링합니다.

직접 연결 객체는 공통 수명 주기 API를 가집니다. `state`로 확정된 상태를 읽고, `send()`로 의미 입력을 보내며, 지원하는 컴포넌트에서는 `update()`로 외부 소유 값을 동기화합니다. `subscribe()`는 확정된 변경을 구독하고 `destroy()`는 연결 객체가 소유한 자원을 해제합니다. 컬렉션 등록이나 위치 갱신처럼 컴포넌트 고유 동작이 필요하면 같은 객체에 전용 메서드가 추가됩니다.

## 애플리케이션 상태로 값 제어하기

연결 객체가 초기 값부터 직접 소유하게 하려면 `defaultValue`를 사용합니다. 최종 값을 애플리케이션 상태가 결정한다면 `value`와 변경 콜백을 함께 전달합니다.

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

제어 상태에서는 상호작용 결과가 `onValueChange`로 제안됩니다. 애플리케이션이 그 값을 받아들인 뒤 `update()`를 호출하면 연결 객체도 확정된 값으로 맞춰집니다. Sectile 컴포넌트가 공유하는 상태 소유 규칙은 [상태 소유권](/ko/guides/state-ownership)에서 다룹니다.

## 마크업을 유지한 채 팝업 연결하기

팝업 연결 객체도 애플리케이션이 만든 트리거와 콘텐츠 요소를 그대로 사용합니다. 열림 상태, 닫기 동작, 포커스, 접근성 속성, 위치 계산은 연결 객체가 맞추고 콘텐츠 구조와 스타일은 그대로 유지됩니다.

```html
<button type="button" data-help-trigger>배송 안내</button>
<div class="delivery-popover" data-help-popover hidden>
  오후 3시 이전 주문은 영업일 기준 당일 출고합니다.
</div>
```

```ts
import { createPopover } from '@sectile/dom/popover'

const trigger = document.querySelector<HTMLElement>('[data-help-trigger]')
const root = document.querySelector<HTMLElement>('[data-help-popover]')

if (trigger === null || root === null) {
  throw new Error('배송 안내 팝업 요소를 찾을 수 없습니다')
}

const popover = createPopover({
  trigger,
  root,
  label: '배송 안내',
  side: 'bottom',
  align: 'start',
})

window.addEventListener('pagehide', () => {
  popover.destroy()
}, { once: true })
```

기본 설정에서는 Popover 연결 객체가 표시 상태를 관리하고 트리거를 기준으로 콘텐츠 위치를 계산합니다. Dialog, Menu, Select, Combobox, Tooltip, Drawer, 날짜 선택기도 각자의 공개 DOM 경로에서 같은 방식으로 애플리케이션 마크업에 연결됩니다.

CSS 닫힘 모션은 [모션](/ko/guides/motion)을 참고하세요. 표시 여부를 애플리케이션이 직접 관리할 수 있도록 공개 옵션을 제공하는 화면도 있습니다. 일반적인 직접 연결 방식에서는 표시 상태, 포커스, 닫기 동작, 위치 계산을 한 연결 객체가 함께 맞춥니다.

## 브라우저 기본 동작 유지하기

HTML이 이미 제공하는 편집 동작은 Sectile이 다시 구현하지 않습니다. 텍스트 입력은 브라우저의 선택 영역과 IME 조합 입력을 유지하고, 폼 컨트롤은 원래의 폼 소속 관계를 유지하며, 포커스 효과는 실제 요소를 대상으로 합니다.

의도한 컨트롤과 HTML 기본 요소가 잘 맞는다면 그 요소를 사용하는 편이 좋습니다. 제품 구조상 다른 요소가 필요할 때 DOM 연결 객체가 필요한 접근성·상태 속성을 그 구조에 반영합니다.

## 반영된 상태로 스타일 지정하기

DOM 연결에는 테마가 포함되지 않습니다. 애플리케이션 클래스와 Sectile이 요소에 반영한 상태 속성을 기준으로 스타일을 지정합니다.

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

복합 화면은 `data-scope`와 `data-part`도 안정적인 스타일 경계로 노출합니다. 공통 선택자 규칙은 [스타일링](/ko/guides/styling), 공개 상태를 이용한 전환 효과는 [모션](/ko/guides/motion)에서 설명합니다.

## 화면과 함께 연결 객체 정리하기

연결 객체의 수명은 자신이 연결된 요소를 소유한 화면의 수명과 같아야 합니다. 경로나 화면, 상위 컴포넌트가 요소를 제거할 때 `destroy()`를 호출하고 애플리케이션이 만든 구독도 같은 시점에 해제합니다.

```ts
const unsubscribe = checkbox.subscribe(render)

function disposeNewsletterControls() {
  unsubscribe()
  checkbox.destroy()
}
```

`destroy()`는 해당 연결 객체가 소유한 브라우저 자원을 해제합니다. 서로 독립적인 연결 객체를 여러 개 만들었다면 각각의 소유 화면에서 따로 정리합니다.

## 필요한 도메인만 추가하기

기본 DOM 패키지는 Core에 의존하며 다른 도메인 패키지를 자동으로 요구하지 않습니다. 필요한 기능에 해당하는 선택 패키지만 추가합니다.

| 필요한 기능 | 추가 패키지 | DOM 공개 경로 | 안내 |
| --- | --- | --- | --- |
| 폼 검증과 제출 | `@sectile/form` | `@sectile/dom/form` | [DOM 폼](/ko/packages/form/dom/) |
| 날짜, 시간, 달력, 선택기 | `@sectile/temporal` | 예: `@sectile/dom/temporal/date-picker` | [Temporal](/ko/packages/temporal) |
| 가상화 목록과 화면 | `@sectile/virtual` | `@sectile/dom/virtual` | [Virtual DOM 연결](/ko/packages/virtual/dom) |
| 표와 그리드 | `@sectile/tabular` | `@sectile/dom/tabular` | [Tabular DOM 조합](/ko/packages/tabular/dom) |
| 차트 | `@sectile/chart` | `@sectile/dom/chart` | [DOM 차트 렌더링](/ko/packages/chart/dom) |

각 도메인의 동작 규칙은 해당 패키지가 계속 맡습니다. DOM 연결은 그 규칙에 브라우저 요소, 입력, 측정, 포커스, 렌더링 자원, 정리 수명 주기를 결합합니다.

## 수명 주기를 분리해야 할 때 하위 API 사용하기

대부분은 직접 생성 함수로 시작하면 됩니다. 상태와 요소의 수명 주기를 분리해야 하는 컴포넌트는 하위 컨트롤러와 속성 도우미도 공개합니다. 예를 들어 `createCheckboxController()`는 요소 없이 체크박스 상태를 관리하고, `getCheckboxAttributes()`는 현재 상태를 애플리케이션이 관리하는 DOM에 반영할 속성으로 바꿉니다.

이 방식은 이벤트 위임 시스템이나 사용자 정의 렌더링 계층처럼 하나의 직접 연결 객체가 요소를 소유하기 어려운 경우에 적합합니다. 공개 패키지 경로의 기준 목록은 [DOM API 참조](/ko/api/dom)에 있으며, 세부 타입과 도우미는 필요한 컴포넌트 경로에서 찾을 수 있습니다.

## 생성 실패를 정상 흐름에서 처리하기

`create*` 생성 함수는 바로 사용할 수 있는 연결 객체를 반환하며 설정 값이 잘못되면 예외를 던집니다. 외부 설정처럼 생성 실패를 정상 흐름에서 처리해야 한다면 대응하는 `tryCreate*`를 사용해 `Result`로 받습니다.

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

## 작업별 다음 문서

- 개별 컨트롤의 동작 미리보기와 DOM 사용 코드는 [컴포넌트](/ko/components/)에서 확인할 수 있습니다.
- 애플리케이션 상태가 값을 소유하는 경우에는 [상태 소유권](/ko/guides/state-ownership)을 참고하세요.
- 공개 상태 선택자와 전환 효과는 [스타일링](/ko/guides/styling)과 [모션](/ko/guides/motion)에서 다룹니다.
- 정확한 DOM 공개 패키지 경로가 필요하면 [DOM API 참조](/ko/api/dom)를 확인하세요.

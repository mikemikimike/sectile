---
title: Form
description: 브라우저 기본 입력과 Sectile 컴포넌트를 한 폼에서 검증하고 제출 상태, 오류, 초기화, 변경 여부를 관리합니다.
---

# Form

Sectile Form은 폼 전체의 검증, 제출, 오류, 초기화와 변경 여부를 조정합니다. 각 입력 값은 계속 해당 입력 요소나 컴포넌트가 소유합니다. Vue 템플릿에서는 Vue 연결을 사용하고, 이미 있는 HTML 폼에는 DOM 연결을 붙입니다.

일반 Sectile 컴포넌트만 사용하는 경우에는 `@sectile/form`이 필요하지 않습니다. Form 기능을 사용할 때만 추가로 설치합니다.

## 연결 방식 선택하기

Vue 애플리케이션에서는 다음 패키지를 설치합니다.

```sh
pnpm add @sectile/core @sectile/form @sectile/dom @sectile/vue vue
```

```ts
import {
  FormField,
  FormLabel,
  FormMessage,
  FormRoot,
  FormSubmit,
  FormSummary,
  defineFormSubmission,
} from '@sectile/vue/form'
```

Vue 없이 기존 브라우저 마크업에 연결하려면 다음 구성을 사용합니다.

```sh
pnpm add @sectile/core @sectile/form @sectile/dom
```

```ts
import { createForm, defineFormSubmission } from '@sectile/dom/form'
```

두 연결 방식은 같은 Form 동작을 사용합니다. 별도의 폼 모델을 익힐 필요 없이 현재 애플리케이션이 사용하는 화면 환경에 맞춰 연결 방식을 정하면 됩니다.

## Vue 폼 구성하기

`FormRoot`가 브라우저의 `<form>` 요소를 렌더링합니다. 폼에 참여하는 입력을 `FormField`로 묶고 레이블과 오류 메시지를 연결한 뒤, 제출이 성공했을 때 할 일을 정의합니다.

```vue
<script setup lang="ts">
import {
  FormDescription,
  FormField,
  FormLabel,
  FormMessage,
  FormRoot,
  FormSubmit,
  FormSummary,
  defineFormSubmission,
} from '@sectile/vue/form'
import { TextField } from '@sectile/vue/text'

const submission = defineFormSubmission({
  onSubmit: async ({ formData, reinitialize }) => {
    await fetch('/account', {
      method: 'POST',
      body: formData,
    })
    reinitialize()
  },
})
</script>

<template>
  <FormRoot v-bind="submission">
    <FormSummary />

    <FormField name="email" required>
      <FormLabel>이메일 주소</FormLabel>
      <TextField type="email" autocomplete="email" />
      <FormDescription>계정 알림을 받을 주소입니다.</FormDescription>
      <FormMessage />
    </FormField>

    <FormField name="timezone">
      <FormLabel>시간대</FormLabel>
      <select name="timezone">
        <option value="Asia/Seoul">서울</option>
        <option value="Europe/London">런던</option>
      </select>
      <FormMessage />
    </FormField>

    <FormSubmit>계정 저장</FormSubmit>
  </FormRoot>
</template>
```

브라우저 기본 입력과 Sectile 입력은 같은 폼에 함께 넣을 수 있습니다. 저장에 성공한 뒤 `reinitialize()`를 호출하면 현재 화면의 값은 그대로 두면서 그 값을 새 기준으로 삼습니다. 그러면 저장되지 않은 변경 여부(`dirty`)가 다시 `false`가 됩니다.

필드 구성, 사용자 정의 요약, 새 기준값 설정, 서버 렌더링까지 필요한 경우 [Vue 폼](/ko/packages/form/vue/)에서 이어서 확인할 수 있습니다.

## 기존 HTML 폼에 연결하기

DOM 연결은 일반 HTML 폼에서 시작합니다. 따라서 자바스크립트가 아직 로드되지 않은 상태에서도 폼 자체의 기본 동작은 남습니다.

```html
<form id="account-form" action="/account" method="post">
  <div id="account-summary"></div>

  <label for="account-email">이메일 주소</label>
  <input id="account-email" name="email" type="email" required>

  <button type="reset">초기화</button>
  <button type="submit">계정 저장</button>
</form>
```

Form이 필드 상태, 오류 대상 연결, 포커스 복구를 관리해야 하는 입력만 연결합니다.

```ts
import { createForm, defineFormSubmission } from '@sectile/dom/form'

const formElement = document.querySelector<HTMLFormElement>('#account-form')!
const summary = document.querySelector<HTMLElement>('#account-summary')!
const email = document.querySelector<HTMLInputElement>('#account-email')!

const submission = defineFormSubmission({
  onSubmit: async ({ formData, reinitialize }) => {
    await fetch('/account', {
      method: 'POST',
      body: formData,
    })
    reinitialize()
  },
})

const form = createForm({
  form: formElement,
  summary,
  participants: [{ id: 'email', element: email }],
  ...submission,
})

window.addEventListener('pagehide', () => form.destroy(), { once: true })
```

이름이 있는 다른 입력도 브라우저의 `FormData`에는 그대로 포함됩니다. Form이 해당 입력의 필드 상태나 오류 복구까지 관리해야 할 때만 참여 입력으로 등록하면 됩니다.

`onSubmit`을 생략하면 브라우저가 폼의 `action`, `method`, `enctype`과 제출 버튼 설정에 따라 기본 제출을 수행합니다.

동적으로 추가되는 입력과 사용자 정의 참여 입력, 브라우저 제출과 Form이 관리하는 제출의 차이는 [DOM 폼](/ko/packages/form/dom/)에서 다룹니다.

## 저장되지 않은 변경과 제출 중 상태 표시하기

Form은 값의 변경 여부와 제출 과정을 서로 다른 상태로 관리합니다. Vue에서는 `FormRoot` 슬롯에서 두 값을 함께 읽을 수 있습니다.

```vue
<FormRoot v-bind="submission" v-slot="{ dirty, submission }">
  <!-- 필드 -->
  <p v-if="dirty">저장하지 않은 변경 사항이 있습니다.</p>
  <FormSubmit :disabled="submission.status === 'submitting'">
    {{ submission.status === 'submitting' ? '저장 중…' : '저장' }}
  </FormSubmit>
</FormRoot>
```

DOM 연결에서는 같은 상태를 구독합니다.

```ts
const unsubscribe = form.subscribe(({ state }) => {
  unsavedBadge.hidden = !state.dirty
  saveButton.disabled = state.submission.status === 'submitting'
})

window.addEventListener('pagehide', unsubscribe, { once: true })
```

변경 여부(`dirty`)는 현재 참여 입력의 값과 기준값을 비교합니다. 값을 다시 기준값과 같게 만들면 `dirty`는 `false`로 돌아갈 수 있습니다. 반면 사용자가 이미 입력을 조작했다면 상호작용 여부(`touched`)는 계속 유지될 수 있습니다.

이 상태를 이용해 화면 이동 확인, `beforeunload` 경고, 임시 저장 같은 제품 동작을 연결하는 일은 애플리케이션이 결정합니다.

## 검증 오류와 저장 실패 구분하기

잘못된 입력값과 저장 요청 실패는 서로 다른 문제입니다. 입력 검증 오류는 해당 필드를 유효하지 않은 상태로 만들고 `FormMessage`나 `FormSummary`에 표시할 수 있습니다. 제출 실패는 입력값을 잘못된 값으로 바꾸지 않고 저장 자체가 실패했다는 상태로 남습니다.

Vue에서 요약 영역을 직접 구성하면 두 종류의 문제를 구분해서 보여줄 수 있습니다.

```vue
<FormSummary v-slot="{ submission, issues, firstIssue }">
  <p v-if="submission.failure">{{ submission.failure.message }}</p>
  <p v-else-if="firstIssue">{{ firstIssue.message }}</p>
  <small v-if="issues.length">오류 {{ issues.length }}개</small>
</FormSummary>
```

서버 검증 결과는 하나의 주 필드와 관련 필드들을 함께 가리킬 수도 있습니다. 이 경우 요약에는 오류를 한 번만 표시하면서 관련된 모든 필드를 유효하지 않은 상태로 표시할 수 있습니다.

브라우저 검증, 스키마 검증, 애플리케이션 검증, 서버 검증의 수명 주기는 [검증과 오류](/ko/packages/form/validation)에서 자세히 다룹니다.

## 값을 되돌리거나 현재 값을 새 기준으로 삼기

입력을 처음 기본값으로 되돌리려면 폼 초기화를 사용합니다. 현재 값을 화면에 유지하면서 방금 저장한 값으로 인정하려면 `reinitialize()`를 사용합니다.

Vue에서는 제출 처리 안에서 새 기준을 적용할 수 있습니다.

```ts
const submission = defineFormSubmission({
  onSubmit: async ({ formData, reinitialize }) => {
    await saveProfile(formData)
    reinitialize()
  },
})
```

DOM 연결에서는 폼 객체에서 직접 호출할 수 있습니다.

```ts
form.reinitialize()
```

`reinitialize()`는 기준값만 바꾸며 입력 요소의 현재 값을 다시 쓰지 않습니다. 값 보존 옵션, 파일 입력, 비동기 제출은 [제출과 값 기준 관리](/ko/packages/form/submission)에서 이어서 확인할 수 있습니다.

## 작업별 다음 문서

- [필드와 컨트롤](/ko/packages/form/fields) — 브라우저 기본 입력, Sectile 컨트롤, 그룹, 필드 식별.
- [검증과 오류](/ko/packages/form/validation) — 브라우저, 스키마, 애플리케이션, 서버 검증.
- [제출과 값 기준 관리](/ko/packages/form/submission) — 비동기 저장, 파일, 초기화, 새 변경 기준.
- [사용자 정의 컨트롤](/ko/packages/form/custom-controls) — 애플리케이션이 만든 입력을 Form에 연결하기.
- [SSR과 하이드레이션](/ko/packages/form/ssr) — Vue 폼의 서버 렌더링과 첫 브라우저 렌더링 맞추기.

정확한 공개 항목과 타입은 [Form API 참조](/ko/api/form), [Vue Form API](/ko/api/form/vue), [DOM Form API](/ko/api/form/dom)에 정리되어 있습니다.

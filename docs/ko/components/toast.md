<!-- scripts/generate-component-pages.mjs에서 생성함. -->
# Toast

현재 작업과 함께 짧은 피드백을 순서대로 알립니다.

## 용법

### 자동 닫힘

잠시 표시한 알림을 자동으로 닫되 사용자가 바로 닫을 수 있는 버튼도 함께 제공합니다.

<ComponentExample component="toast" scenario="automatic" title="자동 닫힘" description="잠시 표시한 알림을 자동으로 닫되 사용자가 바로 닫을 수 있는 버튼도 함께 제공합니다." :index="0" />

### 계속 유지되는 알림

사용자가 직접 닫을 때까지 알림을 계속 표시합니다.

<ComponentExample component="toast" scenario="persistent" title="계속 유지되는 알림" description="사용자가 직접 닫을 때까지 알림을 계속 표시합니다." :index="1" />

### 개수 제한

기존 값을 유지하면서 설정한 항목 수나 화면 표시 개수를 지킵니다.

<ComponentExample component="toast" scenario="limited" title="개수 제한" description="기존 값을 유지하면서 설정한 항목 수나 화면 표시 개수를 지킵니다." :index="2" />

### setup에서 호출

<code>useToast()</code>는 <code>ToastProvider</code>의 슬롯 하위 컴포넌트 setup에서 호출합니다. 반환된 state와 함수는 템플릿이나 이벤트·비동기 함수에서 사용할 수 있습니다. Context를 사용하는 컴포넌트를 Provider 슬롯 아래에 두면 같은 트리에서 toast 상태와 동작을 공유합니다.

~~~vue
<!-- AppShell.vue -->
<ToastProvider v-slot="{ toasts }">
  <RequestButton />
  <ToastViewport class="toast-viewport">
    <ToastRoot v-for="item in toasts" :key="item.id" :value="item.id" class="toast-item">
      <ToastTitle />
      <ToastDescription />
      <ToastClose>닫기</ToastClose>
    </ToastRoot>
  </ToastViewport>
</ToastProvider>
~~~

~~~ts
// RequestButton.vue <script setup>
const { toast, update } = useToast()

async function save() {
  const id = crypto.randomUUID()
  toast({ id, title: '저장 중', kind: 'deployment-pending', durationMs: null })
  try {
    const result = await saveRelease()
    update(id, { title: '저장 완료', kind: 'deployment-complete', durationMs: 3_000 })
    return result
  } catch (error) {
    update(id, { title: '저장 실패', description: '다시 시도해 주세요.', kind: 'error', durationMs: 5_000 })
    throw error
  }
}
~~~

애플리케이션이 요청을 실행하고 pending·성공·실패 문구, 시간, 오류 노출 정책을 결정합니다. markup, 아이콘, class, 위치, 모션도 Provider의 compound parts를 조립하는 애플리케이션이 소유합니다.

<code>kind</code>는 사용자 정의 문자열입니다. 생략하거나 빈 문자열이면 <code>info</code>가 되고, 그 외 값은 <code>data-kind</code>까지 그대로 전달됩니다. 기존 접근성 호환성을 위해 정확히 <code>error</code>인 항목만 <code>role="alert"</code>, 나머지는 <code>role="status"</code>를 사용합니다.

### CSS로 직접 스타일링

아이콘과 별도 설정을 생략하는 구성에서는 <code>data-kind</code> 선택자만 사용합니다.

~~~css
.toast-item[data-kind='deployment-pending'] {
  background: var(--toast-pending-background);
}

.toast-item[data-kind='deployment-complete'] {
  background: var(--toast-complete-background);
}
~~~

### class와 아이콘 등록

애플리케이션의 일반 객체에 kind 표시 정보를 등록합니다. 미등록 값은 명시적인 fallback으로 처리합니다.

~~~ts
// toast-kinds.ts
import type { Component } from 'vue'
import InfoIcon from './InfoIcon.vue'
import SpinnerIcon from './SpinnerIcon.vue'
import SuccessIcon from './SuccessIcon.vue'
import ErrorIcon from './ErrorIcon.vue'

interface ToastKindPresentation {
  readonly class: string
  readonly icon: Component
}

export const toastKinds = {
  info: { class: 'toast--info', icon: InfoIcon },
  'deployment-pending': { class: 'toast--pending', icon: SpinnerIcon },
  'deployment-complete': { class: 'toast--complete', icon: SuccessIcon },
  error: { class: 'toast--error', icon: ErrorIcon },
} as const satisfies Record<string, ToastKindPresentation>

export type AppToastKind = keyof typeof toastKinds

const fallbackKind: ToastKindPresentation = {
  class: 'toast--unknown',
  icon: InfoIcon,
}

export function resolveToastKind(kind: string): ToastKindPresentation {
  return kind in toastKinds
    ? toastKinds[kind as AppToastKind]
    : fallbackKind
}
~~~

~~~vue
<ToastRoot
  v-for="item in toasts"
  :key="item.id"
  :value="item.id"
  :class="resolveToastKind(item.kind).class"
>
  <component :is="resolveToastKind(item.kind).icon" />
  <ToastTitle />
  <ToastDescription />
</ToastRoot>
~~~

### 애플리케이션 내부에서 kind 제한

Sectile은 모든 문자열을 허용하지만 애플리케이션 wrapper에서는 등록된 kind만 받도록 좁힐 수 있습니다.

~~~ts
// use-app-toast.ts
import type { ToastInput } from '@sectile/vue/toast'
import { useToast } from '@sectile/vue/toast'
import type { AppToastKind } from './toast-kinds'

type AppToastInput = Omit<ToastInput<string>, 'kind'> & {
  readonly kind?: AppToastKind
}

export function useAppToast() {
  const api = useToast()
  return {
    ...api,
    toast(input: AppToastInput) {
      api.toast(input)
    },
  }
}
~~~

## 모션 예시

Toast root의 열림/닫힘 state를 opacity와 이동에 연결하면 알림을 읽는 흐름을 방해하지 않으면서 등장과 퇴장을 구분할 수 있습니다.

```css
[data-scope='toast'][data-part='root'][data-state='open'] {
  animation: toast-in 180ms cubic-bezier(.2, .8, .2, 1);
}

[data-scope='toast'][data-part='root'][data-state='closed'] {
  animation: toast-out 140ms ease-in;
}

@keyframes toast-in {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes toast-out {
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(6px); }
}

@media (prefers-reduced-motion: reduce) {
  [data-scope='toast'][data-part='root'] {
    animation: none !important;
  }
}
```

[모션 가이드에서 reduced-motion 패턴 보기](/ko/guides/motion)

## API 레퍼런스

Prop, event, slot, 공개 type, part selector와 키보드 동작은 [Toast API](/ko/api/components/toast)에서 확인합니다.

## 접근성

표시 영역이 알림 순서와 키보드 접근을 유지하며 각 알림에 지역화된 닫기 작업을 제공하고 사용자 조작이나 창 상태에 따라 자동 닫기를 멈춥니다.

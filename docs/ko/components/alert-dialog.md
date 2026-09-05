<!-- scripts/generate-component-pages.mjs에서 생성함. -->
# Alert Dialog

복구 불가능한 작업을 실행하기 전에 명확한 확인을 받습니다.

## 용법

### 파괴적 작업 확인

복구 불가능한 작업은 실행 전에 명시적으로 확인합니다.

<ComponentExample component="alert-dialog" scenario="destructive" title="파괴적 작업 확인" description="복구 불가능한 작업은 실행 전에 명시적으로 확인합니다." :index="0" />

### 미저장 변경

저장 전 변경을 버리기 전에 확인합니다.

<ComponentExample component="alert-dialog" scenario="unsaved" title="미저장 변경" description="저장 전 변경을 버리기 전에 확인합니다." :index="1" />

### 외부 상태 관리

현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다.

<ComponentExample component="alert-dialog" scenario="controlled" title="외부 상태 관리" description="현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다." :index="2" />

## 외부 조작

`closeOnInteractOutside`로 콘텐츠 밖의 포인터 조작이 컴포넌트를 닫을지 정합니다. `interactOutsideExclusions`에 넣은 요소는 모달에서도 계속 조작할 수 있으며 외부 조작 판정에서 제외됩니다. 조건부로 유지하려면 `interact-outside` 이벤트에서 `preventDefault()`를 호출합니다.

```vue
<AlertDialogRoot
  :interact-outside-exclusions="[ignoredElement]"
  @interact-outside="(event) => {
    if (event.isInside(temporarilyIgnoredElement)) event.preventDefault()
  }"
/>
```

## 모션 예시

`[data-scope='alert-dialog'][data-part='content']`의 `data-state`를 사용하면 별도 애니메이션 라이브러리 없이 열림과 닫힘을 모두 표현할 수 있습니다. 닫힘 모션 뒤 element를 제거하려면 이 컴포넌트의 `unmountOnExit`을 사용합니다.

```css
[data-scope='alert-dialog'][data-part='content'][data-state='open'] {
  animation: alert-dialog-in 180ms cubic-bezier(.2, .8, .2, 1);
}

[data-scope='alert-dialog'][data-part='content'][data-state='closed'] {
  animation: alert-dialog-out 140ms ease-in;
}

@keyframes alert-dialog-in {
  from { opacity: 0; transform: translateY(6px) scale(.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes alert-dialog-out {
  from { opacity: 1; transform: translateY(0) scale(1); }
  to { opacity: 0; transform: translateY(4px) scale(.985); }
}

@media (prefers-reduced-motion: reduce) {
  [data-scope='alert-dialog'][data-part='content'] {
    animation: none !important;
  }
}
```

[공통 모션 패턴 보기](/ko/guides/motion)

## API 레퍼런스

Prop, event, slot, 공개 type, part selector와 키보드 동작은 [Alert Dialog API](/ko/api/components/alert-dialog)에서 확인합니다.

## 접근성

확인 대화상자는 제목과 설명을 연결하고 모달 포커스를 내부에 유지한 뒤 닫힐 때 복원합니다.

[관련 WAI-ARIA 패턴](https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/)에서 호스트 접근성 규칙을 확인할 수 있습니다.

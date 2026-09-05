<!-- scripts/generate-component-pages.mjs에서 생성함. -->
# Dialog

모달 또는 비모달 방식으로 페이지 위에 포커스된 내용을 엽니다.

## 용법

### 모달

열린 대화상자 안에 포커스를 유지하고 닫을 때 실행 요소로 되돌립니다.

<ComponentExample component="dialog" scenario="modal" title="모달" description="열린 대화상자 안에 포커스를 유지하고 닫을 때 실행 요소로 되돌립니다." :index="0" />

### 비모달 모달

대화상자가 열려 있어도 주변 내용을 계속 조작할 수 있습니다.

<ComponentExample component="dialog" scenario="non-modal" title="비모달 모달" description="대화상자가 열려 있어도 주변 내용을 계속 조작할 수 있습니다." :index="1" />

### 외부 상태 관리

현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다.

<ComponentExample component="dialog" scenario="controlled" title="외부 상태 관리" description="현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다." :index="2" />

## 외부 조작

`closeOnInteractOutside`로 콘텐츠 밖의 포인터 조작이 컴포넌트를 닫을지 정합니다. `interactOutsideExclusions`에 넣은 요소는 모달에서도 계속 조작할 수 있으며 외부 조작 판정에서 제외됩니다. 조건부로 유지하려면 `interact-outside` 이벤트에서 `preventDefault()`를 호출합니다.

```vue
<DialogRoot
  :interact-outside-exclusions="[ignoredElement]"
  @interact-outside="(event) => {
    if (event.isInside(temporarilyIgnoredElement)) event.preventDefault()
  }"
/>
```

## 모션 예시

`[data-scope='dialog'][data-part='content']`의 `data-state`를 사용하면 별도 애니메이션 라이브러리 없이 열림과 닫힘을 모두 표현할 수 있습니다. 닫힘 모션 뒤 element를 제거하려면 이 컴포넌트의 `unmountOnExit`을 사용합니다.

```css
[data-scope='dialog'][data-part='content'][data-state='open'] {
  animation: dialog-in 180ms cubic-bezier(.2, .8, .2, 1);
}

[data-scope='dialog'][data-part='content'][data-state='closed'] {
  animation: dialog-out 140ms ease-in;
}

@keyframes dialog-in {
  from { opacity: 0; transform: translateY(6px) scale(.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes dialog-out {
  from { opacity: 1; transform: translateY(0) scale(1); }
  to { opacity: 0; transform: translateY(4px) scale(.985); }
}

@media (prefers-reduced-motion: reduce) {
  [data-scope='dialog'][data-part='content'] {
    animation: none !important;
  }
}
```

[공통 모션 패턴 보기](/ko/guides/motion)

## API 레퍼런스

Prop, event, slot, 공개 type, part selector와 키보드 동작은 [Dialog API](/ko/api/components/dialog)에서 확인합니다.

## 접근성

대화상자는 제목과 설명을 연결하고 모달 배경을 격리하며 포커스를 가두고 페이지 스크롤을 잠근 뒤 닫힐 때 포커스를 복원합니다.

[관련 WAI-ARIA 패턴](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)에서 호스트 접근성 규칙을 확인할 수 있습니다.

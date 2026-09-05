<!-- scripts/generate-component-pages.mjs에서 생성함. -->
# Popover

페이지 조작을 유지하며 실행 요소에 상호작용 가능한 내용을 붙입니다.

## 용법

### 기준 요소에 연결된

주변 배치가 바뀌어도 팝업을 실행 요소에 붙여 둡니다.

<ComponentExample component="popover" scenario="anchored" title="기준 요소에 연결된" description="주변 배치가 바뀌어도 팝업을 실행 요소에 붙여 둡니다." :index="0" />

### 외부 상태 관리

현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다.

<ComponentExample component="popover" scenario="controlled" title="외부 상태 관리" description="현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다." :index="1" />

## 예시

### 화면 경계 회피

원하는 위치가 화면을 벗어나면 팝업을 반대편으로 옮기거나 안쪽으로 밀어 넣습니다.

<ComponentExample component="popover" scenario="collision" title="화면 경계 회피" description="원하는 위치가 화면을 벗어나면 팝업을 반대편으로 옮기거나 안쪽으로 밀어 넣습니다." :index="2" />

## 외부 조작

`closeOnInteractOutside`로 콘텐츠 밖의 포인터 조작이 컴포넌트를 닫을지 정합니다. `interactOutsideExclusions`에 넣은 요소는 모달에서도 계속 조작할 수 있으며 외부 조작 판정에서 제외됩니다. 조건부로 유지하려면 `interact-outside` 이벤트에서 `preventDefault()`를 호출합니다.

```vue
<PopoverRoot
  :interact-outside-exclusions="[ignoredElement]"
  @interact-outside="(event) => {
    if (event.isInside(temporarilyIgnoredElement)) event.preventDefault()
  }"
/>
```

## Floating 위치

이 컴포넌트는 공통 위치 엔진을 사용합니다. [실시간 위치 예시](/ko/guide/positioning)에서 `side`, `align`, 간격, 충돌 경계, strategy, tracking을 바꾸며 계산 결과를 확인할 수 있습니다.

## 모션 예시

`[data-scope='popover'][data-part='content']`의 `data-state`를 사용하면 별도 애니메이션 라이브러리 없이 열림과 닫힘을 모두 표현할 수 있습니다. 닫힘 모션 뒤 element를 제거하려면 이 컴포넌트의 `unmountOnExit`을 사용합니다.

```css
[data-scope='popover'][data-part='content'][data-state='open'] {
  animation: popover-in 180ms cubic-bezier(.2, .8, .2, 1);
}

[data-scope='popover'][data-part='content'][data-state='closed'] {
  animation: popover-out 140ms ease-in;
}

@keyframes popover-in {
  from { opacity: 0; transform: translateY(6px) scale(.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes popover-out {
  from { opacity: 1; transform: translateY(0) scale(1); }
  to { opacity: 0; transform: translateY(4px) scale(.985); }
}

@media (prefers-reduced-motion: reduce) {
  [data-scope='popover'][data-part='content'] {
    animation: none !important;
  }
}
```

[공통 모션 패턴 보기](/ko/guides/motion)

## API 레퍼런스

Prop, event, slot, 공개 type, part selector와 키보드 동작은 [Popover API](/ko/api/components/popover)에서 확인합니다.

## 접근성

실행 요소가 열림 상태와 팝업 연결을 노출하고 선택적인 제목과 설명이 떠 있는 내용의 이름을 제공합니다.

[관련 WAI-ARIA 패턴](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)에서 호스트 접근성 규칙을 확인할 수 있습니다.

<!-- scripts/generate-component-pages.mjs에서 생성함. -->
# Toggle Group

포커스가 이어지는 묶음에서 하나 또는 여러 작업의 눌림 상태를 관리합니다.

## 용법

### 하나만 선택

한 번에 하나의 값만 활성화하고 키보드나 포인터로 이동해 선택합니다.

<ComponentExample component="toggle-group" scenario="single" title="하나만 선택" description="한 번에 하나의 값만 활성화하고 키보드나 포인터로 이동해 선택합니다." :index="0" />

### 여러 항목 선택

기존 선택을 유지하면서 여러 값을 각각 선택하거나 해제합니다.

<ComponentExample component="toggle-group" scenario="multiple" title="여러 항목 선택" description="기존 선택을 유지하면서 여러 값을 각각 선택하거나 해제합니다." :index="1" />

### 외부 상태 관리

현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다.

<ComponentExample component="toggle-group" scenario="controlled" title="외부 상태 관리" description="현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다." :index="2" />

## 선택 상태 모션 예시

선택 상태는 공개 ARIA 또는 state 속성으로 드러납니다. 짧은 색상·크기 transition은 선택 결과를 확인시켜 주면서 키보드 탐색과 독립적으로 유지됩니다.

```css
[data-scope='toggle-group'][data-part='item'] {
  transition: background-color 120ms ease, border-color 120ms ease, transform 120ms ease;
}

[data-scope='toggle-group'][data-part='item'][aria-pressed='true'] {
  transform: scale(1.025);
  background: color-mix(in srgb, currentColor 12%, transparent);
}

@media (prefers-reduced-motion: reduce) {
  [data-scope='toggle-group'][data-part='item'] {
    transition: none;
  }
}
```

## API 레퍼런스

Prop, event, slot, 공개 type, part selector와 키보드 동작은 [Toggle Group API](/ko/api/components/toggle-group)에서 확인합니다.

## 접근성

이름이 있는 묶음이 각 항목을 눌림 버튼으로 노출하고 하나의 이동 탭 위치를 사용합니다.

[관련 WAI-ARIA 패턴](https://www.w3.org/WAI/ARIA/apg/patterns/button/)에서 호스트 접근성 규칙을 확인할 수 있습니다.

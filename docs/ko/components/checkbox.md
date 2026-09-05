<!-- scripts/generate-component-pages.mjs에서 생성함. -->
# Checkbox

하나의 선택 여부를 바꾸거나 일부만 선택된 부모 상태를 나타냅니다.

## 용법

### 선택 또는 해제

하나의 선택 항목을 선택 또는 해제 상태로 나타냅니다.

<ComponentExample component="checkbox" scenario="binary" title="선택 또는 해제" description="하나의 선택 항목을 선택 또는 해제 상태로 나타냅니다." :index="0" />

### 일부 선택

하위 항목이 일부만 선택된 부모 항목을 나타냅니다.

<ComponentExample component="checkbox" scenario="mixed" title="일부 선택" description="하위 항목이 일부만 선택된 부모 항목을 나타냅니다." :index="1" />

### 외부 상태 관리

현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다.

<ComponentExample component="checkbox" scenario="controlled" title="외부 상태 관리" description="현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다." :index="2" />

## 선택 상태 모션 예시

선택 상태는 공개 ARIA 또는 state 속성으로 드러납니다. 짧은 색상·크기 transition은 선택 결과를 확인시켜 주면서 키보드 탐색과 독립적으로 유지됩니다.

```css
[data-scope='checkbox'][data-part='root'] {
  transition: background-color 120ms ease, border-color 120ms ease, transform 120ms ease;
}

[data-scope='checkbox'][data-part='root'][aria-checked='true'] {
  transform: scale(1.025);
  background: color-mix(in srgb, currentColor 12%, transparent);
}

@media (prefers-reduced-motion: reduce) {
  [data-scope='checkbox'][data-part='root'] {
    transition: none;
  }
}
```

## API 레퍼런스

Prop, event, slot, 공개 type, part selector와 키보드 동작은 [Checkbox API](/ko/api/components/checkbox)에서 확인합니다.

## 접근성

루트는 체크박스 의미를 제공하며 일부 선택 값은 `aria-checked="mixed"`로 노출합니다.

[관련 WAI-ARIA 패턴](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/)에서 호스트 접근성 규칙을 확인할 수 있습니다.

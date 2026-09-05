<!-- scripts/generate-component-pages.mjs에서 생성함. -->
# Radio Group

이름이 있는 선택지 묶음에서 정확히 하나를 고릅니다.

## 용법

### 세로 방향

같은 크기 규칙을 유지하면서 세로 방향으로 영역을 조절합니다.

<ComponentExample component="radio-group" scenario="vertical" title="세로 방향" description="같은 크기 규칙을 유지하면서 세로 방향으로 영역을 조절합니다." :index="0" />

### 가로 방향 비활성 항목

활성 라디오 버튼을 따라 가로로 이동합니다.

<ComponentExample component="radio-group" scenario="horizontal-disabled" title="가로 방향 비활성 항목" description="활성 라디오 버튼을 따라 가로로 이동합니다." :index="1" />

### 외부 상태 관리

현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다.

<ComponentExample component="radio-group" scenario="controlled" title="외부 상태 관리" description="현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다." :index="2" />

## 선택 상태 모션 예시

선택 상태는 공개 ARIA 또는 state 속성으로 드러납니다. 짧은 색상·크기 transition은 선택 결과를 확인시켜 주면서 키보드 탐색과 독립적으로 유지됩니다.

```css
[data-scope='radio-group'][data-part='item'] {
  transition: background-color 120ms ease, border-color 120ms ease, transform 120ms ease;
}

[data-scope='radio-group'][data-part='item'][aria-checked='true'] {
  transform: scale(1.025);
  background: color-mix(in srgb, currentColor 12%, transparent);
}

@media (prefers-reduced-motion: reduce) {
  [data-scope='radio-group'][data-part='item'] {
    transition: none;
  }
}
```

## API 레퍼런스

Prop, event, slot, 공개 type, part selector와 키보드 동작은 [Radio Group API](/ko/api/components/radio-group)에서 확인합니다.

## 접근성

묶음과 각 라디오가 선택·강조·비활성 상태를 노출하고 하나의 이동 탭 위치를 사용합니다.

[관련 WAI-ARIA 패턴](https://www.w3.org/WAI/ARIA/apg/patterns/radio/)에서 호스트 접근성 규칙을 확인할 수 있습니다.

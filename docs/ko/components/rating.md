<!-- scripts/generate-component-pages.mjs에서 생성함. -->
# Rating

순서가 있는 평점 척도에서 점수를 고치거나 지웁니다.

## 용법

### 5점 별점

5점 척도에서 점수를 고르고 다시 지울 수 있습니다.

<ComponentExample component="rating" scenario="five-star" title="5점 별점" description="5점 척도에서 점수를 고르고 다시 지울 수 있습니다." :index="0" />

### 필수 선택

항상 하나의 값이 선택되거나 하나의 영역이 펼쳐진 상태를 유지합니다.

<ComponentExample component="rating" scenario="required" title="필수 선택" description="항상 하나의 값이 선택되거나 하나의 영역이 펼쳐진 상태를 유지합니다." :index="1" />

### 외부 상태 관리

현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다.

<ComponentExample component="rating" scenario="controlled" title="외부 상태 관리" description="현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다." :index="2" />

## 선택 상태 모션 예시

선택 상태는 공개 ARIA 또는 state 속성으로 드러납니다. 짧은 색상·크기 transition은 선택 결과를 확인시켜 주면서 키보드 탐색과 독립적으로 유지됩니다.

```css
[data-scope='rating'][data-part='item'] {
  transition: background-color 120ms ease, border-color 120ms ease, transform 120ms ease;
}

[data-scope='rating'][data-part='item'][aria-checked='true'] {
  transform: scale(1.025);
  background: color-mix(in srgb, currentColor 12%, transparent);
}

@media (prefers-reduced-motion: reduce) {
  [data-scope='rating'][data-part='item'] {
    transition: none;
  }
}
```

## API 레퍼런스

Prop, event, slot, 공개 type, part selector와 키보드 동작은 [Rating API](/ko/api/components/rating)에서 확인합니다.

## 접근성

평점 선택은 라디오 묶음 의미를 사용하고 각 점수에 이름을 제공하며 명시적인 지우기 작업을 제공합니다.

[관련 WAI-ARIA 패턴](https://www.w3.org/WAI/ARIA/apg/patterns/radio/)에서 호스트 접근성 규칙을 확인할 수 있습니다.

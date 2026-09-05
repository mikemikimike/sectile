<!-- scripts/generate-component-pages.mjs에서 생성함. -->
# Quantity Field

정확한 물리량을 입력하고 호환되는 표시 단위로 변환합니다.

## 용법

### 길이 단위

길이를 입력하고 호환되는 표시 단위 사이를 전환합니다.

<ComponentExample component="quantity-field" scenario="length" title="길이 단위" description="길이를 입력하고 호환되는 표시 단위 사이를 전환합니다." :index="0" />

### 온도 단위

물리량은 유지하면서 호환되는 온도 단위로 변환합니다.

<ComponentExample component="quantity-field" scenario="temperature" title="온도 단위" description="물리량은 유지하면서 호환되는 온도 단위로 변환합니다." :index="1" />

### 외부 상태 관리

현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다.

<ComponentExample component="quantity-field" scenario="controlled" title="외부 상태 관리" description="현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다." :index="2" />

## 예시

### 계산식 입력

50-20%를 입력하면 계산 결과인 40으로 확정됩니다.

<ComponentExample component="quantity-field" scenario="calculator" title="계산식 입력" description="50-20%를 입력하면 계산 결과인 40으로 확정됩니다." :index="3" />

### 복합 단위

복합 단위를 해석하면서 하나의 기준 수량을 유지합니다.

<ComponentExample component="quantity-field" scenario="compound" title="복합 단위" description="복합 단위를 해석하면서 하나의 기준 수량을 유지합니다." :index="4" />

## 입력 피드백 스타일 예시

입력값 자체의 이동을 애니메이션하기보다 root의 `:focus-within`을 짧게 전환하면 caret과 IME 동작을 방해하지 않고 현재 편집 위치를 보여줄 수 있습니다.

```css
[data-scope='quantity-field'][data-part='root'] {
  transition: background-color 120ms ease, box-shadow 120ms ease;
}

[data-scope='quantity-field'][data-part='root']:focus-within {
  background: color-mix(in srgb, currentColor 5%, transparent);
  box-shadow: 0 0 0 2px color-mix(in srgb, currentColor 30%, transparent);
}

@media (prefers-reduced-motion: reduce) {
  [data-scope='quantity-field'][data-part='root'] { transition: none; }
}
```

## API 레퍼런스

Prop, event, slot, 공개 type, part selector와 키보드 동작은 [Quantity Field API](/ko/api/components/quantity-field)에서 확인합니다.

## 접근성

이름이 있는 입력이 확정된 수량을 노출하고 단위 선택과 형식화된 출력을 별도로 식별할 수 있게 합니다.

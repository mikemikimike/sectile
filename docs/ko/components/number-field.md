<!-- scripts/generate-component-pages.mjs에서 생성함. -->
# Number Field

문자열 입력을 검증하거나 계산하면서 정확한 십진수를 유지합니다.

## 용법

### 정확한 값 정확한 소수

입력한 십진수 0.1을 정확한 값으로 유지합니다.

<ComponentExample component="number-field" scenario="exact-decimal" title="정확한 값 정확한 소수" description="입력한 십진수 0.1을 정확한 값으로 유지합니다." :index="0" />

### 계산식 입력

50-20%를 입력하면 계산 결과인 40으로 확정됩니다.

<ComponentExample component="number-field" scenario="calculator" title="계산식 입력" description="50-20%를 입력하면 계산 결과인 40으로 확정됩니다." :index="1" />

### 거듭제곱

2^3^2를 입력하면 거듭제곱을 오른쪽부터 계산합니다.

<ComponentExample component="number-field" scenario="exponent" title="거듭제곱" description="2^3^2를 입력하면 거듭제곱을 오른쪽부터 계산합니다." :index="2" />

### 범위 제한

입력값을 설정한 최솟값과 최댓값 범위 안에서 확정합니다.

<ComponentExample component="number-field" scenario="bounded" title="범위 제한" description="입력값을 설정한 최솟값과 최댓값 범위 안에서 확정합니다." :index="3" />

## 입력 피드백 스타일 예시

입력값 자체의 이동을 애니메이션하기보다 root의 `:focus-within`을 짧게 전환하면 caret과 IME 동작을 방해하지 않고 현재 편집 위치를 보여줄 수 있습니다.

```css
[data-scope='number-field'][data-part='root'] {
  transition: background-color 120ms ease, box-shadow 120ms ease;
}

[data-scope='number-field'][data-part='root']:focus-within {
  background: color-mix(in srgb, currentColor 5%, transparent);
  box-shadow: 0 0 0 2px color-mix(in srgb, currentColor 30%, transparent);
}

@media (prefers-reduced-motion: reduce) {
  [data-scope='number-field'][data-part='root'] { transition: none; }
}
```

## API 레퍼런스

Prop, event, slot, 공개 type, part selector와 키보드 동작은 [Number Field API](/ko/api/components/number-field)에서 확인합니다.

## 접근성

이름이 있는 입력은 기본 편집 동작을 유지하며 오류·비활성·읽기 전용 상태를 노출합니다.

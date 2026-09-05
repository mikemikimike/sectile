<!-- scripts/generate-component-pages.mjs에서 생성함. -->
# Meter Group

하나의 정확한 공용 용량을 이름과 순서가 있는 측정값으로 나눠 보여 줍니다.

## 용법

### 공용 용량

하나의 공용 용량을 순서와 이름이 있는 측정값 및 명시적인 잔여 공간으로 나눕니다.

<ComponentExample component="meter-group" scenario="grouped-capacity" title="공용 용량" description="하나의 공용 용량을 순서와 이름이 있는 측정값 및 명시적인 잔여 공간으로 나눕니다." :index="0" />

### 0인 값

값이 0인 항목도 순서를 유지하고 시각적 용량은 0으로 표시합니다.

<ComponentExample component="meter-group" scenario="zero-values" title="0인 값" description="값이 0인 항목도 순서를 유지하고 시각적 용량은 0으로 표시합니다." :index="1" />

### 정확한 소수

입력한 십진수 0.1을 정확한 값으로 유지합니다.

<ComponentExample component="meter-group" scenario="exact-decimal" title="정확한 소수" description="입력한 십진수 0.1을 정확한 값으로 유지합니다." :index="2" />

### 잘못된 입력

정확한 합계가 공용 용량 안에 들어오는 구성을 확정합니다.

<ComponentExample component="meter-group" scenario="invalid-input" title="잘못된 입력" description="정확한 합계가 공용 용량 안에 들어오는 구성을 확정합니다." :index="3" />

## 세그먼트 변화 예시

각 Meter Group item은 자신의 비율을 `--sectile-meter-group-percentage`로 노출합니다. 데이터가 갱신될 때 세그먼트 길이만 짧게 전환할 수 있습니다.

```css
[data-scope='meter-group'][data-part='item'] {
  inline-size: var(--sectile-meter-group-percentage, 0%);
  transition: inline-size 180ms ease-out;
}

@media (prefers-reduced-motion: reduce) {
  [data-scope='meter-group'][data-part='item'] { transition: none; }
}
```

## API 레퍼런스

Prop, event, slot, 공개 type, part selector와 키보드 동작은 [Meter Group API](/ko/api/components/meter-group)에서 확인합니다.

## 접근성

이름이 있는 하나의 그룹 안에 순서와 이름이 있는 읽기 전용 meter를 두며 시각적 트랙과 범례는 같은 집계 의미를 공유합니다.

<!-- scripts/generate-component-pages.mjs에서 생성함. -->
# Meter

정확한 범위 값을 품질 기준과 함께 보여 줍니다.

## 용법

### 임계 구간

명시한 기준값으로 현재 값을 최적·준최적·비최적 구간으로 분류합니다.

<ComponentExample component="meter" scenario="threshold-zones" title="임계 구간" description="명시한 기준값으로 현재 값을 최적·준최적·비최적 구간으로 분류합니다." :index="0" />

### 정확한 소수

입력한 십진수 0.1을 정확한 값으로 유지합니다.

<ComponentExample component="meter" scenario="exact-decimal" title="정확한 소수" description="입력한 십진수 0.1을 정확한 값으로 유지합니다." :index="1" />

### 같은 최솟값과 최댓값

최솟값과 최댓값이 같을 때 유일하게 유효한 값을 표시합니다.

<ComponentExample component="meter" scenario="degenerate-range" title="같은 최솟값과 최댓값" description="최솟값과 최댓값이 같을 때 유일하게 유효한 값을 표시합니다." :index="2" />

## 측정값 표시 예시

Meter indicator는 `--sectile-meter-percentage`를 제공하므로 계산 코드를 CSS에 복제하지 않고 길이를 표현할 수 있습니다.

```css
[data-scope='meter'][data-part='indicator'] {
  inline-size: var(--sectile-meter-percentage, 0%);
  transition: inline-size 180ms ease-out;
}

@media (prefers-reduced-motion: reduce) {
  [data-scope='meter'][data-part='indicator'] { transition: none; }
}
```

## API 레퍼런스

Prop, event, slot, 공개 type, part selector와 키보드 동작은 [Meter API](/ko/api/components/meter)에서 확인합니다.

## 접근성

이름이 있는 읽기 전용 meter가 표준 ARIA 속성으로 최솟값·최댓값·현재 값·형식화된 값을 노출합니다.

[관련 WAI-ARIA 패턴](https://www.w3.org/WAI/ARIA/apg/patterns/meter/)에서 호스트 접근성 규칙을 확인할 수 있습니다.

<!-- scripts/generate-component-pages.mjs에서 생성함. -->
# Multi Thumb Slider

하나의 수치 트랙에서 순서가 있는 여러 값을 조절합니다.

## 용법

### 핸들 두 개로 고르는 범위

핸들 두 개로 범위의 최솟값과 최댓값을 고릅니다.

<ComponentExample component="multi-thumb-slider" scenario="two-thumb-range" title="핸들 두 개로 고르는 범위" description="핸들 두 개로 범위의 최솟값과 최댓값을 고릅니다." :index="0" />

### 핸들 세 개로 나누는 구간

핸들 세 개로 하나의 수치 범위를 의미 있는 구간으로 나눕니다.

<ComponentExample component="multi-thumb-slider" scenario="three-thumb-thresholds" title="핸들 세 개로 나누는 구간" description="핸들 세 개로 하나의 수치 범위를 의미 있는 구간으로 나눕니다." :index="1" />

### 핸들 교차 여러 핸들

설정한 규칙에 따라 핸들 교차를 막거나 값의 순서를 정리합니다.

<ComponentExample component="multi-thumb-slider" scenario="crossing-thumbs" title="핸들 교차 여러 핸들" description="설정한 규칙에 따라 핸들 교차를 막거나 값의 순서를 정리합니다." :index="2" />

### 부모가 관리하는 범위

범위를 이루는 모든 핸들의 값을 부모가 관리합니다.

<ComponentExample component="multi-thumb-slider" scenario="controlled-range" title="부모가 관리하는 범위" description="범위를 이루는 모든 핸들의 값을 부모가 관리합니다." :index="3" />

## 조작 피드백 예시

드래그로 값이 바뀌는 위치 자체에는 transition을 넣지 마세요. 포인터를 늦게 따라가게 됩니다. 대신 focus와 hover 같은 보조 상태만 짧게 전환하면 조작감은 즉시 유지하면서 현재 손잡이를 분명히 보여줄 수 있습니다.

```css
[data-scope='multi-thumb-slider'][data-part='thumb'] {
  transition: box-shadow 120ms ease, scale 120ms ease;
}

[data-scope='multi-thumb-slider'][data-part='thumb']:focus-visible {
  scale: 1.08;
  box-shadow: 0 0 0 3px color-mix(in srgb, currentColor 30%, transparent);
}

@media (prefers-reduced-motion: reduce) {
  [data-scope='multi-thumb-slider'][data-part='thumb'] { transition: none; }
}
```

## API 레퍼런스

Prop, event, slot, 공개 type, part selector와 키보드 동작은 [Multi Thumb Slider API](/ko/api/components/multi-thumb-slider)에서 확인합니다.

## 접근성

각 핸들에 독립적인 이름을 제공하고 최솟값·최댓값·현재 값·방향을 노출합니다.

[관련 WAI-ARIA 패턴](https://www.w3.org/WAI/ARIA/apg/patterns/slider-multithumb/)에서 호스트 접근성 규칙을 확인할 수 있습니다.

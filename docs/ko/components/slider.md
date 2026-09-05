<!-- scripts/generate-component-pages.mjs에서 생성함. -->
# Slider

포인터나 키보드로 일정 간격의 숫자 하나를 조절합니다.

## 용법

### 하나만 선택 값

포인터나 키보드로 하나의 가로 값을 선택합니다.

<ComponentExample component="slider" scenario="single-value" title="하나만 선택 값" description="포인터나 키보드로 하나의 가로 값을 선택합니다." :index="0" />

### 세로 방향 값

포인터나 키보드로 하나의 세로 값을 선택합니다.

<ComponentExample component="slider" scenario="vertical-value" title="세로 방향 값" description="포인터나 키보드로 하나의 세로 값을 선택합니다." :index="1" />

### 부모가 관리하는 값

포인터와 키보드 입력은 변경을 요청하고 실제 슬라이더 값은 부모가 관리합니다.

<ComponentExample component="slider" scenario="controlled-value" title="부모가 관리하는 값" description="포인터와 키보드 입력은 변경을 요청하고 실제 슬라이더 값은 부모가 관리합니다." :index="2" />

## 조작 피드백 예시

드래그로 값이 바뀌는 위치 자체에는 transition을 넣지 마세요. 포인터를 늦게 따라가게 됩니다. 대신 focus와 hover 같은 보조 상태만 짧게 전환하면 조작감은 즉시 유지하면서 현재 손잡이를 분명히 보여줄 수 있습니다.

```css
[data-scope='slider'][data-part='thumb'] {
  transition: box-shadow 120ms ease, scale 120ms ease;
}

[data-scope='slider'][data-part='thumb']:focus-visible {
  scale: 1.08;
  box-shadow: 0 0 0 3px color-mix(in srgb, currentColor 30%, transparent);
}

@media (prefers-reduced-motion: reduce) {
  [data-scope='slider'][data-part='thumb'] { transition: none; }
}
```

## API 레퍼런스

Prop, event, slot, 공개 type, part selector와 키보드 동작은 [Slider API](/ko/api/components/slider)에서 확인합니다.

## 접근성

핸들이 이름, 최솟값, 최댓값, 현재 값, 방향, 상호작용 상태를 노출합니다.

[관련 WAI-ARIA 패턴](https://www.w3.org/WAI/ARIA/apg/patterns/slider/)에서 호스트 접근성 규칙을 확인할 수 있습니다.

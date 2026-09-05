<!-- scripts/generate-component-pages.mjs에서 생성함. -->
# Carousel

이전·다음·직접 이동 제어로 연속된 슬라이드를 탐색합니다.

## 용법

### 순환 이동

마지막 슬라이드 다음에는 첫 슬라이드로, 첫 슬라이드 이전에는 마지막으로 이동합니다.

<ComponentExample component="carousel" scenario="wrapping" title="순환 이동" description="마지막 슬라이드 다음에는 첫 슬라이드로, 첫 슬라이드 이전에는 마지막으로 이동합니다." :index="0" />

### 범위 제한

입력값을 설정한 최솟값과 최댓값 범위 안에서 확정합니다.

<ComponentExample component="carousel" scenario="bounded" title="범위 제한" description="입력값을 설정한 최솟값과 최댓값 범위 안에서 확정합니다." :index="1" />

### 일시 정지

자동 이동을 멈춘 상태에서도 직접 이전·다음 항목으로 이동할 수 있습니다.

<ComponentExample component="carousel" scenario="paused" title="일시 정지" description="자동 이동을 멈춘 상태에서도 직접 이전·다음 항목으로 이동할 수 있습니다." :index="2" />

### 외부 상태 관리

현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다.

<ComponentExample component="carousel" scenario="controlled" title="외부 상태 관리" description="현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다." :index="3" />

## 현재 슬라이드 표시

현재 slide와 indicator는 `data-state="active|inactive"`를 공유하므로 carousel 값을 별도로 복제하지 않고 현재 위치를 표시할 수 있습니다.

```css
[data-scope='carousel'][data-part='indicator'] {
  opacity: .35;
}

[data-scope='carousel'][data-part='indicator'][data-state='active'] {
  opacity: 1;
  background: currentColor;
}
```

## API 레퍼런스

Prop, event, slot, 공개 type, part selector와 키보드 동작은 [Carousel API](/ko/api/components/carousel)에서 확인합니다.

## 접근성

슬라이드, 이동 버튼, 일시 정지 버튼, 표시 항목을 각각 이름이 있고 조작 가능한 요소로 유지합니다.

[관련 WAI-ARIA 패턴](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/)에서 호스트 접근성 규칙을 확인할 수 있습니다.

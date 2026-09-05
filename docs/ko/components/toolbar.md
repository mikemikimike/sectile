<!-- scripts/generate-component-pages.mjs에서 생성함. -->
# Toolbar

관련 작업을 짧은 막대에 모아 이동하고 현재 도구를 실행합니다.

## 용법

### 가로 도구 막대

인라인 텍스트 서식 작업을 자연스러운 가로 순서로 묶습니다.

<ComponentExample component="toolbar" scenario="formatting" title="가로 도구 막대" description="인라인 텍스트 서식 작업을 자연스러운 가로 순서로 묶습니다." :index="0" />

### 세로 도구 막대

편집 화면 옆에 캔버스 도구를 세로로 배치합니다.

<ComponentExample component="toolbar" scenario="vertical" title="세로 도구 막대" description="편집 화면 옆에 캔버스 도구를 세로로 배치합니다." :index="1" />

### 부모가 관리하는 포커스

키보드 이동 규칙은 유지하면서 현재 도구 항목을 부모가 관리합니다.

<ComponentExample component="toolbar" scenario="controlled-focus" title="부모가 관리하는 포커스" description="키보드 이동 규칙은 유지하면서 현재 도구 항목을 부모가 관리합니다." :index="2" />

## 현재 항목 모션 예시

키보드나 포인터로 이동하는 현재 항목은 `data-highlighted`로 표시됩니다. 색상만 바꾸는 대신 작은 위치 변화나 배경 transition을 더하면 현재 탐색 위치를 빠르게 따라갈 수 있습니다.

```css
[data-scope='toolbar'][data-part='item'] {
  transition: background-color 120ms ease, transform 120ms ease;
}

[data-scope='toolbar'][data-part='item'][data-highlighted] {
  transform: translateX(2px);
  background: color-mix(in srgb, currentColor 10%, transparent);
}

@media (prefers-reduced-motion: reduce) {
  [data-scope='toolbar'][data-part='item'] {
    transition: none;
  }
}
```

## API 레퍼런스

Prop, event, slot, 공개 type, part selector와 키보드 동작은 [Toolbar API](/ko/api/components/toolbar)에서 확인합니다.

## 접근성

이름이 있는 도구 막대가 하나의 이동 탭 위치를 사용하고 구분선을 포커스 순서에서 제외합니다.

[관련 WAI-ARIA 패턴](https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/)에서 호스트 접근성 규칙을 확인할 수 있습니다.

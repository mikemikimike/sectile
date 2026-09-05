<!-- scripts/generate-component-pages.mjs에서 생성함. -->
# Window Splitter

키보드로도 조작할 수 있는 구분선으로 인접 영역의 크기를 바꿉니다.

## 용법

### 가로 방향

같은 값과 경계 규칙을 유지하면서 가로 방향으로 조작합니다.

<ComponentExample component="window-splitter" scenario="horizontal" title="가로 방향" description="같은 값과 경계 규칙을 유지하면서 가로 방향으로 조작합니다." :index="0" />

### 세로 방향

같은 크기 규칙을 유지하면서 세로 방향으로 영역을 조절합니다.

<ComponentExample component="window-splitter" scenario="vertical" title="세로 방향" description="같은 크기 규칙을 유지하면서 세로 방향으로 영역을 조절합니다." :index="1" />

### 외부 상태 관리

현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다.

<ComponentExample component="window-splitter" scenario="controlled" title="외부 상태 관리" description="현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다." :index="2" />

## 예시

### 방향 혼합

크기를 조절할 수 있는 사이드바 안쪽에 편집기와 미리보기 영역을 다시 나눕니다.

<ComponentExample component="window-splitter" scenario="nested-layout" title="방향 혼합" description="크기를 조절할 수 있는 사이드바 안쪽에 편집기와 미리보기 영역을 다시 나눕니다." :index="3" />

## 조작 피드백 예시

드래그로 값이 바뀌는 위치 자체에는 transition을 넣지 마세요. 포인터를 늦게 따라가게 됩니다. 대신 focus와 hover 같은 보조 상태만 짧게 전환하면 조작감은 즉시 유지하면서 현재 손잡이를 분명히 보여줄 수 있습니다.

```css
[data-scope='window-splitter'][data-part='handle'] {
  transition: box-shadow 120ms ease, scale 120ms ease;
}

[data-scope='window-splitter'][data-part='handle']:focus-visible {
  scale: 1.08;
  box-shadow: 0 0 0 3px color-mix(in srgb, currentColor 30%, transparent);
}

@media (prefers-reduced-motion: reduce) {
  [data-scope='window-splitter'][data-part='handle'] { transition: none; }
}
```

## API 레퍼런스

Prop, event, slot, 공개 type, part selector와 키보드 동작은 [Window Splitter API](/ko/api/components/window-splitter)에서 확인합니다.

## 접근성

핸들이 구분선 방향과 현재·최소·최대 영역 크기를 노출합니다.

[관련 WAI-ARIA 패턴](https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/)에서 호스트 접근성 규칙을 확인할 수 있습니다.

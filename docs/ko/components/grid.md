<!-- scripts/generate-component-pages.mjs에서 생성함. -->
# Grid

2차원 칸을 이동하고 값을 선택하거나 편집 상태로 들어갑니다.

## 용법

### 선택 가능

격자 사이를 이동하고 현재 칸을 선택합니다.

<ComponentExample component="grid" scenario="selectable" title="선택 가능" description="격자 사이를 이동하고 현재 칸을 선택합니다." :index="0" />

### 비활성 항목 끝에서 처음으로 이동

격자 끝에서도 활성 칸을 따라 이동을 이어 갑니다.

<ComponentExample component="grid" scenario="disabled-wrap" title="비활성 항목 끝에서 처음으로 이동" description="격자 끝에서도 활성 칸을 따라 이동을 이어 갑니다." :index="1" />

### 편집 가능

격자 이동을 유지하면서 현재 칸의 값을 편집합니다.

<ComponentExample component="grid" scenario="editable" title="편집 가능" description="격자 이동을 유지하면서 현재 칸의 값을 편집합니다." :index="2" />

### 외부 상태 관리

현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다.

<ComponentExample component="grid" scenario="controlled" title="외부 상태 관리" description="현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다." :index="3" />

## 선택과 현재 위치 구분

`data-selected`와 `data-highlighted`는 선택된 셀과 현재 키보드 위치를 분리해 보여줍니다. 두 상태를 같은 색으로 합치지 않으면 다중 선택이나 편집 그리드에서도 현재 위치를 잃지 않습니다.

```css
[data-scope='grid'][data-part='cell'][data-selected] {
  background: color-mix(in srgb, currentColor 14%, transparent);
}

[data-scope='grid'][data-part='cell'][data-highlighted] {
  outline: 2px solid currentColor;
  outline-offset: -2px;
}
```

## API 레퍼런스

Prop, event, slot, 공개 type, part selector와 키보드 동작은 [Grid API](/ko/api/components/grid)에서 확인합니다.

## 접근성

이름이 있는 격자가 행과 열 수를 전달하고 각 칸은 위치·선택·비활성 상태를 노출합니다.

[관련 WAI-ARIA 패턴](https://www.w3.org/WAI/ARIA/apg/patterns/grid/)에서 호스트 접근성 규칙을 확인할 수 있습니다.

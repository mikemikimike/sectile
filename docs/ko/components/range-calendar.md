<!-- scripts/generate-component-pages.mjs에서 생성함. -->
# Range Calendar

항상 보이는 달력에서 양 끝을 포함하는 날짜 범위를 고릅니다.

## 용법

### 예약

예약의 시작일과 종료일을 양 끝을 포함하는 범위로 선택합니다.

<ComponentExample component="range-calendar" scenario="booking" title="예약" description="예약의 시작일과 종료일을 양 끝을 포함하는 범위로 선택합니다." :index="0" />

### 범위 제한

입력값을 설정한 최솟값과 최댓값 범위 안에서 확정합니다.

<ComponentExample component="range-calendar" scenario="bounded" title="범위 제한" description="입력값을 설정한 최솟값과 최댓값 범위 안에서 확정합니다." :index="1" />

### 외부 상태 관리

현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다.

<ComponentExample component="range-calendar" scenario="controlled" title="외부 상태 관리" description="현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다." :index="2" />

## 선택 가능 날짜 스타일링

선택 가능 여부와 선택 결과는 calendar cell의 공개 ARIA 상태로 스타일링할 수 있습니다. 비활성 날짜를 별도 배열로 다시 추적하지 않아도 화면 상태가 공개 계약과 일치합니다.

```css
[data-scope='range-calendar'][data-part='cell'][aria-selected='true'] {
  background: CanvasText;
  color: Canvas;
}

[data-scope='range-calendar'][data-part='cell'][aria-disabled='true'] {
  opacity: .45;
  text-decoration: line-through;
}
```

고정된 초기 날짜가 필요한 SSR이나 테스트에서는 API의 `referenceDate`를 지정해 현재 시각에 따라 달력이 달라지지 않게 할 수 있습니다.

## API 레퍼런스

Prop, event, slot, 공개 type, part selector와 키보드 동작은 [Range Calendar API](/ko/api/components/range-calendar)에서 확인합니다.

## 접근성

항상 보이는 격자가 범위의 양 끝과 그 사이 날짜를 화면에 바로 노출합니다.

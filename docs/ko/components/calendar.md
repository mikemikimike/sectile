<!-- scripts/generate-component-pages.mjs에서 생성함. -->
# Calendar

날짜 격자의 활성 날짜를 따라 이동해 날짜를 고릅니다.

## 용법

### 월간 달력

완전한 한 달 격자에서 날짜를 이동하고 선택합니다.

<ComponentExample component="calendar" scenario="month" title="월간 달력" description="완전한 한 달 격자에서 날짜를 이동하고 선택합니다." :index="0" />

### 주간 달력

선택과 날짜 이동 기능을 유지하면서 한 주의 7일만 집중해 봅니다.

<ComponentExample component="calendar" scenario="week" title="주간 달력" description="선택과 날짜 이동 기능을 유지하면서 한 주의 7일만 집중해 봅니다." :index="1" />

### 주말 선택 제한

주말 날짜는 비활성 상태로 표시하고 평일 날짜를 선택합니다.

<ComponentExample component="calendar" scenario="disabled-weekends" title="주말 선택 제한" description="주말 날짜는 비활성 상태로 표시하고 평일 날짜를 선택합니다." :index="2" />

### 외부 상태 관리

현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다.

<ComponentExample component="calendar" scenario="controlled" title="외부 상태 관리" description="현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다." :index="3" />

## 선택 가능 날짜 스타일링

선택 가능 여부와 선택 결과는 calendar cell의 공개 ARIA 상태로 스타일링할 수 있습니다. 비활성 날짜를 별도 배열로 다시 추적하지 않아도 화면 상태가 공개 계약과 일치합니다.

```css
[data-scope='calendar'][data-part='cell'][aria-selected='true'] {
  background: CanvasText;
  color: Canvas;
}

[data-scope='calendar'][data-part='cell'][aria-disabled='true'] {
  opacity: .45;
  text-decoration: line-through;
}
```

고정된 초기 날짜가 필요한 SSR이나 테스트에서는 API의 `referenceDate`를 지정해 현재 시각에 따라 달력이 달라지지 않게 할 수 있습니다.

## API 레퍼런스

Prop, event, slot, 공개 type, part selector와 키보드 동작은 [Calendar API](/ko/api/components/calendar)에서 확인합니다.

## 접근성

인라인 콘텐츠가 이름 있는 격자를 소유하며 각 칸은 선택·강조·선택 불가·현재 달 외부 상태를 노출합니다.

[관련 WAI-ARIA 패턴](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/)에서 호스트 접근성 규칙을 확인할 수 있습니다.

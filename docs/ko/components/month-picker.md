<!-- scripts/generate-component-pages.mjs에서 생성함. -->
# Month Picker

한 해의 월 격자에서 달 하나를 고릅니다.

## 용법

### billing 월간 달력

다음 결제 주기에 사용할 달을 고릅니다.

<ComponentExample component="month-picker" scenario="billing-month" title="billing 월간 달력" description="다음 결제 주기에 사용할 달을 고릅니다." :index="0" />

### fiscal year

연도를 이동하며 현재 회계연도에서 달 하나를 고릅니다.

<ComponentExample component="month-picker" scenario="fiscal-year" title="fiscal year" description="연도를 이동하며 현재 회계연도에서 달 하나를 고릅니다." :index="1" />

### 외부 상태 관리

현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다.

<ComponentExample component="month-picker" scenario="controlled" title="외부 상태 관리" description="현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다." :index="2" />

## Floating 위치

이 컴포넌트는 공통 위치 엔진을 사용합니다. [실시간 위치 예시](/ko/guides/positioning)에서 `side`, `align`, 간격, 충돌 경계, strategy, tracking을 바꾸며 계산 결과를 확인할 수 있습니다.

## 선택 가능 날짜 스타일링

선택 가능 여부와 선택 결과는 calendar cell의 공개 ARIA 상태로 스타일링할 수 있습니다. 비활성 날짜를 별도 배열로 다시 추적하지 않아도 화면 상태가 공개 계약과 일치합니다.

```css
[data-scope='month-picker'][data-part='cell'][aria-selected='true'] {
  background: CanvasText;
  color: Canvas;
}

[data-scope='month-picker'][data-part='cell'][aria-disabled='true'] {
  opacity: .45;
  text-decoration: line-through;
}
```

고정된 초기 날짜가 필요한 SSR이나 테스트에서는 API의 `referenceDate`를 지정해 현재 시각에 따라 달력이 달라지지 않게 할 수 있습니다.

## API 레퍼런스

Prop, event, slot, 공개 type, part selector와 키보드 동작은 [Month Picker API](/ko/api/components/month-picker)에서 확인합니다.

## 접근성

이름이 있는 입력과 실행 요소가 연도 격자를 연결하며 각 칸은 달의 선택·강조·비활성 상태를 노출합니다.

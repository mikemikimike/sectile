<!-- scripts/generate-component-pages.mjs에서 생성함. -->
# Year Range Picker

페이지로 나뉜 연도 격자에서 양 끝을 포함하는 연도 범위를 고릅니다.

## 용법

### roadmap horizon

로드맵에 포함할 첫 해와 마지막 해를 고릅니다.

<ComponentExample component="year-range-picker" scenario="roadmap-horizon" title="roadmap horizon" description="로드맵에 포함할 첫 해와 마지막 해를 고릅니다." :index="0" />

### 범위 제한

입력값을 설정한 최솟값과 최댓값 범위 안에서 확정합니다.

<ComponentExample component="year-range-picker" scenario="bounded" title="범위 제한" description="입력값을 설정한 최솟값과 최댓값 범위 안에서 확정합니다." :index="1" />

### 외부 상태 관리

현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다.

<ComponentExample component="year-range-picker" scenario="controlled" title="외부 상태 관리" description="현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다." :index="2" />

## Floating 위치

이 컴포넌트는 공통 위치 엔진을 사용합니다. [실시간 위치 예시](/ko/guide/positioning)에서 `side`, `align`, 간격, 충돌 경계, strategy, tracking을 바꾸며 계산 결과를 확인할 수 있습니다.

## 선택 가능 날짜 스타일링

선택 가능 여부와 선택 결과는 calendar cell의 공개 ARIA 상태로 스타일링할 수 있습니다. 비활성 날짜를 별도 배열로 다시 추적하지 않아도 화면 상태가 공개 계약과 일치합니다.

```css
[data-scope='year-range-picker'][data-part='cell'][aria-selected='true'] {
  background: CanvasText;
  color: Canvas;
}

[data-scope='year-range-picker'][data-part='cell'][aria-disabled='true'] {
  opacity: .45;
  text-decoration: line-through;
}
```

고정된 초기 날짜가 필요한 SSR이나 테스트에서는 API의 `referenceDate`를 지정해 현재 시각에 따라 달력이 달라지지 않게 할 수 있습니다.

## API 레퍼런스

Prop, event, slot, 공개 type, part selector와 키보드 동작은 [Year Range Picker API](/ko/api/components/year-range-picker)에서 확인합니다.

## 접근성

시작·종료 연도 입력이 페이지형 격자를 공유하고 양 끝을 포함하는 연도 범위를 노출합니다.

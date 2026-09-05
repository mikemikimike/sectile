<!-- scripts/generate-component-pages.mjs에서 생성함. -->
# Tabs

포커스와 실행 방식을 조정하며 같은 단계의 패널을 전환합니다.

## 용법

### 직접 선택

탭 사이에서 포커스만 옮기고 확정할 때 패널을 바꿉니다.

<ComponentExample component="tabs" scenario="manual" title="직접 선택" description="탭 사이에서 포커스만 옮기고 확정할 때 패널을 바꿉니다." :index="0" />

### 자동 전환

자동으로 다음 항목으로 이동하면서 일시 정지와 직접 이동 기능도 제공합니다.

<ComponentExample component="tabs" scenario="automatic" title="자동 전환" description="자동으로 다음 항목으로 이동하면서 일시 정지와 직접 이동 기능도 제공합니다." :index="1" />

### 세로 방향 비활성 항목

활성 작업을 따라 세로로 이동합니다.

<ComponentExample component="tabs" scenario="vertical-disabled" title="세로 방향 비활성 항목" description="활성 작업을 따라 세로로 이동합니다." :index="2" />

## 선택 indicator 모션 예시

선택된 trigger는 `aria-selected="true"`로 드러납니다. pseudo-element를 쓰면 DOM을 더 추가하지 않고 현재 탭이나 단계를 강조할 수 있습니다.

```css
[data-scope='tabs'][data-part='trigger'] {
  position: relative;
}

[data-scope='tabs'][data-part='trigger']::after {
  position: absolute;
  inset-inline: 0;
  inset-block-end: 0;
  block-size: 2px;
  content: '';
  background: currentColor;
  transform: scaleX(0);
  transition: transform 160ms ease;
}

[data-scope='tabs'][data-part='trigger'][aria-selected='true']::after {
  transform: scaleX(1);
}

@media (prefers-reduced-motion: reduce) {
  [data-scope='tabs'][data-part='trigger']::after {
    transition: none;
  }
}
```

## API 레퍼런스

Prop, event, slot, 공개 type, part selector와 키보드 동작은 [Tabs API](/ko/api/components/tabs)에서 확인합니다.

## 접근성

탭 목록이 각 탭을 하나의 탭 패널과 연결하고 선택·비활성·방향 상태를 유지합니다.

[관련 WAI-ARIA 패턴](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)에서 호스트 접근성 규칙을 확인할 수 있습니다.

<!-- scripts/generate-component-pages.mjs에서 생성함. -->
# Navigation Menu

기본 링크와 펼쳐지는 이동 패널을 하나의 막대에 구성합니다.

## 용법

### 제품 이동 메뉴

제품 링크와 하위 메뉴 실행 요소를 하나의 이동 영역에 배치합니다.

<ComponentExample component="navigation-menu" scenario="product" title="제품 이동 메뉴" description="제품 링크와 하위 메뉴 실행 요소를 하나의 이동 영역에 배치합니다." :index="0" />

### 링크 이동

복합 메뉴 실행 요소와 함께 써도 링크의 기본 이동 동작을 유지합니다.

<ComponentExample component="navigation-menu" scenario="links" title="링크 이동" description="복합 메뉴 실행 요소와 함께 써도 링크의 기본 이동 동작을 유지합니다." :index="1" />

### 비활성 항목

비활성 상태에서 키보드와 포인터 입력을 차단합니다.

<ComponentExample component="navigation-menu" scenario="disabled" title="비활성 항목" description="비활성 상태에서 키보드와 포인터 입력을 차단합니다." :index="2" />

## 활성 항목 모션 예시

Navigation Menu 항목의 `data-state="open|closed"`를 밑줄이나 indicator 전환에 연결하면 현재 열린 섹션을 레이아웃 이동 없이 보여줄 수 있습니다.

```css
[data-scope='navigation-menu'][data-part='item'] {
  position: relative;
}

[data-scope='navigation-menu'][data-part='item']::after {
  position: absolute;
  inset-inline: 0;
  inset-block-end: -0.25rem;
  block-size: 2px;
  content: '';
  background: currentColor;
  transform: scaleX(0);
  transform-origin: center;
  transition: transform 160ms ease;
}

[data-scope='navigation-menu'][data-part='item'][data-state='open']::after {
  transform: scaleX(1);
}

@media (prefers-reduced-motion: reduce) {
  [data-scope='navigation-menu'][data-part='item']::after {
    transition: none;
  }
}
```

## API 레퍼런스

Prop, event, slot, 공개 type, part selector와 키보드 동작은 [Navigation Menu API](/ko/api/components/navigation-menu)에서 확인합니다.

## 접근성

기본 링크 의미를 유지하고 펼침 실행 요소가 복합 패널의 열림 상태를 노출합니다.

[관련 WAI-ARIA 패턴](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/)에서 호스트 접근성 규칙을 확인할 수 있습니다.

<!-- scripts/generate-component-pages.mjs에서 생성함. -->
# Menubar

최상위 메뉴 사이를 이동한 뒤 각 명령 계층을 탐색합니다.

## 용법

### 응용 프로그램 메뉴

최상위 응용 프로그램 메뉴 사이를 이동한 뒤 열린 명령 목록으로 들어갑니다.

<ComponentExample component="menubar" scenario="application" title="응용 프로그램 메뉴" description="최상위 응용 프로그램 메뉴 사이를 이동한 뒤 열린 명령 목록으로 들어갑니다." :index="0" />

### 비활성 항목 최상위

활성 최상위 메뉴를 따라 양옆 메뉴 사이를 이동합니다.

<ComponentExample component="menubar" scenario="disabled-root" title="비활성 항목 최상위" description="활성 최상위 메뉴를 따라 양옆 메뉴 사이를 이동합니다." :index="1" />

### 글자 입력으로 이동

입력한 글자로 시작하는 다음 메뉴로 이동합니다.

<ComponentExample component="menubar" scenario="typeahead" title="글자 입력으로 이동" description="입력한 글자로 시작하는 다음 메뉴로 이동합니다." :index="2" />

## 현재 항목 모션 예시

키보드나 포인터로 이동하는 현재 항목은 `data-highlighted`로 표시됩니다. 색상만 바꾸는 대신 작은 위치 변화나 배경 transition을 더하면 현재 탐색 위치를 빠르게 따라갈 수 있습니다.

```css
[data-scope='menubar'][data-part='item'] {
  transition: background-color 120ms ease, transform 120ms ease;
}

[data-scope='menubar'][data-part='item'][data-highlighted] {
  transform: translateX(2px);
  background: color-mix(in srgb, currentColor 10%, transparent);
}

@media (prefers-reduced-motion: reduce) {
  [data-scope='menubar'][data-part='item'] {
    transition: none;
  }
}
```

## API 레퍼런스

Prop, event, slot, 공개 type, part selector와 키보드 동작은 [Menubar API](/ko/api/components/menubar)에서 확인합니다.

## 접근성

루트는 메뉴 막대 의미를 제공하고 열린 가지는 계층형 메뉴 항목과 이동 포커스를 사용합니다.

[관련 WAI-ARIA 패턴](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/)에서 호스트 접근성 규칙을 확인할 수 있습니다.

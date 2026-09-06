<!-- scripts/generate-component-pages.mjs에서 생성함. -->
# Menu

계층형 명령을 이동하고 하위 메뉴를 열어 작업을 실행합니다.

## 용법

### 명령 목록

자주 쓰는 프로젝트 명령을 하나의 단일 메뉴에서 실행합니다.

<ComponentExample component="menu" scenario="commands" title="명령 목록" description="자주 쓰는 프로젝트 명령을 하나의 단일 메뉴에서 실행합니다." :index="0" />

### 비활성 항목

비활성 상태에서 키보드와 포인터 입력을 차단합니다.

<ComponentExample component="menu" scenario="disabled" title="비활성 항목" description="비활성 상태에서 키보드와 포인터 입력을 차단합니다." :index="1" />

### 중첩 하위 메뉴

내보내기 명령이 소유한 하위 메뉴에서 파일 형식을 선택합니다.

<ComponentExample component="menu" scenario="nested" title="중첩 하위 메뉴" description="내보내기 명령이 소유한 하위 메뉴에서 파일 형식을 선택합니다." :index="2" />

## Floating 위치

이 컴포넌트는 공통 위치 엔진을 사용합니다. [실시간 위치 예시](/ko/guides/positioning)에서 `side`, `align`, 간격, 충돌 경계, strategy, tracking을 바꾸며 계산 결과를 확인할 수 있습니다.

## 현재 항목 모션 예시

키보드나 포인터로 이동하는 현재 항목은 `data-highlighted`로 표시됩니다. 색상만 바꾸는 대신 작은 위치 변화나 배경 transition을 더하면 현재 탐색 위치를 빠르게 따라갈 수 있습니다.

```css
[data-scope='menu'][data-part='item'] {
  transition: background-color 120ms ease, transform 120ms ease;
}

[data-scope='menu'][data-part='item'][data-highlighted] {
  transform: translateX(2px);
  background: color-mix(in srgb, currentColor 10%, transparent);
}

@media (prefers-reduced-motion: reduce) {
  [data-scope='menu'][data-part='item'] {
    transition: none;
  }
}
```

## API 레퍼런스

Prop, event, slot, 공개 type, part selector와 키보드 동작은 [Menu API](/ko/api/components/menu)에서 확인합니다.

## 접근성

메뉴 항목, 구분선, 하위 메뉴 상태가 계층형 메뉴 의미와 이동 포커스를 사용합니다.

[관련 WAI-ARIA 패턴](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/)에서 호스트 접근성 규칙을 확인할 수 있습니다.

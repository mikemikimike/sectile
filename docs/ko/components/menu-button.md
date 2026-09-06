<!-- scripts/generate-component-pages.mjs에서 생성함. -->
# Menu Button

하나의 버튼에서 명령 메뉴를 열고 닫을 때 포커스를 복원합니다.

## 용법

### 작업 메뉴

하나의 간결한 버튼에서 작업 공간 리소스를 만들거나 가져옵니다.

<ComponentExample component="menu-button" scenario="actions" title="작업 메뉴" description="하나의 간결한 버튼에서 작업 공간 리소스를 만들거나 가져옵니다." :index="0" />

### 중첩 하위 메뉴

부가 내보내기 형식은 내보내기 하위 메뉴 안에 정리합니다.

<ComponentExample component="menu-button" scenario="nested" title="중첩 하위 메뉴" description="부가 내보내기 형식은 내보내기 하위 메뉴 안에 정리합니다." :index="1" />

### 외부 상태 관리

현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다.

<ComponentExample component="menu-button" scenario="controlled" title="외부 상태 관리" description="현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다." :index="2" />

## Floating 위치

이 컴포넌트는 공통 위치 엔진을 사용합니다. [실시간 위치 예시](/ko/guides/positioning)에서 `side`, `align`, 간격, 충돌 경계, strategy, tracking을 바꾸며 계산 결과를 확인할 수 있습니다.

## 모션 예시

Menu Button 팝업도 공개 `data-state`를 사용하므로 열림과 닫힘을 같은 element에서 표현할 수 있습니다. 선택 항목의 강조와 팝업 모션은 서로 독립적으로 스타일링하세요.

```css
[data-scope='menu-button'][data-part='content'][data-state='open'] {
  animation: menu-button-open 160ms cubic-bezier(.2, .8, .2, 1);
}

[data-scope='menu-button'][data-part='content'][data-state='closed'] {
  animation: menu-button-close 120ms ease-in;
}

@keyframes menu-button-open {
  from { opacity: 0; transform: translateY(-4px) scale(.985); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes menu-button-close {
  from { opacity: 1; transform: translateY(0) scale(1); }
  to { opacity: 0; transform: translateY(-2px) scale(.99); }
}

@media (prefers-reduced-motion: reduce) {
  [data-scope='menu-button'][data-part='content'] { animation: none !important; }
}
```

[공통 모션 원칙 보기](/ko/guides/motion)

## API 레퍼런스

Prop, event, slot, 공개 type, part selector와 키보드 동작은 [Menu Button API](/ko/api/components/menu-button)에서 확인합니다.

## 접근성

실행 요소가 팝업과 열림 상태를 노출하고 열린 내용은 메뉴 의미를 사용한 뒤 닫힐 때 포커스를 돌려줍니다.

[관련 WAI-ARIA 패턴](https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/)에서 호스트 접근성 규칙을 확인할 수 있습니다.

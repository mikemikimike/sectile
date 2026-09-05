<!-- scripts/generate-component-pages.mjs에서 생성함. -->
# Select

실행 요소가 여는 팝업 목록에서 값 하나를 고릅니다.

## 용법

### 실행 환경 선택

팝업 목록에서 하나의 배포 환경을 고릅니다.

<ComponentExample component="select" scenario="environment" title="실행 환경 선택" description="팝업 목록에서 하나의 배포 환경을 고릅니다." :index="0" />

### 비활성 항목 선택 항목

비활성 항목을 표시하고 포커스와 선택은 활성 항목 사이에서 이동합니다.

<ComponentExample component="select" scenario="disabled-option" title="비활성 항목 선택 항목" description="비활성 항목을 표시하고 포커스와 선택은 활성 항목 사이에서 이동합니다." :index="1" />

### 외부 상태 관리

현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다.

<ComponentExample component="select" scenario="controlled" title="외부 상태 관리" description="현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다." :index="2" />

## Floating 위치

이 컴포넌트는 공통 위치 엔진을 사용합니다. [실시간 위치 예시](/ko/guide/positioning)에서 `side`, `align`, 간격, 충돌 경계, strategy, tracking을 바꾸며 계산 결과를 확인할 수 있습니다.

## 모션 예시

`[data-scope='select'][data-part='content']`의 `data-state`를 사용하면 별도 애니메이션 라이브러리 없이 열림과 닫힘을 모두 표현할 수 있습니다. 닫힘 모션 뒤 element를 제거하려면 이 컴포넌트의 `unmountOnExit`을 사용합니다.

```css
[data-scope='select'][data-part='content'][data-state='open'] {
  animation: select-in 180ms cubic-bezier(.2, .8, .2, 1);
}

[data-scope='select'][data-part='content'][data-state='closed'] {
  animation: select-out 140ms ease-in;
}

@keyframes select-in {
  from { opacity: 0; transform: translateY(6px) scale(.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes select-out {
  from { opacity: 1; transform: translateY(0) scale(1); }
  to { opacity: 0; transform: translateY(4px) scale(.985); }
}

@media (prefers-reduced-motion: reduce) {
  [data-scope='select'][data-part='content'] {
    animation: none !important;
  }
}
```

[공통 모션 패턴 보기](/ko/guides/motion)

## API 레퍼런스

Prop, event, slot, 공개 type, part selector와 키보드 동작은 [Select API](/ko/api/components/select)에서 확인합니다.

## 접근성

실행 요소가 포털 목록 상자를 소유하며 DOM 경계를 넘어 현재 항목·선택 항목·비활성 항목 연결을 유지합니다.

[관련 WAI-ARIA 패턴](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/)에서 호스트 접근성 규칙을 확인할 수 있습니다.

<!-- scripts/generate-component-pages.mjs에서 생성함. -->
# Tooltip

키보드 포커스나 마우스 올림으로 짧은 도움말을 표시합니다.

## 용법

### 포커스 마우스 올림

마우스를 올렸을 때와 키보드 포커스를 받았을 때 같은 도움말을 표시합니다.

<ComponentExample component="tooltip" scenario="focus-hover" title="포커스 마우스 올림" description="마우스를 올렸을 때와 키보드 포커스를 받았을 때 같은 도움말을 표시합니다." :index="0" />

### 처음부터 열림 상태

처음부터 열린 도움말을 실행 요소 주변에 겹쳐 표시합니다.

<ComponentExample component="tooltip" scenario="initially-open" title="처음부터 열림 상태" description="처음부터 열린 도움말을 실행 요소 주변에 겹쳐 표시합니다." :index="1" />

### 외부 상태 관리

현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다.

<ComponentExample component="tooltip" scenario="controlled" title="외부 상태 관리" description="현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다." :index="2" />

## Floating 위치

이 컴포넌트는 공통 위치 엔진을 사용합니다. [실시간 위치 예시](/ko/guides/positioning)에서 `side`, `align`, 간격, 충돌 경계, strategy, tracking을 바꾸며 계산 결과를 확인할 수 있습니다.

## 모션 예시

`[data-scope='tooltip'][data-part='content']`의 `data-state`를 사용하면 별도 애니메이션 라이브러리 없이 열림과 닫힘을 모두 표현할 수 있습니다. 닫힘 모션 뒤 element를 제거하려면 이 컴포넌트의 `unmountOnExit`을 사용합니다.

```css
[data-scope='tooltip'][data-part='content'][data-state='open'] {
  animation: tooltip-in 180ms cubic-bezier(.2, .8, .2, 1);
}

[data-scope='tooltip'][data-part='content'][data-state='closed'] {
  animation: tooltip-out 140ms ease-in;
}

@keyframes tooltip-in {
  from { opacity: 0; transform: translateY(6px) scale(.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes tooltip-out {
  from { opacity: 1; transform: translateY(0) scale(1); }
  to { opacity: 0; transform: translateY(4px) scale(.985); }
}

@media (prefers-reduced-motion: reduce) {
  [data-scope='tooltip'][data-part='content'] {
    animation: none !important;
  }
}
```

[공통 모션 패턴 보기](/ko/guides/motion)

## API 레퍼런스

Prop, event, slot, 공개 type, part selector와 키보드 동작은 [Tooltip API](/ko/api/components/tooltip)에서 확인합니다.

## 접근성

도움말을 실행 요소의 설명으로 연결하고 포커스는 실행 요소에 유지합니다.

[관련 WAI-ARIA 패턴](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/)에서 호스트 접근성 규칙을 확인할 수 있습니다.

<!-- scripts/generate-component-pages.mjs에서 생성함. -->
# Cascade Select

계층을 열 단위로 좁혀 가며 마지막 값을 선택합니다.

## 용법

### 지역

국가에서 도시까지 위치를 단계별로 선택합니다.

<ComponentExample component="cascade-select" scenario="location" title="지역" description="국가에서 도시까지 위치를 단계별로 선택합니다." :index="0" />

### 비활성 항목

비활성 상태에서 키보드와 포인터 입력을 차단합니다.

<ComponentExample component="cascade-select" scenario="disabled" title="비활성 항목" description="비활성 상태에서 키보드와 포인터 입력을 차단합니다." :index="1" />

### 외부 상태 관리

현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다.

<ComponentExample component="cascade-select" scenario="controlled" title="외부 상태 관리" description="현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다." :index="2" />

## Floating 위치

이 컴포넌트는 공통 위치 엔진을 사용합니다. [실시간 위치 예시](/ko/guides/positioning)에서 `side`, `align`, 간격, 충돌 경계, strategy, tracking을 바꾸며 계산 결과를 확인할 수 있습니다.

## 모션 예시

`[data-scope='cascade-select'][data-part='content']`의 `data-state`를 사용하면 별도 애니메이션 라이브러리 없이 열림과 닫힘을 모두 표현할 수 있습니다. 닫힘 모션 뒤 element를 제거하려면 이 컴포넌트의 `unmountOnExit`을 사용합니다.

```css
[data-scope='cascade-select'][data-part='content'][data-state='open'] {
  animation: cascade-select-in 180ms cubic-bezier(.2, .8, .2, 1);
}

[data-scope='cascade-select'][data-part='content'][data-state='closed'] {
  animation: cascade-select-out 140ms ease-in;
}

@keyframes cascade-select-in {
  from { opacity: 0; transform: translateY(6px) scale(.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes cascade-select-out {
  from { opacity: 1; transform: translateY(0) scale(1); }
  to { opacity: 0; transform: translateY(4px) scale(.985); }
}

@media (prefers-reduced-motion: reduce) {
  [data-scope='cascade-select'][data-part='content'] {
    animation: none !important;
  }
}
```

[공통 모션 패턴 보기](/ko/guides/motion)

## API 레퍼런스

Prop, event, slot, 공개 type, part selector와 키보드 동작은 [Cascade Select API](/ko/api/components/cascade-select)에서 확인합니다.

## 접근성

각 열은 이름이 있는 목록 상자이며 항목은 선택·하위 가지·비활성 상태를 노출합니다.

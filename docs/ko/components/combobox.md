<!-- scripts/generate-component-pages.mjs에서 생성함. -->
# Combobox

문자열로 항목을 걸러 내고 결과를 이동해 하나를 확정합니다.

## 용법

### 앞부분 검색

현재 검색어로 시작하는 항목만 찾습니다.

<ComponentExample component="combobox" scenario="prefix" title="앞부분 검색" description="현재 검색어로 시작하는 항목만 찾습니다." :index="0" />

### 포함 검색

검색어가 중간에 들어간 항목까지 모두 찾습니다.

<ComponentExample component="combobox" scenario="contains" title="포함 검색" description="검색어가 중간에 들어간 항목까지 모두 찾습니다." :index="1" />

### 외부 상태 관리

현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다.

<ComponentExample component="combobox" scenario="controlled" title="외부 상태 관리" description="현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다." :index="2" />

## 예시

### 한글 조합 입력

한글 조합이 끝날 때까지 조합 중인 문자열과 확정된 검색어를 나눠 관리합니다.

<ComponentExample component="combobox" scenario="ime" title="한글 조합 입력" description="한글 조합이 끝날 때까지 조합 중인 문자열과 확정된 검색어를 나눠 관리합니다." :index="3" />

## Floating 위치

이 컴포넌트는 공통 위치 엔진을 사용합니다. [실시간 위치 예시](/ko/guide/positioning)에서 `side`, `align`, 간격, 충돌 경계, strategy, tracking을 바꾸며 계산 결과를 확인할 수 있습니다.

## 모션 예시

Combobox 팝업도 공개 `data-state`를 사용하므로 열림과 닫힘을 같은 element에서 표현할 수 있습니다. 선택 항목의 강조와 팝업 모션은 서로 독립적으로 스타일링하세요.

```css
[data-scope='combobox'][data-part='content'][data-state='open'] {
  animation: combobox-open 160ms cubic-bezier(.2, .8, .2, 1);
}

[data-scope='combobox'][data-part='content'][data-state='closed'] {
  animation: combobox-close 120ms ease-in;
}

@keyframes combobox-open {
  from { opacity: 0; transform: translateY(-4px) scale(.985); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes combobox-close {
  from { opacity: 1; transform: translateY(0) scale(1); }
  to { opacity: 0; transform: translateY(-2px) scale(.99); }
}

@media (prefers-reduced-motion: reduce) {
  [data-scope='combobox'][data-part='content'] { animation: none !important; }
}
```

[공통 모션 원칙 보기](/ko/guides/motion)

## API 레퍼런스

Prop, event, slot, 공개 type, part selector와 키보드 동작은 [Combobox API](/ko/api/components/combobox)에서 확인합니다.

## 접근성

입력란은 자동 완성·열림·팝업 연결·현재 항목을 노출하고 각 항목은 선택 상태를 노출합니다.

[관련 WAI-ARIA 패턴](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)에서 호스트 접근성 규칙을 확인할 수 있습니다.

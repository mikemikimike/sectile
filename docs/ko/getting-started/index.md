# 시작하기

Sectile은 화면 표현과 상호작용 규칙을 분리합니다. 이 페이지에서는 실행 환경을 설치하고 Checkbox 하나를 동작시키는 데 필요한 최소 구성을 다룹니다.

## 1. 실행 환경 설치하기

Vue 애플리케이션에서는 **Vue**, 브라우저 요소를 직접 다루는 애플리케이션에서는 **DOM**을 사용합니다. 터미널 인터페이스에는 **Terminal**, 별도 렌더러를 만드는 경우에는 **Core**를 사용할 수 있습니다.

<HostInstall />

Vue 애플리케이션에는 `vue`가 필요하며 `@sectile/vue`는 컴포넌트별 공개 가져오기 경로를 제공합니다. 개발, SSR, Node 터미널 연동에는 Node.js 24 이상이 필요합니다.

## 2. 컴포넌트 가져오기

각 컴포넌트는 독립된 공개 가져오기 경로를 가집니다. 아래 예시는 위에서 선택한 실행 환경에 맞는 Checkbox 경로를 보여 줍니다.

<PackageImport component="checkbox" />

## 3. 하나의 예제를 끝까지 실행하기

이 페이지의 설치 명령, 가져오기 코드, 예제 코드는 모두 상단의 **연결 방식** 선택을 따릅니다. 선택한 실행 환경의 코드는 문서 전용 CSS나 숨겨진 마크업에 의존하지 않습니다. Vue는 상태·마크업·스타일을 모두 포함하고, DOM은 연결 대상 HTML과 정리 코드까지 포함합니다. Core와 Terminal은 Node.js 24 이상에서 `main.mjs`로 실행할 수 있습니다.

<GettingStartedCheckboxExample />

Vue 코드는 기존 Vue 프로젝트의 컴포넌트로 사용할 수 있습니다. DOM 코드는 `@sectile/dom/checkbox` 같은 패키지 경로를 해석할 수 있는 Vite 등의 번들러 환경을 전제로 합니다. Core와 Terminal 코드는 위에서 해당 패키지를 설치한 뒤 `node main.mjs`로 실행합니다.

## 4. 제품 스타일 적용하기

컴포넌트는 안정적인 `data-scope`, `data-part`와 상태 속성을 노출합니다. 별도 Sectile 테마 없이 일반 CSS로 스타일링할 수 있습니다.

```css
[data-scope='checkbox'][data-part='root'] {
  display: inline-flex;
  inline-size: 1.25rem;
  block-size: 1.25rem;
  align-items: center;
  justify-content: center;
  border: 1px solid currentColor;
  border-radius: 0.3rem;
}

[data-scope='checkbox'][data-part='root'][data-state='checked'] {
  background: CanvasText;
  color: Canvas;
}
```

재사용 가능한 선택자는 [스타일 적용](/ko/guide/styling)에서, 열림·닫힘·표시자·스와이프 애니메이션은 [모션](/ko/guides/motion)에서 설명합니다.

## 5. 상태를 직접 관리해야 할 때

대부분의 컴포넌트는 내부 상태로 시작할 수 있습니다. 애플리케이션이 기준 상태를 직접 가져야 한다면 각 컴포넌트의 상태 제어 예시에 나온 속성과 이벤트를 사용합니다. 공통 방식은 [상태 제어](/ko/guide/state-ownership)에서 설명합니다.

## 다음으로 볼 곳

- [컴포넌트](/ko/components/) — UI 패턴별로 여러 실행 가능한 변형을 비교합니다.
- [가이드](/ko/guides/) — 스타일, 위치, 폼, 날짜, 가상 목록, 표, 차트 작업을 해결합니다.
- [API](/ko/api/) — 정확한 속성, 이벤트, 슬롯, 타입, 공개 파트, 키보드 동작과 패키지 `export`를 찾습니다.

컴포넌트를 사용하기 위해 Sectile 내부 구조를 먼저 배울 필요는 없습니다.

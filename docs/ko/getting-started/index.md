# 시작하기

Sectile은 제품의 모양을 정하지 않고 접근 가능한 상호작용 동작을 제공합니다. 이미 사용하는 실행 환경에서 컴포넌트 하나를 먼저 동작시킨 뒤 제품 스타일과 모션을 입히면 됩니다.

## 1. 실행 환경을 고르고 설치하기

Vue 애플리케이션이라면 **Vue**를 고릅니다. 브라우저 element를 직접 만드는 경우에는 **DOM**, 터미널 UI나 사용자 정의 렌더링에는 Terminal 또는 Core를 사용합니다.

<HostInstall />

Vue 애플리케이션에는 이미 `vue`가 필요하며, Sectile Vue 패키지는 컴포넌트별 공개 subpath를 제공합니다. 개발, SSR, Node 터미널 연동에는 Node.js 24 이상이 필요합니다.

## 2. 필요한 컴포넌트만 import하기

모든 컴포넌트는 범위가 좁은 공개 subpath를 가집니다. 아래 import 예시는 위에서 고른 실행 환경을 그대로 따릅니다.

<PackageImport component="checkbox" />

## 3. 완전한 예시 실행하기

아래 Checkbox는 작지만 컴포넌트 목록 전체와 같은 예시 시스템을 사용합니다. 예시 프레임에서 실행 환경을 바꾸면 Vue와 DOM 소스를 비교할 수 있고, **Code**를 열어 필요한 버전을 그대로 복사할 수 있습니다.

<ComponentExample component="checkbox" scenario="binary" title="Checkbox" description="레이블과 선택 상태가 보이는 하나의 선택 설정을 전환합니다." :index="0" />

Sectile이 제공하는 것은 동작과 접근성 상태입니다. 예시 CSS는 하나의 표현일 뿐이므로 제품 디자인 시스템으로 바꾸면 됩니다.

## 4. 제품 스타일 적용하기

컴포넌트는 안정적인 `data-scope`, `data-part`, state 속성을 노출합니다. Sectile 테마를 감싸지 않고 일반 CSS로 스타일링할 수 있습니다.

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

재사용할 selector는 [스타일 적용](/ko/guide/styling)에서, 열림·닫힘·indicator·swipe 애니메이션은 [모션](/ko/guides/motion)에서 확인합니다.

## 5. 필요한 경우에만 상태를 직접 제어하기

대부분의 컴포넌트는 초기 상태부터 직접 관리할 수 있습니다. 애플리케이션 상태가 기준값을 소유해야 한다면 각 컴포넌트의 **Controlled** 예시에 나온 prop/event 쌍을 사용합니다. 공통 패턴은 [상태 제어](/ko/guide/state-ownership)에서 설명합니다.

## 다음으로 볼 곳

- [컴포넌트](/ko/components/) — UI 패턴별로 여러 실행 가능한 변형을 비교합니다.
- [가이드](/ko/guides/) — 스타일, 위치, 폼, 날짜, 가상 목록, 표, 차트 작업을 해결합니다.
- [API](/ko/api/) — 정확한 prop, event, slot, type, part, 키보드 동작, package export를 찾습니다.

컴포넌트를 사용하기 위해 Sectile 내부 구조를 먼저 배울 필요는 없습니다.

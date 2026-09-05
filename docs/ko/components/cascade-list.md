<!-- scripts/generate-component-pages.mjs에서 생성함. -->
# Cascade List

계층의 각 단계를 나란히 펼쳐 두고 마지막 항목을 바로 선택합니다.

## 용법

### 지역

지역·국가·도시 열을 한 화면에 펼쳐 두고 목적지를 선택합니다.

<ComponentExample component="cascade-list" scenario="location" title="지역" description="지역·국가·도시 열을 한 화면에 펼쳐 두고 목적지를 선택합니다." :index="0" />

### 비활성 항목

비활성 가지를 계층에 유지하면서 활성 항목 사이를 이동합니다.

<ComponentExample component="cascade-list" scenario="disabled" title="비활성 항목" description="비활성 가지를 계층에 유지하면서 활성 항목 사이를 이동합니다." :index="1" />

### 외부 상태 관리

계층 탐색은 그대로 제공하면서 선택한 목적지는 부모가 관리합니다.

<ComponentExample component="cascade-list" scenario="controlled" title="외부 상태 관리" description="계층 탐색은 그대로 제공하면서 선택한 목적지는 부모가 관리합니다." :index="2" />

### 어떤 화면에 쓰나

Cascade List는 계층의 각 단계를 나란히 펼쳐 둡니다. 지역 필터, 설정 탐색, 여러 조건을 이어서 고르는 화면처럼 앞에서 고른 값과 다음 선택지를 함께 확인해야 할 때 적합합니다. 같은 계층을 좁은 공간에 넣을 때는 Cascade Select의 실행 요소와 팝업 구성을 사용할 수 있습니다.

| 구성 | 화면 배치 | 선택 흐름 |
| --- | --- | --- |
| Cascade List | 열을 페이지 안에 계속 배치 | 가지를 고르면 다음 열이 나타나고 마지막 항목을 고르면 값이 확정됨 |
| Cascade Select | 실행 요소 아래 팝업에 열을 배치 | 팝업 안에서 같은 가지 이동과 마지막 항목 선택을 사용 |

두 컴포넌트는 같은 트리 검증, 현재 항목 이동, 비활성 항목 처리, 값 선택 규칙을 공유합니다. 표현 방식만 화면 목적에 맞게 나뉩니다.

### 상태 관리

가지 이동은 <code>highlightedValue</code>와 <code>path</code>를 바꾸고, 마지막 항목 선택은 <code>modelValue</code>를 확정합니다. <code>defaultValue</code>로 내부 상태를 시작하거나 <code>v-model</code>로 부모가 값을 관리할 수 있습니다. 열은 페이지 안에 유지되므로 Esc 키는 주변 화면의 기본 동작에 그대로 전달됩니다.

## API 레퍼런스

Prop, event, slot, 공개 type, part selector와 키보드 동작은 [Cascade List API](/ko/api/components/cascade-list)에서 확인합니다.

## 접근성

화면에 보이는 계층의 각 단계는 이름이 있는 목록 상자이며 항목은 선택·가지·펼침·비활성 상태를 전달합니다.

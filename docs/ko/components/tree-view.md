<!-- scripts/generate-component-pages.mjs에서 생성함. -->
# Tree View

포커스와 선택을 나눠 유지하면서 펼칠 수 있는 계층을 탐색합니다.

## 용법

### 계층 펼치기

각 폴더의 펼침 상태를 따로 유지하면서 실제 프로젝트 계층을 탐색합니다.

<ComponentExample component="tree-view" scenario="expanded" title="계층 펼치기" description="각 폴더의 펼침 상태를 따로 유지하면서 실제 프로젝트 계층을 탐색합니다." :index="0" />

### 접힌 상태

원본 계층은 유지한 채 하위 항목을 숨겼다가 다시 펼칩니다.

<ComponentExample component="tree-view" scenario="collapsed" title="접힌 상태" description="원본 계층은 유지한 채 하위 항목을 숨겼다가 다시 펼칩니다." :index="1" />

### 여러 항목 선택

폴더 펼침 상태를 유지하면서 검토할 파일 여러 개를 선택합니다.

<ComponentExample component="tree-view" scenario="multiple" title="여러 항목 선택" description="폴더 펼침 상태를 유지하면서 검토할 파일 여러 개를 선택합니다." :index="2" />

### 비활성 항목

비활성화된 항목을 계층에 표시하되 포커스와 선택 대상에서는 제외합니다.

<ComponentExample component="tree-view" scenario="unavailable" title="비활성 항목" description="비활성화된 항목을 계층에 표시하되 포커스와 선택 대상에서는 제외합니다." :index="3" />

### 외부 상태 관리

현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다.

<ComponentExample component="tree-view" scenario="controlled" title="외부 상태 관리" description="현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다." :index="4" />

## 계층 상태 스타일링

Tree View는 선택, 펼침, 현재 키보드 위치를 각각 공개 상태로 유지합니다. 파일 탐색기처럼 이 세 의미를 시각적으로 분리하면 접힌 부모와 선택된 항목을 동시에 이해할 수 있습니다.

```css
[data-scope='tree-view'][data-part='item'][data-expanded] {
  font-weight: 650;
}

[data-scope='tree-view'] [data-highlighted] {
  outline: 2px solid currentColor;
  outline-offset: -2px;
}
```

## API 레퍼런스

Prop, event, slot, 공개 type, part selector와 키보드 동작은 [Tree View API](/ko/api/components/tree-view)에서 확인합니다.

## 접근성

트리 항목이 단계·펼침·선택·비활성 상태를 노출하고 하나의 이동 탭 위치를 사용합니다.

[관련 WAI-ARIA 패턴](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/)에서 호스트 접근성 규칙을 확인할 수 있습니다.

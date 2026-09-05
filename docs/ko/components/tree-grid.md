<!-- scripts/generate-component-pages.mjs에서 생성함. -->
# Tree Grid

계층형 리소스를 정리하고 편집하면서 2차원 격자 이동을 유지합니다.

## 용법

### 행 펼치기

하위 응용 프로그램과 기능이 부모 리소스에 어떻게 연결되는지 프로젝트 목록에서 확인합니다.

<ComponentExample component="tree-grid" scenario="expanded" title="행 펼치기" description="하위 응용 프로그램과 기능이 부모 리소스에 어떻게 연결되는지 프로젝트 목록에서 확인합니다." :index="0" />

### 셀 편집

행과 열의 키보드 이동을 유지하면서 하위 리소스 담당자를 편집합니다.

<ComponentExample component="tree-grid" scenario="editable" title="셀 편집" description="행과 열의 키보드 이동을 유지하면서 하위 리소스 담당자를 편집합니다." :index="1" />

### 외부 상태 관리

현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다.

<ComponentExample component="tree-grid" scenario="controlled" title="외부 상태 관리" description="현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다." :index="2" />

## 계층 상태 스타일링

Tree Grid도 disclosure의 열림 상태와 셀 선택/현재 위치를 분리합니다. 계층 표시와 셀 편집 상태를 하나의 색상으로 합치지 않는 편이 읽기 쉽습니다.

```css
[data-scope='tree-grid'][data-part='disclosure'][data-state='open'] {
  font-weight: 650;
}

[data-scope='tree-grid'] [data-highlighted] {
  outline: 2px solid currentColor;
  outline-offset: -2px;
}
```

## API 레퍼런스

Prop, event, slot, 공개 type, part selector와 키보드 동작은 [Tree Grid API](/ko/api/components/tree-grid)에서 확인합니다.

## 접근성

이름이 있는 격자 안에서 행과 칸이 계층·위치·펼침·선택·편집 상태를 노출합니다.

[관련 WAI-ARIA 패턴](https://www.w3.org/WAI/ARIA/apg/patterns/treegrid/)에서 호스트 접근성 규칙을 확인할 수 있습니다.

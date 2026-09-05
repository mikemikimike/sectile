<!-- scripts/generate-component-pages.mjs에서 생성함. -->
# Tags Input

하나의 입력 필드에서 자유 형식 태그를 만들고 이동하고 지웁니다.

## 용법

### 기술 태그

입력 포커스를 유지하며 기술 태그를 만들거나 지웁니다.

<ComponentExample component="tags-input" scenario="skills" title="기술 태그" description="입력 포커스를 유지하며 기술 태그를 만들거나 지웁니다." :index="0" />

### 개수 제한

기존 값을 유지하면서 설정한 항목 수나 화면 표시 개수를 지킵니다.

<ComponentExample component="tags-input" scenario="limited" title="개수 제한" description="기존 값을 유지하면서 설정한 항목 수나 화면 표시 개수를 지킵니다." :index="1" />

### 외부 상태 관리

현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다.

<ComponentExample component="tags-input" scenario="controlled" title="외부 상태 관리" description="현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다." :index="2" />

## 입력 피드백 스타일 예시

입력값 자체의 이동을 애니메이션하기보다 root의 `:focus-within`을 짧게 전환하면 caret과 IME 동작을 방해하지 않고 현재 편집 위치를 보여줄 수 있습니다.

```css
[data-scope='tags-input'][data-part='root'] {
  transition: background-color 120ms ease, box-shadow 120ms ease;
}

[data-scope='tags-input'][data-part='root']:focus-within {
  background: color-mix(in srgb, currentColor 5%, transparent);
  box-shadow: 0 0 0 2px color-mix(in srgb, currentColor 30%, transparent);
}

@media (prefers-reduced-motion: reduce) {
  [data-scope='tags-input'][data-part='root'] { transition: none; }
}
```

## API 레퍼런스

Prop, event, slot, 공개 type, part selector와 키보드 동작은 [Tags Input API](/ko/api/components/tags-input)에서 확인합니다.

## 접근성

이름이 있는 묶음이 텍스트 입력을 기본 요소로 유지하고 각 태그 삭제 작업에 이름을 제공합니다.

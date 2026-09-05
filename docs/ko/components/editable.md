<!-- scripts/generate-component-pages.mjs에서 생성함. -->
# Editable

인라인 내용을 미리 보기와 검증 가능한 편집 상태로 전환합니다.

## 용법

### 기본 사용

필요한 구성만 사용하고 초깃값은 컴포넌트가 직접 관리합니다.

<ComponentExample component="editable" scenario="basic" title="기본 사용" description="필요한 구성만 사용하고 초깃값은 컴포넌트가 직접 관리합니다." :index="0" />

### 입력 검증

검증을 통과한 편집만 확정하고 마지막 확정값을 유지합니다.

<ComponentExample component="editable" scenario="validated" title="입력 검증" description="검증을 통과한 편집만 확정하고 마지막 확정값을 유지합니다." :index="1" />

### 외부 상태 관리

현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다.

<ComponentExample component="editable" scenario="controlled" title="외부 상태 관리" description="현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다." :index="2" />

## 편집 상태 스타일 예시

Editable root는 `data-state="idle|editing"`을 노출합니다. 편집 모드 진입을 레이아웃 변화가 아니라 outline과 배경 transition으로 보여주면 텍스트 위치가 흔들리지 않습니다.

```css
[data-scope='editable'][data-part='root'] {
  transition: background-color 120ms ease, box-shadow 120ms ease;
}

[data-scope='editable'][data-part='root'][data-state='editing'] {
  background: color-mix(in srgb, currentColor 6%, transparent);
  box-shadow: 0 0 0 2px color-mix(in srgb, currentColor 35%, transparent);
}

@media (prefers-reduced-motion: reduce) {
  [data-scope='editable'][data-part='root'] { transition: none; }
}
```

## API 레퍼런스

Prop, event, slot, 공개 type, part selector와 키보드 동작은 [Editable API](/ko/api/components/editable)에서 확인합니다.

## 접근성

미리보기와 입력 상태를 구분하고 검증 오류는 실제 입력 요소에서 전달합니다.

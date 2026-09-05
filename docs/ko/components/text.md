<!-- scripts/generate-component-pages.mjs에서 생성함. -->
# Text

선택 영역과 한글 조합을 유지하면서 유니코드 문자열을 편집합니다.

## 용법

### 유니코드 선택

사용자가 한 글자로 인식하는 문자 단위로 선택 영역을 이동하고 바꿉니다.

<ComponentExample component="text" scenario="unicode-selection" title="유니코드 선택" description="사용자가 한 글자로 인식하는 문자 단위로 선택 영역을 이동하고 바꿉니다." :index="0" />

### 여러 줄

여러 줄을 편집하면서 선택 영역과 글자 조합 상태를 유지합니다.

<ComponentExample component="text" scenario="multiline" title="여러 줄" description="여러 줄을 편집하면서 선택 영역과 글자 조합 상태를 유지합니다." :index="1" />

### 외부 상태 관리

현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다.

<ComponentExample component="text" scenario="controlled" title="외부 상태 관리" description="현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다." :index="2" />

## 예시

### 부모가 관리하는 IME 입력

부모가 값을 관리하는 입력란에서 한글을 입력한 뒤 마지막 글자를 조합하는 중 Tab을 누릅니다. 마지막 음절이 중복되지 않고 확정값이 한 번만 반영됩니다.

<ComponentExample component="text" scenario="ime-mixed" title="부모가 관리하는 IME 입력" description="부모가 값을 관리하는 입력란에서 한글을 입력한 뒤 마지막 글자를 조합하는 중 Tab을 누릅니다. 마지막 음절이 중복되지 않고 확정값이 한 번만 반영됩니다." :index="3" />

## 입력 피드백 스타일 예시

입력값 자체의 이동을 애니메이션하기보다 root의 `:focus-within`을 짧게 전환하면 caret과 IME 동작을 방해하지 않고 현재 편집 위치를 보여줄 수 있습니다.

```css
[data-scope='text'][data-part='root'] {
  transition: background-color 120ms ease, box-shadow 120ms ease;
}

[data-scope='text'][data-part='root']:focus-within {
  background: color-mix(in srgb, currentColor 5%, transparent);
  box-shadow: 0 0 0 2px color-mix(in srgb, currentColor 30%, transparent);
}

@media (prefers-reduced-motion: reduce) {
  [data-scope='text'][data-part='root'] { transition: none; }
}
```

## API 레퍼런스

Prop, event, slot, 공개 type, part selector와 키보드 동작은 [Text API](/ko/api/components/text)에서 확인합니다.

## 접근성

이름이 있는 입력 또는 여러 줄 입력이 기본 편집·선택·IME·비활성·읽기 전용 의미를 유지합니다.

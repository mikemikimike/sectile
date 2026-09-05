<!-- scripts/generate-component-pages.mjs에서 생성함. -->
# Checkbox Group

하나의 묶음에서 서로 독립된 선택지를 원하는 만큼 고릅니다.

## 용법

### 배포 채널 색상 채널 조절

서로 독립된 배포 채널을 하나 이상 선택합니다.

<ComponentExample component="checkbox-group" scenario="release-channels" title="배포 채널 색상 채널 조절" description="서로 독립된 배포 채널을 하나 이상 선택합니다." :index="0" />

### 비활성 항목 선택 항목

비활성 선택지는 표시 상태를 유지하고 나머지 선택지는 계속 조작할 수 있습니다.

<ComponentExample component="checkbox-group" scenario="disabled-choice" title="비활성 항목 선택 항목" description="비활성 선택지는 표시 상태를 유지하고 나머지 선택지는 계속 조작할 수 있습니다." :index="1" />

### 외부 상태 관리

현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다.

<ComponentExample component="checkbox-group" scenario="controlled" title="외부 상태 관리" description="현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다." :index="2" />

## 선택 상태 모션 예시

Checkbox Group의 각 항목은 Checkbox의 공개 checked 계약을 재사용합니다. 그룹 전체를 움직이기보다 선택된 항목에 짧은 확인 transition을 적용하세요.

```css
[data-scope='checkbox'][data-part='root'] {
  transition: background-color 120ms ease, border-color 120ms ease, transform 120ms ease;
}

[data-scope='checkbox'][data-part='root'][aria-checked='true'] {
  transform: scale(1.025);
  background: color-mix(in srgb, currentColor 12%, transparent);
}

@media (prefers-reduced-motion: reduce) {
  [data-scope='checkbox'][data-part='root'] {
    transition: none;
  }
}
```

## API 레퍼런스

Prop, event, slot, 공개 type, part selector와 키보드 동작은 [Checkbox Group API](/ko/api/components/checkbox-group)에서 확인합니다.

## 접근성

이름이 있는 묶음 안에서 각 항목을 선택·비활성 상태가 있는 독립 체크박스로 유지합니다.

[관련 WAI-ARIA 패턴](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/)에서 호스트 접근성 규칙을 확인할 수 있습니다.

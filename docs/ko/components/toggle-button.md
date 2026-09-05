<!-- scripts/generate-component-pages.mjs에서 생성함. -->
# Toggle Button

같은 작업을 다시 실행할 때까지 눌림 상태를 유지합니다.

## 용법

### 서식

같은 작업을 다시 누를 때까지 서식 기능의 눌림 상태를 유지합니다.

<ComponentExample component="toggle-button" scenario="formatting" title="서식" description="같은 작업을 다시 누를 때까지 서식 기능의 눌림 상태를 유지합니다." :index="0" />

### 경고

알림 감시 기능을 다시 끌 때까지 활성 상태로 유지합니다.

<ComponentExample component="toggle-button" scenario="alert" title="경고" description="알림 감시 기능을 다시 끌 때까지 활성 상태로 유지합니다." :index="1" />

### 외부 상태 관리

현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다.

<ComponentExample component="toggle-button" scenario="controlled" title="외부 상태 관리" description="현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다." :index="2" />

## 선택 상태 모션 예시

선택 상태는 공개 ARIA 또는 state 속성으로 드러납니다. 짧은 색상·크기 transition은 선택 결과를 확인시켜 주면서 키보드 탐색과 독립적으로 유지됩니다.

```css
[data-scope='toggle-button'][data-part='root'] {
  transition: background-color 120ms ease, border-color 120ms ease, transform 120ms ease;
}

[data-scope='toggle-button'][data-part='root'][aria-pressed='true'] {
  transform: scale(1.025);
  background: color-mix(in srgb, currentColor 12%, transparent);
}

@media (prefers-reduced-motion: reduce) {
  [data-scope='toggle-button'][data-part='root'] {
    transition: none;
  }
}
```

## API 레퍼런스

Prop, event, slot, 공개 type, part selector와 키보드 동작은 [Toggle Button API](/ko/api/components/toggle-button)에서 확인합니다.

## 접근성

버튼이 눌림 상태를 노출하고 비활성 동작과 읽기 전용 동작을 구분합니다.

[관련 WAI-ARIA 패턴](https://www.w3.org/WAI/ARIA/apg/patterns/button/)에서 호스트 접근성 규칙을 확인할 수 있습니다.

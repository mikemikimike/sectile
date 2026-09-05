<!-- scripts/generate-component-pages.mjs에서 생성함. -->
# Spin Button

숫자를 직접 입력하거나 증가·감소 버튼으로 바꿉니다.

## 용법

### 정수

정수 입력을 받고 증가·감소 제어 기능을 제공합니다.

<ComponentExample component="spin-button" scenario="integer" title="정수" description="정수 입력을 받고 증가·감소 제어 기능을 제공합니다." :index="0" />

### 외부 상태 관리

현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다.

<ComponentExample component="spin-button" scenario="controlled" title="외부 상태 관리" description="현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다." :index="1" />

## 예시

### 입력 복구

수량을 직접 입력하고 잘못된 값을 입력한 채 벗어나면 마지막으로 확정한 값으로 복구합니다.

<ComponentExample component="spin-button" scenario="invalid-draft" title="입력 복구" description="수량을 직접 입력하고 잘못된 값을 입력한 채 벗어나면 마지막으로 확정한 값으로 복구합니다." :index="2" />

## 입력 피드백 스타일 예시

입력값 자체의 이동을 애니메이션하기보다 root의 `:focus-within`을 짧게 전환하면 caret과 IME 동작을 방해하지 않고 현재 편집 위치를 보여줄 수 있습니다.

```css
[data-scope='spin-button'][data-part='root'] {
  transition: background-color 120ms ease, box-shadow 120ms ease;
}

[data-scope='spin-button'][data-part='root']:focus-within {
  background: color-mix(in srgb, currentColor 5%, transparent);
  box-shadow: 0 0 0 2px color-mix(in srgb, currentColor 30%, transparent);
}

@media (prefers-reduced-motion: reduce) {
  [data-scope='spin-button'][data-part='root'] { transition: none; }
}
```

## API 레퍼런스

Prop, event, slot, 공개 type, part selector와 키보드 동작은 [Spin Button API](/ko/api/components/spin-button)에서 확인합니다.

## 접근성

입력란이 증감 입력 값 정보를 노출하고 증가·감소 요소는 이름이 있는 기본 컨트롤로 유지됩니다.

[관련 WAI-ARIA 패턴](https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/)에서 호스트 접근성 규칙을 확인할 수 있습니다.

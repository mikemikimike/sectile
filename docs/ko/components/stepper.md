<!-- scripts/generate-component-pages.mjs에서 생성함. -->
# Stepper

진행 상태와 사용 가능 조건을 보여 주며 순서가 있는 작업을 안내합니다.

## 용법

### 결제

사용 가능한 결제 단계를 정해진 순서대로 진행합니다.

<ComponentExample component="stepper" scenario="checkout" title="결제" description="사용 가능한 결제 단계를 정해진 순서대로 진행합니다." :index="0" />

### 외부 상태 관리

현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다.

<ComponentExample component="stepper" scenario="controlled" title="외부 상태 관리" description="현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다." :index="1" />

## 예시

### 진행 조건

현재 단계의 완료 조건을 충족하면 다음 단계로 이동합니다.

<ComponentExample component="stepper" scenario="gated-step" title="진행 조건" description="현재 단계의 완료 조건을 충족하면 다음 단계로 이동합니다." :index="2" />

## 선택 indicator 모션 예시

선택된 trigger는 `aria-selected="true"`로 드러납니다. pseudo-element를 쓰면 DOM을 더 추가하지 않고 현재 탭이나 단계를 강조할 수 있습니다.

```css
[data-scope='stepper'][data-part='step'] {
  position: relative;
}

[data-scope='stepper'][data-part='step']::after {
  position: absolute;
  inset-inline: 0;
  inset-block-end: 0;
  block-size: 2px;
  content: '';
  background: currentColor;
  transform: scaleX(0);
  transition: transform 160ms ease;
}

[data-scope='stepper'][data-part='step'][aria-selected='true']::after {
  transform: scaleX(1);
}

@media (prefers-reduced-motion: reduce) {
  [data-scope='stepper'][data-part='step']::after {
    transition: none;
  }
}
```

## API 레퍼런스

Prop, event, slot, 공개 type, part selector와 키보드 동작은 [Stepper API](/ko/api/components/stepper)에서 확인합니다.

## 접근성

순서 있는 단계 목록이 현재 단계를 노출하고 각 단계 실행 요소를 내용 패널과 연결합니다.

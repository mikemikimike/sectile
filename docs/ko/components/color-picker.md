<!-- scripts/generate-component-pages.mjs에서 생성함. -->
# Color Picker

기본 입력, 텍스트, 채널, 색상 영역으로 정확한 색을 편집합니다.

## 용법

### 브라우저 기본 색상 선택기

브라우저 기본 색상 입력과 텍스트 입력이 같은 정확한 색상값을 사용합니다.

<ComponentExample component="color-picker" scenario="native" title="브라우저 기본 색상 선택기" description="브라우저 기본 색상 입력과 텍스트 입력이 같은 정확한 색상값을 사용합니다." :index="0" />

### 투명도

화면에 보이는 색상 채널과 투명도를 함께 조절합니다.

<ComponentExample component="color-picker" scenario="alpha" title="투명도" description="화면에 보이는 색상 채널과 투명도를 함께 조절합니다." :index="1" />

### 외부 상태 관리

현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다.

<ComponentExample component="color-picker" scenario="controlled" title="외부 상태 관리" description="현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다." :index="2" />

## 조작 피드백 예시

드래그로 값이 바뀌는 위치 자체에는 transition을 넣지 마세요. 포인터를 늦게 따라가게 됩니다. 대신 focus와 hover 같은 보조 상태만 짧게 전환하면 조작감은 즉시 유지하면서 현재 손잡이를 분명히 보여줄 수 있습니다.

```css
[data-scope='color-picker'][data-part='area'] {
  transition: box-shadow 120ms ease, scale 120ms ease;
}

[data-scope='color-picker'][data-part='area']:focus-visible {
  scale: 1.08;
  box-shadow: 0 0 0 3px color-mix(in srgb, currentColor 30%, transparent);
}

@media (prefers-reduced-motion: reduce) {
  [data-scope='color-picker'][data-part='area'] { transition: none; }
}
```

## API 레퍼런스

Prop, event, slot, 공개 type, part selector와 키보드 동작은 [Color Picker API](/ko/api/components/color-picker)에서 확인합니다.

## 접근성

텍스트 입력과 슬라이더가 이름, 범위, 현재 값, 색상 채널 역할을 함께 노출합니다.

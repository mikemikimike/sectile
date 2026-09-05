<!-- scripts/generate-component-pages.mjs에서 생성함. -->
# Disclosure

하나의 실행 요소로 선택적인 내용을 펼치고 접습니다.

## 용법

### 닫힌 상태

닫힌 상태에서 시작하고 연결된 실행 요소를 눌렀을 때만 엽니다.

<ComponentExample component="disclosure" scenario="closed" title="닫힌 상태" description="닫힌 상태에서 시작하고 연결된 실행 요소를 눌렀을 때만 엽니다." :index="0" />

### 열림 상태

열린 상태에서 시작해 포커스, 닫힘, 화면 배치를 바로 확인합니다.

<ComponentExample component="disclosure" scenario="open" title="열림 상태" description="열린 상태에서 시작해 포커스, 닫힘, 화면 배치를 바로 확인합니다." :index="1" />

### 외부 상태 관리

현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다.

<ComponentExample component="disclosure" scenario="controlled" title="외부 상태 관리" description="현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다." :index="2" />

## 모션 예시

펼침 자체의 레이아웃을 억지로 움직이기보다 trigger 안의 indicator를 회전시키면 문서 흐름을 안정적으로 유지하면서 상태 변화를 보여줄 수 있습니다.

```vue
<DisclosureTrigger>
  세부 정보
  <span class="motion-chevron" aria-hidden="true">⌄</span>
</DisclosureTrigger>
```

```css
[data-scope='disclosure'][data-part='trigger'] .motion-chevron {
  display: inline-block;
  transition: transform 160ms ease;
}

[data-scope='disclosure'][data-part='trigger'][data-state='open'] .motion-chevron {
  transform: rotate(180deg);
}

@media (prefers-reduced-motion: reduce) {
  [data-scope='disclosure'][data-part='trigger'] .motion-chevron {
    transition: none;
  }
}
```

[모션 가이드에서 공통 원칙 보기](/ko/guides/motion)

## API 레퍼런스

Prop, event, slot, 공개 type, part selector와 키보드 동작은 [Disclosure API](/ko/api/components/disclosure)에서 확인합니다.

## 접근성

실행 요소가 펼침 상태와 연결된 내용의 관계를 노출합니다.

[관련 WAI-ARIA 패턴](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/)에서 호스트 접근성 규칙을 확인할 수 있습니다.

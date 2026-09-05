<!-- scripts/generate-component-pages.mjs에서 생성함. -->
# Accordion

관련 내용을 각각 펼치고 접을 수 있는 여러 영역으로 구성합니다.

## 용법

### 하나만 선택

한 번에 하나의 값만 활성화하고 키보드나 포인터로 이동해 선택합니다.

<ComponentExample component="accordion" scenario="single" title="하나만 선택" description="한 번에 하나의 값만 활성화하고 키보드나 포인터로 이동해 선택합니다." :index="0" />

### 여러 항목 선택

기존 선택을 유지하면서 여러 값을 각각 선택하거나 해제합니다.

<ComponentExample component="accordion" scenario="multiple" title="여러 항목 선택" description="기존 선택을 유지하면서 여러 값을 각각 선택하거나 해제합니다." :index="1" />

### 필수 선택

항상 하나의 값이 선택되거나 하나의 영역이 펼쳐진 상태를 유지합니다.

<ComponentExample component="accordion" scenario="required" title="필수 선택" description="항상 하나의 값이 선택되거나 하나의 영역이 펼쳐진 상태를 유지합니다." :index="2" />

### 외부 상태 관리

현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다.

<ComponentExample component="accordion" scenario="controlled" title="외부 상태 관리" description="현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다." :index="3" />

## 모션 예시

펼침 자체의 레이아웃을 억지로 움직이기보다 trigger 안의 indicator를 회전시키면 문서 흐름을 안정적으로 유지하면서 상태 변화를 보여줄 수 있습니다.

```vue
<AccordionTrigger>
  세부 정보
  <span class="motion-chevron" aria-hidden="true">⌄</span>
</AccordionTrigger>
```

```css
[data-scope='accordion'][data-part='trigger'] .motion-chevron {
  display: inline-block;
  transition: transform 160ms ease;
}

[data-scope='accordion'][data-part='trigger'][data-state='open'] .motion-chevron {
  transform: rotate(180deg);
}

@media (prefers-reduced-motion: reduce) {
  [data-scope='accordion'][data-part='trigger'] .motion-chevron {
    transition: none;
  }
}
```

[모션 가이드에서 공통 원칙 보기](/ko/guides/motion)

## API 레퍼런스

Prop, event, slot, 공개 type, part selector와 키보드 동작은 [Accordion API](/ko/api/components/accordion)에서 확인합니다.

## 접근성

절 실행 요소가 펼침 상태와 연결된 내용 영역을 노출합니다.

[관련 WAI-ARIA 패턴](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/)에서 호스트 접근성 규칙을 확인할 수 있습니다.

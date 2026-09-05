# 모션

Sectile은 애니메이션 런타임이나 시각 테마를 제공하지 않습니다. 대신 공개 state, presence, 방향, gesture hook을 노출하므로 상호작용 계약을 바꾸지 않고 일반 CSS로 모션을 만들 수 있습니다.

모션은 상태가 왜 바뀌었는지 이해하는 데 도움이 될 때 사용합니다. 애니메이션이 꺼져 있어도 최종 열림·닫힘·선택 상태를 분명하게 이해할 수 있어야 합니다.

## 팝업 열림과 닫힘

Dialog, Alert Dialog, Drawer, Popover, Tooltip, Select, Combobox, Menu, Cascade Select, date picker 계열의 팝업 part는 `data-state="open|closed"`를 노출합니다. Presence가 관리하는 팝업 콘텐츠는 유한한 CSS exit animation이 끝날 때까지 유지됩니다. 종료 모션 뒤 DOM에서 제거하고 싶다면 `unmountOnExit`을 사용합니다.

```vue
<DialogRoot :unmount-on-exit="true">
  <DialogTrigger>설정 열기</DialogTrigger>
  <DialogOverlay class="dialog-overlay" />
  <DialogContent class="dialog-content">
    <!-- ... -->
  </DialogContent>
</DialogRoot>
```

```css
.dialog-overlay[data-state='open'] {
  animation: overlay-in 160ms ease-out;
}

.dialog-overlay[data-state='closed'] {
  animation: overlay-out 120ms ease-in;
}

.dialog-content[data-state='open'] {
  animation: dialog-in 180ms cubic-bezier(.2, .8, .2, 1);
}

.dialog-content[data-state='closed'] {
  animation: dialog-out 140ms ease-in;
}

@keyframes overlay-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes overlay-out {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes dialog-in {
  from { opacity: 0; transform: translateY(8px) scale(.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes dialog-out {
  from { opacity: 1; transform: translateY(0) scale(1); }
  to { opacity: 0; transform: translateY(6px) scale(.985); }
}
```

다른 팝업에서도 scope나 class만 바꾸면 같은 패턴을 사용할 수 있습니다. 상호작용은 Sectile part가 담당하고 CSS는 표현만 바꿉니다.

## 펼침 상태 표시

Accordion과 Disclosure에서는 전체 문서 흐름의 높이를 억지로 애니메이션하기보다 작은 indicator 회전으로 상태 변화를 보여주는 편이 안정적입니다. `data-state`는 공개된 열림/닫힘 상태를 반영합니다.

```css
[data-scope='accordion'][data-part='trigger'] .chevron {
  transition: transform 160ms ease;
}

[data-scope='accordion'][data-part='trigger'][data-state='open'] .chevron {
  transform: rotate(180deg);
}
```

레이아웃은 그대로 유지하면서 펼침 상태 변화를 분명하게 보여줄 수 있습니다.

## 선택과 checked 상태

checked, selected, active, pressed 컨트롤은 관련 part에 상태 속성을 노출합니다. 색과 형태 변화에는 transition을 사용하고, 의미 있는 확인 효과가 필요할 때만 keyframe을 추가합니다.

```css
[data-scope='checkbox'][data-part='root'] {
  transition:
    background-color 120ms ease,
    border-color 120ms ease,
    transform 120ms ease;
}

[data-scope='checkbox'][data-part='root'][data-state='checked'] {
  transform: scale(1.04);
}

[data-scope='checkbox'][data-part='indicator'][data-state='checked'] {
  animation: check-in 140ms cubic-bezier(.2, .8, .2, 1);
}

@keyframes check-in {
  from { opacity: 0; transform: scale(.65); }
  to { opacity: 1; transform: scale(1); }
}
```

Tabs, Navigation Menu, Radio Group, Toggle Group, Listbox도 각 API에 문서화된 상태 속성을 기준으로 같은 원칙을 적용할 수 있습니다.

## Drawer swipe 모션

Drawer는 현재 swipe 이동량을 CSS custom property로 제공하고 gesture 단계를 `data-swipe`로 노출합니다. 드래그 중에는 포인터 이동을 즉시 반영하고, 취소나 종료에서만 transition을 적용합니다.

```css
[data-scope='drawer'][data-part='content'] {
  transform: translate(
    var(--sectile-drawer-swipe-movement-x, 0px),
    var(--sectile-drawer-swipe-movement-y, 0px)
  );
}

[data-scope='drawer'][data-part='content'][data-swipe='move'] {
  transition: none;
}

[data-scope='drawer'][data-part='content'][data-swipe='cancel'],
[data-scope='drawer'][data-part='content'][data-swipe='end'] {
  transition: transform 180ms cubic-bezier(.2, .8, .2, 1);
}
```

`--sectile-drawer-swipe-progress`도 제공되므로 opacity, backdrop 강도 같은 시각 효과를 gesture 진행도에 맞출 수 있습니다.

## 모션 줄이기

모든 모션 예시에는 움직임이 없는 경로가 있어야 합니다. 사용자가 reduced motion을 요청했다면 단순히 시간을 조금 줄이는 대신 불필요한 transition과 keyframe을 제거합니다.

```css
@media (prefers-reduced-motion: reduce) {
  .dialog-overlay,
  .dialog-content,
  [data-scope='accordion'][data-part='trigger'] .chevron,
  [data-scope='checkbox'][data-part='root'],
  [data-scope='checkbox'][data-part='indicator'],
  [data-scope='drawer'][data-part='content'] {
    animation: none !important;
    transition: none !important;
  }
}
```

모션이 없어도 컴포넌트의 상태와 접근성 의미는 그대로 유지됩니다.

## 컴포넌트별 예시

이 패턴은 각 컴포넌트 페이지의 실행 가능한 예시에서 더 구체적으로 사용합니다. [Dialog](/ko/components/dialog), [Drawer](/ko/components/drawer), [Accordion](/ko/components/accordion), [Checkbox](/ko/components/checkbox), [Toast](/ko/components/toast)부터 보고, 다른 컴포넌트의 정확한 공개 part와 속성은 [컴포넌트 API](/ko/api/components/)에서 확인하세요.

<!-- scripts/generate-component-pages.mjs에서 생성함. -->
# Drawer

화면 가장자리에서 내용을 열고 바깥 방향 스와이프로 닫습니다.

## 용법

### bottom

아래쪽 가장자리에서 모달 화면을 열고 핸들을 아래로 끌어 닫습니다.

<ComponentExample component="drawer" scenario="bottom" title="bottom" description="아래쪽 가장자리에서 모달 화면을 열고 핸들을 아래로 끌어 닫습니다." :index="0" />

### side

같은 드로어 계약을 화면의 가로 가장자리에서 엽니다.

<ComponentExample component="drawer" scenario="side" title="side" description="같은 드로어 계약을 화면의 가로 가장자리에서 엽니다." :index="1" />

### 외부 상태 관리

현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다.

<ComponentExample component="drawer" scenario="controlled" title="외부 상태 관리" description="현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다." :index="2" />

## 외부 조작

`closeOnInteractOutside`로 콘텐츠 밖의 포인터 조작이 컴포넌트를 닫을지 정합니다. `interactOutsideExclusions`에 넣은 요소는 모달에서도 계속 조작할 수 있으며 외부 조작 판정에서 제외됩니다. 조건부로 유지하려면 `interact-outside` 이벤트에서 `preventDefault()`를 호출합니다.

```vue
<DrawerRoot
  :interact-outside-exclusions="[ignoredElement]"
  @interact-outside="(event) => {
    if (event.isInside(temporarilyIgnoredElement)) event.preventDefault()
  }"
/>
```

## 스와이프 동작

`DrawerHandle`을 드로어의 바깥 방향으로 끌면 닫힙니다. 폼 컨트롤처럼 드래그를 시작하면 안 되는 하위 요소에는 `data-sectile-drawer-swipe-ignore`를 지정합니다. `data-swipe="move|cancel|end"`, `data-swiping`, `--sectile-drawer-swipe-movement-x`, `--sectile-drawer-swipe-movement-y`, `--sectile-drawer-swipe-progress`로 이동과 종료 애니메이션을 스타일링할 수 있습니다.

## 모션 예시

Drawer는 드래그 중 이동량과 gesture 단계를 공개 CSS hook으로 제공합니다. 포인터를 따라가는 동안 transition을 끄고, 취소나 종료에서만 transform을 부드럽게 정리합니다.

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

@media (prefers-reduced-motion: reduce) {
  [data-scope='drawer'][data-part='content'] {
    transition: none !important;
  }
}
```

[팝업 enter/exit 패턴도 보기](/ko/guides/motion)

## API 레퍼런스

Prop, event, slot, 공개 type, part selector와 키보드 동작은 [Drawer API](/ko/api/components/drawer)에서 확인합니다.

## 접근성

드로어는 모달 대화상자 의미를 따르고 가장자리와 스와이프 방향을 노출하며 제스처 핸들은 보조 기술에서 숨깁니다.

[관련 WAI-ARIA 패턴](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)에서 호스트 접근성 규칙을 확인할 수 있습니다.

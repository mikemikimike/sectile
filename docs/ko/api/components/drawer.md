---
title: Drawer API
description: 화면 가장자리에서 내용을 열고 바깥 방향 스와이프로 닫습니다.
---
<!-- scripts/generate-component-pages.mjs에서 생성함. -->
# Drawer API

화면 가장자리에서 내용을 열고 바깥 방향 스와이프로 닫습니다.

이 페이지는 정확한 공개 계약을 찾기 위한 레퍼런스입니다. 실제 구성과 스타일링은 사용 예시에서 시작하세요.

[Drawer 사용 예시로 돌아가기](/ko/components/drawer)

## Vue API

Vue 패키지: `@sectile/vue/drawer`

<div class="component-api-group">
<strong class="component-api-label">컴포넌트</strong>
<ul class="component-api-list">
  <li><code class="component-api-token">DrawerRoot</code></li>
  <li><code class="component-api-token">DrawerTrigger</code></li>
  <li><code class="component-api-token">DrawerPortal</code></li>
  <li><code class="component-api-token">DrawerOverlay</code></li>
  <li><code class="component-api-token">DrawerContent</code></li>
  <li><code class="component-api-token">DrawerHandle</code></li>
  <li><code class="component-api-token">DrawerTitle</code></li>
  <li><code class="component-api-token">DrawerDescription</code></li>
  <li><code class="component-api-token">DrawerClose</code></li>
</ul>
</div>

### Props

#### `DrawerRootProps`

<dl class="component-api-definitions component-api-definitions--props">
<div class="component-api-definition">
<dt><code>autoFocus</code></dt>
<dd>
<div class="component-api-definition__metadata"><span><span class="component-api-definition__label">타입</span><code>boolean</code></span><span><span class="component-api-definition__label">기본값</span><code>true</code></span></div>
<p>열릴 때 컴포넌트 안으로 포커스를 옮길지 여부입니다.</p>
</dd>
</div>
<div class="component-api-definition">
<dt><code>closeOnInteractOutside</code></dt>
<dd>
<div class="component-api-definition__metadata"><span><span class="component-api-definition__label">타입</span><code>boolean</code></span><span><span class="component-api-definition__label">기본값</span><code>true</code></span></div>
<p>콘텐츠 밖을 조작하면 닫을지 여부입니다.</p>
</dd>
</div>
<div class="component-api-definition">
<dt><code>defaultOpen</code></dt>
<dd>
<div class="component-api-definition__metadata"><span><span class="component-api-definition__label">타입</span><code>boolean</code></span><span><span class="component-api-definition__label">기본값</span><code>false</code></span></div>
<p>컴포넌트가 관리하는 초기 열림 상태입니다.</p>
</dd>
</div>
<div class="component-api-definition">
<dt><code>disabled</code></dt>
<dd>
<div class="component-api-definition__metadata"><span><span class="component-api-definition__label">타입</span><code>boolean</code></span><span><span class="component-api-definition__label">기본값</span><code>false</code></span></div>
<p>사용자 조작을 막을지 여부입니다.</p>
</dd>
</div>
<div class="component-api-definition">
<dt><code>initialFocus</code></dt>
<dd>
<div class="component-api-definition__metadata"><span><span class="component-api-definition__label">타입</span><code>HTMLElement</code></span><span><span class="component-api-definition__label">기본값</span><code>undefined</code></span></div>
<p>컴포넌트가 열릴 때 포커스를 받을 요소 또는 요소를 반환하는 함수입니다.</p>
</dd>
</div>
<div class="component-api-definition">
<dt><code>interactOutsideExclusions</code></dt>
<dd>
<div class="component-api-definition__metadata"><span><span class="component-api-definition__label">타입</span><code>readonly HTMLElement[]</code></span><span><span class="component-api-definition__label">기본값</span><code>undefined</code></span></div>
<p>계속 조작할 수 있는 외부 조작 판정 제외 요소 목록입니다.</p>
</dd>
</div>
<div class="component-api-definition">
<dt><code>label</code></dt>
<dd>
<div class="component-api-definition__metadata"><span><span class="component-api-definition__label">타입</span><code>string</code></span><span><span class="component-api-definition__label">기본값</span><code>undefined</code></span></div>
<p>보조 기술이 읽는 컨트롤 이름입니다.</p>
</dd>
</div>
<div class="component-api-definition">
<dt><code>modal</code></dt>
<dd>
<div class="component-api-definition__metadata"><span><span class="component-api-definition__label">타입</span><code>boolean</code></span><span><span class="component-api-definition__label">기본값</span><code>true</code></span></div>
<p>열린 콘텐츠가 주변 페이지 조작을 막을지 여부입니다.</p>
</dd>
</div>
<div class="component-api-definition">
<dt><code>open</code></dt>
<dd>
<div class="component-api-definition__metadata"><span><span class="component-api-definition__label">타입</span><code>boolean</code></span><span><span class="component-api-definition__label">기본값</span><code>undefined</code></span></div>
<p>연결된 팝업이나 펼침 영역이 열려 있는지 여부입니다.</p>
</dd>
</div>
<div class="component-api-definition">
<dt><code>restoreFocus</code></dt>
<dd>
<div class="component-api-definition__metadata"><span><span class="component-api-definition__label">타입</span><code>boolean</code></span><span><span class="component-api-definition__label">기본값</span><code>true</code></span></div>
<p>열린 콘텐츠를 닫을 때 실행 요소로 포커스를 되돌릴지 여부입니다.</p>
</dd>
</div>
<div class="component-api-definition">
<dt><code>side</code></dt>
<dd>
<div class="component-api-definition__metadata"><span><span class="component-api-definition__label">타입</span><code>DrawerSide</code></span><span><span class="component-api-definition__label">기본값</span><code>'bottom'</code></span></div>
<p>드로어가 열릴 화면 가장자리입니다.</p>
</dd>
</div>
<div class="component-api-definition">
<dt><code>swipeThreshold</code></dt>
<dd>
<div class="component-api-definition__metadata"><span><span class="component-api-definition__label">타입</span><code>number</code></span><span><span class="component-api-definition__label">기본값</span><code>80</code></span></div>
<p>밀어서 닫을 때 필요한 포인터 이동 거리(픽셀)입니다.</p>
</dd>
</div>
<div class="component-api-definition">
<dt><code>swipeToDismiss</code></dt>
<dd>
<div class="component-api-definition__metadata"><span><span class="component-api-definition__label">타입</span><code>boolean</code></span><span><span class="component-api-definition__label">기본값</span><code>true</code></span></div>
<p>바깥 방향 포인터 스와이프로 드로어를 닫을지 여부입니다.</p>
</dd>
</div>
<div class="component-api-definition">
<dt><code>swipeVelocityThreshold</code></dt>
<dd>
<div class="component-api-definition__metadata"><span><span class="component-api-definition__label">타입</span><code>number</code></span><span><span class="component-api-definition__label">기본값</span><code>0.5</code></span></div>
<p>드로어를 닫는 바깥 방향 드래그 속도 기준값(px/ms)입니다.</p>
</dd>
</div>
<div class="component-api-definition">
<dt><code>trapFocus</code></dt>
<dd>
<div class="component-api-definition__metadata"><span><span class="component-api-definition__label">타입</span><code>boolean</code></span><span><span class="component-api-definition__label">기본값</span><code>true</code></span></div>
<p>열린 콘텐츠 안에 키보드 포커스를 유지할지 여부입니다.</p>
</dd>
</div>
<div class="component-api-definition">
<dt><code>unmountOnExit</code></dt>
<dd>
<div class="component-api-definition__metadata"><span><span class="component-api-definition__label">타입</span><code>boolean</code></span><span><span class="component-api-definition__label">기본값</span><code>false</code></span></div>
<p>닫힘 모션이 끝난 뒤 presence 관리 콘텐츠를 DOM에서 제거할지 여부입니다.</p>
</dd>
</div>
</dl>

#### `DrawerPartProps`

<dl class="component-api-definitions component-api-definitions--props">
<div class="component-api-definition">
<dt><code>as</code></dt>
<dd>
<div class="component-api-definition__metadata"><span><span class="component-api-definition__label">타입</span><code>PrimitiveAs</code></span><span><span class="component-api-definition__label">기본값</span>파트별로 다름</span></div>
<p>이 파트가 렌더링할 요소 또는 컴포넌트입니다.</p>
</dd>
</div>
<div class="component-api-definition">
<dt><code>asChild</code></dt>
<dd>
<div class="component-api-definition__metadata"><span><span class="component-api-definition__label">타입</span><code>boolean</code></span><span><span class="component-api-definition__label">기본값</span><code>false</code></span></div>
<p>하나뿐인 자식 요소에 파트 속성을 직접 합칠지 여부입니다.</p>
</dd>
</div>
</dl>

#### `DrawerPortalProps`

<dl class="component-api-definitions component-api-definitions--props">
<div class="component-api-definition">
<dt><code>defer</code></dt>
<dd>
<div class="component-api-definition__metadata"><span><span class="component-api-definition__label">타입</span><code>boolean</code></span><span><span class="component-api-definition__label">기본값</span><code>false</code></span></div>
<p>Teleport 대상을 현재 mount 또는 update tick이 끝날 때 찾을지 여부입니다.</p>
</dd>
</div>
<div class="component-api-definition">
<dt><code>disabled</code></dt>
<dd>
<div class="component-api-definition__metadata"><span><span class="component-api-definition__label">타입</span><code>boolean</code></span><span><span class="component-api-definition__label">기본값</span><code>false</code></span></div>
<p>사용자 조작을 막을지 여부입니다.</p>
</dd>
</div>
<div class="component-api-definition">
<dt><code>to</code></dt>
<dd>
<div class="component-api-definition__metadata"><span><span class="component-api-definition__label">타입</span><code>string | HTMLElement</code></span><span><span class="component-api-definition__label">기본값</span><code>'body'</code></span></div>
<p>포털 콘텐츠를 옮길 대상입니다.</p>
</dd>
</div>
</dl>

### 슬롯

#### `DrawerRootSlotProps`

<dl class="component-api-definitions component-api-definitions--slots">
<div class="component-api-definition">
<dt><code>disabled</code></dt>
<dd>
<div class="component-api-definition__metadata"><span><span class="component-api-definition__label">타입</span><code>boolean</code></span></div>
<p>사용자 조작을 막을지 여부입니다.</p>
</dd>
</div>
<div class="component-api-definition">
<dt><code>open</code></dt>
<dd>
<div class="component-api-definition__metadata"><span><span class="component-api-definition__label">타입</span><code>boolean</code></span></div>
<p>연결된 팝업이나 펼침 영역이 열려 있는지 여부입니다.</p>
</dd>
</div>
</dl>

### 기타 타입

#### `DrawerOpenChangeHandler`

```ts
type DrawerOpenChangeHandler = PopupFactoryOptions['onOpenChange']
```

#### `DrawerInteractOutsideHandler`

```ts
type DrawerInteractOutsideHandler = NonNullable<PopupFactoryOptions['onInteractOutside']>
```

#### `DrawerSide`

```ts
type DrawerSide = 'top' | 'right' | 'bottom' | 'left'
```

## 파트

공통 범위: <code class="component-scope-token">[data-scope="drawer"]</code>. 컴포넌트 내부로 스타일을 제한할 때 파트 선택자와 함께 사용합니다.

<div class="component-parts-table">
<table>
<thead>
<tr><th scope="col">파트</th><th scope="col">선택자</th><th scope="col">역할</th><th scope="col">추가 속성</th></tr>
</thead>
<tbody>
<tr>
  <td><code class="component-part-token">trigger</code></td>
  <td><code>[data-part="trigger"]</code></td>
  <td>연결된 콘텐츠를 열고 닫거나 활성화합니다.</td>
  <td><span aria-label="None">—</span></td>
</tr>
<tr>
  <td><code class="component-part-token">overlay</code></td>
  <td><code>[data-part="overlay"]</code></td>
  <td>모달이 열린 동안 주변 콘텐츠를 덮습니다.</td>
  <td><span aria-label="None">—</span></td>
</tr>
<tr>
  <td><code class="component-part-token">content</code></td>
  <td><code>[data-part="content"]</code></td>
  <td>현재 상태에 맞는 컴포넌트 콘텐츠를 담습니다.</td>
  <td><span aria-label="None">—</span></td>
</tr>
<tr>
  <td><code class="component-part-token">handle</code></td>
  <td><code>[data-part="handle"]</code></td>
  <td>바깥 방향 스와이프로 닫는 조작 영역을 제공합니다.</td>
  <td><code>aria-hidden="true"</code></td>
</tr>
<tr>
  <td><code class="component-part-token">title</code></td>
  <td><code>[data-part="title"]</code></td>
  <td>연결된 콘텐츠의 제목을 표시합니다.</td>
  <td><span aria-label="None">—</span></td>
</tr>
<tr>
  <td><code class="component-part-token">description</code></td>
  <td><code>[data-part="description"]</code></td>
  <td>연결된 콘텐츠나 결정 내용을 설명합니다.</td>
  <td><span aria-label="None">—</span></td>
</tr>
<tr>
  <td><code class="component-part-token">close</code></td>
  <td><code>[data-part="close"]</code></td>
  <td>현재 화면을 닫거나 해제합니다.</td>
  <td><span aria-label="None">—</span></td>
</tr>
</tbody>
</table>
</div>

## 키보드 동작

| 키 | 동작 |
| --- | --- |
| <kbd>Enter</kbd> / <kbd>Space</kbd> | 실행 요소나 포커스된 작업을 실행합니다. |
| <kbd>Tab</kbd> / <kbd>Shift+Tab</kbd> | 모달 포커스를 내부에 유지하며 컨트롤 사이를 이동합니다. |
| <kbd>Escape</kbd> | 드로어를 닫고 설정된 경우 포커스를 복원합니다. |
| <kbd>Pointer swipe</kbd> | 핸들을 바깥 방향으로 거리 또는 속도 기준 이상 밀어 닫습니다. |

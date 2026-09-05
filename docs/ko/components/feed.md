<!-- scripts/generate-component-pages.mjs에서 생성함. -->
# Feed

읽던 위치를 유지하며 새 활동이나 이전 기록을 불러오는 제품 활동 목록을 제공합니다.

## 용법

### 유한 피드

하나의 릴리스에서 발생한 전체 활동 기록을 확인합니다.

<ComponentExample component="feed" scenario="finite" title="유한 피드" description="하나의 릴리스에서 발생한 전체 활동 기록을 확인합니다." :index="0" />

## 예시

### 새 항목 불러오기

읽던 위치를 유지하면서 새 배포 활동을 불러옵니다.

<ComponentExample component="feed" scenario="load-after" title="새 항목 불러오기" description="읽던 위치를 유지하면서 새 배포 활동을 불러옵니다." :index="1" />

### 이전 항목 불러오기

현재 활동 순서를 유지하면서 이전 릴리스 기록을 이어 붙입니다.

<ComponentExample component="feed" scenario="load-before" title="이전 항목 불러오기" description="현재 활동 순서를 유지하면서 이전 릴리스 기록을 이어 붙입니다." :index="2" />

## 비동기 feed window 연결

`requestWindow`에는 요청 방향과 anchor, revision, request generation이 함께 옵니다. 비동기 응답을 적용할 때 generation을 그대로 돌려주면 오래된 응답과 최신 window 요청을 구분할 수 있습니다.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import {
  FeedRoot,
  FeedItem,
  FeedLoadEarlier,
  FeedLoadNewer,
  type FeedDirection,
} from '@sectile/vue/feed'

const items = ref<Array<{ id: string; title: string }>>([])
const revision = ref(0)
const resolvedGeneration = ref<number>()

async function loadWindow(
  direction: FeedDirection,
  anchor: string | null,
  _revision: number,
  generation: number,
) {
  const query = new URLSearchParams({ direction, anchor: anchor ?? '' })
  const response = await fetch('/api/activity?' + query).then(r => r.json())
  items.value = response.items
  resolvedGeneration.value = generation
  revision.value += 1
}
</script>

<template>
  <FeedRoot
    :items="items.map(item => item.id)"
    :revision="revision"
    :request-generation="resolvedGeneration"
    @request-window="loadWindow"
  >
    <FeedLoadEarlier>Load earlier</FeedLoadEarlier>
    <FeedItem v-for="item in items" :key="item.id" :value="item.id">
      {{ item.title }}
    </FeedItem>
    <FeedLoadNewer>Load newer</FeedLoadNewer>
  </FeedRoot>
</template>
```

기존 실행 예시의 **Load earlier / Load newer** 변형에서 요청 중 상태와 읽기 위치 유지까지 함께 확인할 수 있습니다.

## API 레퍼런스

Prop, event, slot, 공개 type, part selector와 키보드 동작은 [Feed API](/ko/api/components/feed)에서 확인합니다.

## 접근성

루트는 피드 의미를 사용하며 각 항목은 선택적인 위치와 전체 크기 정보가 있는 글로 노출됩니다.

[관련 WAI-ARIA 패턴](https://www.w3.org/WAI/ARIA/apg/patterns/feed/)에서 호스트 접근성 규칙을 확인할 수 있습니다.

<!-- scripts/generate-component-pages.mjs에서 생성함. -->
# Pagination

큰 결과 목록을 직접 이동 가능한 페이지와 경계 버튼으로 줄여 보여 줍니다.

## 용법

### 간결한 표시

가로 공간이 좁을 때 필요한 제어 요소만 표시합니다.

<ComponentExample component="pagination" scenario="compact" title="간결한 표시" description="가로 공간이 좁을 때 필요한 제어 요소만 표시합니다." :index="0" />

### 페이지당 항목 수

페이지당 항목 수를 바꾸고 필요하면 유효한 첫 페이지로 이동합니다.

<ComponentExample component="pagination" scenario="page-size" title="페이지당 항목 수" description="페이지당 항목 수를 바꾸고 필요하면 유효한 첫 페이지로 이동합니다." :index="1" />

### 페이지 번호만 표시

페이지 번호만 표시하는 간결한 탐색 구성을 보여 줍니다.

<ComponentExample component="pagination" scenario="pages-only" title="페이지 번호만 표시" description="페이지 번호만 표시하는 간결한 탐색 구성을 보여 줍니다." :index="2" />

### 외부 상태 관리

현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다.

<ComponentExample component="pagination" scenario="controlled" title="외부 상태 관리" description="현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다." :index="3" />

## 예시

### 긴 범위

현재 위치 주변의 페이지 번호만 표시하며 큰 결과 목록을 이동합니다.

<ComponentExample component="pagination" scenario="long-range" title="긴 범위" description="현재 위치 주변의 페이지 번호만 표시하며 큰 결과 목록을 이동합니다." :index="4" />

## 서버 페이지네이션 연결

서버 페이지와 UI 페이지를 같은 `v-model`로 연결하면 페이지 이동 요청과 데이터 fetch의 기준이 하나로 유지됩니다. 전체 건수는 응답의 최신 `total`을 그대로 전달합니다.

```vue
<script setup lang="ts">
import { ref, watch } from 'vue'
import { PaginationRoot, PaginationPrevious, PaginationNext } from '@sectile/vue/pagination'

const page = ref(1)
const pageSize = 25
const total = ref(0)
const rows = ref<Array<{ id: string; label: string }>>([])

watch(page, async (nextPage) => {
  const response = await fetch('/api/results?page=' + nextPage + '&pageSize=' + pageSize).then(r => r.json())
  rows.value = response.items
  total.value = response.total
}, { immediate: true })
</script>

<template>
  <ul>
    <li v-for="row in rows" :key="row.id">{{ row.label }}</li>
  </ul>

  <PaginationRoot v-model="page" :total="total" :items-per-page="pageSize">
    <PaginationPrevious>Previous</PaginationPrevious>
    <span>Page {{ page }}</span>
    <PaginationNext>Next</PaginationNext>
  </PaginationRoot>
</template>
```

## API 레퍼런스

Prop, event, slot, 공개 type, part selector와 키보드 동작은 [Pagination API](/ko/api/components/pagination)에서 확인합니다.

## 접근성

페이지 링크나 버튼이 기본 실행 의미와 현재 페이지 속성을 함께 제공합니다.

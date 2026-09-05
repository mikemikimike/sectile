<!-- scripts/generate-component-pages.mjs에서 생성함. -->
# Date Range Field

입력 초안과 검증 결과를 유지하면서 두 날짜를 편집합니다.

## 용법

### 기본 사용

필요한 구성만 사용하고 초깃값은 컴포넌트가 직접 관리합니다.

<ComponentExample component="date-range-field" scenario="basic" title="기본 사용" description="필요한 구성만 사용하고 초깃값은 컴포넌트가 직접 관리합니다." :index="0" />

### 범위 제한

입력값을 설정한 최솟값과 최댓값 범위 안에서 확정합니다.

<ComponentExample component="date-range-field" scenario="bounded" title="범위 제한" description="입력값을 설정한 최솟값과 최댓값 범위 안에서 확정합니다." :index="1" />

### 외부 상태 관리

현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다.

<ComponentExample component="date-range-field" scenario="controlled" title="외부 상태 관리" description="현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다." :index="2" />

## 애플리케이션 상태와 연결

날짜와 시각 값은 `Date` 객체로 변환하지 않고 구조화된 civil/wall-clock 값 그대로 `v-model`에 저장할 수 있습니다. 서버 전송이나 폼 저장 시에도 이 값을 기준으로 변환 시점을 직접 결정합니다.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { DateRangeFieldRoot, DateRangeFieldStartInput, DateRangeFieldEndInput } from '@sectile/vue/temporal/date-range-field'

const value = ref({ start: { year: 2026, month: 9, day: 15 }, end: { year: 2026, month: 9, day: 18 } })
</script>

<template>
  <DateRangeFieldRoot v-model="value">
    <DateRangeFieldStartInput aria-label="Start date" />
    <span aria-hidden="true">–</span>
    <DateRangeFieldEndInput aria-label="End date" />
  </DateRangeFieldRoot>
  <pre>{{ value }}</pre>
</template>
```

## API 레퍼런스

Prop, event, slot, 공개 type, part selector와 키보드 동작은 [Date Range Field API](/ko/api/components/date-range-field)에서 확인합니다.

## 접근성

시작과 종료 입력에 각각 이름을 제공하고 양 끝의 오류와 순서 있는 범위를 함께 노출합니다.

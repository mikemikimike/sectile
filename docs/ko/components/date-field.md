<!-- scripts/generate-component-pages.mjs에서 생성함. -->
# Date Field

시간대와 무관한 날짜를 구조화된 문자열로 입력하고 검증합니다.

## 용법

### ISO 날짜 날짜

시간대와 무관한 날짜를 ISO 형태로 입력합니다.

<ComponentExample component="date-field" scenario="iso-date" title="ISO 날짜 날짜" description="시간대와 무관한 날짜를 ISO 형태로 입력합니다." :index="0" />

### 범위 제한

입력값을 설정한 최솟값과 최댓값 범위 안에서 확정합니다.

<ComponentExample component="date-field" scenario="bounded" title="범위 제한" description="입력값을 설정한 최솟값과 최댓값 범위 안에서 확정합니다." :index="1" />

### 외부 상태 관리

현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다.

<ComponentExample component="date-field" scenario="controlled" title="외부 상태 관리" description="현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다." :index="2" />

## 애플리케이션 상태와 연결

날짜와 시각 값은 `Date` 객체로 변환하지 않고 구조화된 civil/wall-clock 값 그대로 `v-model`에 저장할 수 있습니다. 서버 전송이나 폼 저장 시에도 이 값을 기준으로 변환 시점을 직접 결정합니다.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { DateField } from '@sectile/vue/temporal/date-field'

const value = ref({ year: 2026, month: 9, day: 15 })
</script>

<template>
  <DateField v-model="value" label="Release date" />
  <pre>{{ value }}</pre>
</template>
```

## API 레퍼런스

Prop, event, slot, 공개 type, part selector와 키보드 동작은 [Date Field API](/ko/api/components/date-field)에서 확인합니다.

## 접근성

이름이 있는 입력란은 기본 텍스트 입력을 유지하며 오류·비활성·읽기 전용 상태를 전달합니다.

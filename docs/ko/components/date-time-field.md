<!-- scripts/generate-component-pages.mjs에서 생성함. -->
# Date Time Field

날짜와 현지 시각을 하나의 민간 시간 값으로 편집합니다.

## 용법

### 현지 일정 일정 선택

날짜와 현지 시각을 하나의 민간 시간 일정으로 확정합니다.

<ComponentExample component="date-time-field" scenario="local-schedule" title="현지 일정 일정 선택" description="날짜와 현지 시각을 하나의 민간 시간 일정으로 확정합니다." :index="0" />

### 외부 상태 관리

현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다.

<ComponentExample component="date-time-field" scenario="controlled" title="외부 상태 관리" description="현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다." :index="1" />

## 예시

### 넘나드는 자정 넘김

종료 시각이 다음 날로 넘어가는 일정도 올바르게 유지합니다.

<ComponentExample component="date-time-field" scenario="cross-midnight" title="넘나드는 자정 넘김" description="종료 시각이 다음 날로 넘어가는 일정도 올바르게 유지합니다." :index="2" />

## 애플리케이션 상태와 연결

날짜와 시각 값은 `Date` 객체로 변환하지 않고 구조화된 civil/wall-clock 값 그대로 `v-model`에 저장할 수 있습니다. 서버 전송이나 폼 저장 시에도 이 값을 기준으로 변환 시점을 직접 결정합니다.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { DateTimeField } from '@sectile/vue/temporal/date-time-field'

const value = ref({ date: { year: 2026, month: 9, day: 15 }, time: { hour: 9, minute: 30, second: 0, millisecond: 0 } })
</script>

<template>
  <DateTimeField v-model="value" label="Scheduled deployment" />
  <pre>{{ value }}</pre>
</template>
```

## API 레퍼런스

Prop, event, slot, 공개 type, part selector와 키보드 동작은 [Date Time Field API](/ko/api/components/date-time-field)에서 확인합니다.

## 접근성

이름이 있는 입력란은 기본 텍스트 입력을 유지하며 날짜와 시간 검증을 하나의 값으로 노출합니다.

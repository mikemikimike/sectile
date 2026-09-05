<!-- scripts/generate-component-pages.mjs에서 생성함. -->
# Time Range Field

간격과 순서 규칙을 지키며 시작·종료 시각을 편집합니다.

## 용법

### 업무 시간

일반 업무 시간 안에서 시작 시각과 종료 시각을 선택합니다.

<ComponentExample component="time-range-field" scenario="office-hours" title="업무 시간" description="일반 업무 시간 안에서 시작 시각과 종료 시각을 선택합니다." :index="0" />

### 일정 간격

설정한 간격에 맞는 값만 입력하고 조절합니다.

<ComponentExample component="time-range-field" scenario="stepped" title="일정 간격" description="설정한 간격에 맞는 값만 입력하고 조절합니다." :index="1" />

### 외부 상태 관리

현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다.

<ComponentExample component="time-range-field" scenario="controlled" title="외부 상태 관리" description="현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다." :index="2" />

## 애플리케이션 상태와 연결

날짜와 시각 값은 `Date` 객체로 변환하지 않고 구조화된 civil/wall-clock 값 그대로 `v-model`에 저장할 수 있습니다. 서버 전송이나 폼 저장 시에도 이 값을 기준으로 변환 시점을 직접 결정합니다.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { TimeRangeFieldRoot, TimeRangeFieldStartInput, TimeRangeFieldEndInput } from '@sectile/vue/temporal/time-range-field'

const value = ref({ start: { hour: 9, minute: 0, second: 0, millisecond: 0 }, end: { hour: 17, minute: 30, second: 0, millisecond: 0 } })
</script>

<template>
  <TimeRangeFieldRoot v-model="value">
    <TimeRangeFieldStartInput aria-label="Start time" />
    <span aria-hidden="true">–</span>
    <TimeRangeFieldEndInput aria-label="End time" />
  </TimeRangeFieldRoot>
  <pre>{{ value }}</pre>
</template>
```

## API 레퍼런스

Prop, event, slot, 공개 type, part selector와 키보드 동작은 [Time Range Field API](/ko/api/components/time-range-field)에서 확인합니다.

## 접근성

시작과 종료 입력에 각각 이름을 제공하고 양 끝의 오류가 보이는 하나의 순서 있는 시간 범위로 노출합니다.

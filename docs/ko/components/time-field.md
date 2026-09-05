<!-- scripts/generate-component-pages.mjs에서 생성함. -->
# Time Field

시간대와 무관한 시각을 입력하고 검증합니다.

## 용법

### 시각 시각

시간대와 무관한 시와 분을 입력합니다.

<ComponentExample component="time-field" scenario="wall-clock" title="시각 시각" description="시간대와 무관한 시와 분을 입력합니다." :index="0" />

### 일정 간격

설정한 간격에 맞는 값만 입력하고 조절합니다.

<ComponentExample component="time-field" scenario="stepped" title="일정 간격" description="설정한 간격에 맞는 값만 입력하고 조절합니다." :index="1" />

### 외부 상태 관리

현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다.

<ComponentExample component="time-field" scenario="controlled" title="외부 상태 관리" description="현재 값은 부모가 관리하고, 허용된 변경을 컴포넌트에 다시 전달합니다." :index="2" />

## 애플리케이션 상태와 연결

날짜와 시각 값은 `Date` 객체로 변환하지 않고 구조화된 civil/wall-clock 값 그대로 `v-model`에 저장할 수 있습니다. 서버 전송이나 폼 저장 시에도 이 값을 기준으로 변환 시점을 직접 결정합니다.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { TimeField } from '@sectile/vue/temporal/time-field'

const value = ref({ hour: 9, minute: 30, second: 0, millisecond: 0 })
</script>

<template>
  <TimeField v-model="value" label="Start time" />
  <pre>{{ value }}</pre>
</template>
```

## API 레퍼런스

Prop, event, slot, 공개 type, part selector와 키보드 동작은 [Time Field API](/ko/api/components/time-field)에서 확인합니다.

## 접근성

이름이 있는 입력란은 기본 텍스트 입력을 유지하며 시간 검증을 하나의 값으로 노출합니다.

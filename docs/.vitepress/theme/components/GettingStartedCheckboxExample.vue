<script setup lang="ts">
import { computed } from 'vue';
import {
  gettingStartedCheckboxLanguages,
  gettingStartedCheckboxSources,
} from '../getting-started-example-code.js';
import { useHostPreference } from '../host-preference.js';
import { useDocsLocale } from '../locale.js';
import HostCode from './HostCode.vue';

const { host } = useHostPreference();
const { isKorean } = useDocsLocale();

const explanation = computed(() => {
  const copy = isKorean.value ? {
    core: '<code>state</code>가 현재 체크 상태입니다. <code>dispatch(\'toggle\')</code>은 현재 상태와 이벤트를 <code>applyCheckboxEvent()</code>에 넘기고, 성공하면 반환된 다음 상태로 <code>state</code>를 교체합니다. <code>checked-changed</code> 명령은 호스트나 애플리케이션이 값 변경에 반응할 때 사용할 수 있습니다.',
    dom: '<code>createCheckbox()</code>는 이미 있는 버튼에 체크박스 동작과 접근성 상태를 연결합니다. 값이 바뀌면 <code>onValueChange</code>에서 애플리케이션이 소유한 상태 문구를 갱신하고, 더 이상 연결이 필요하지 않을 때 <code>disconnect()</code>로 정리합니다.',
    terminal: '<code>handleKeyboardInput()</code>이 Space와 Enter 입력을 체크박스 이벤트로 바꾸고, <code>getSnapshot()</code>의 현재 상태를 터미널 출력에 반영합니다. 입력 처리와 화면 출력은 호스트가 맡고 체크 상태 규칙은 Sectile이 유지합니다.',
    vue: '<code>checked</code>가 애플리케이션 상태입니다. <code>v-model</code>로 <code>CheckboxRoot</code>와 연결하면 사용자 조작이 같은 상태를 갱신하고, 아래 상태 문구도 그 값을 그대로 읽습니다.',
  } : {
    core: '<code>state</code> holds the current checked state. <code>dispatch(\'toggle\')</code> passes the current state and event to <code>applyCheckboxEvent()</code>, replaces <code>state</code> with the returned next state, and handles the <code>checked-changed</code> command that a host or application can react to.',
    dom: '<code>createCheckbox()</code> connects checkbox behavior and accessibility state to an existing button. <code>onValueChange</code> updates application-owned output when the value changes, and <code>disconnect()</code> releases the connection when it is no longer needed.',
    terminal: '<code>handleKeyboardInput()</code> maps Space and Enter to checkbox events, while <code>getSnapshot()</code> supplies the current state for terminal rendering. The host owns input and output; Sectile owns the checked-state rules.',
    vue: '<code>checked</code> is application state. <code>v-model</code> connects it to <code>CheckboxRoot</code>, so user interaction updates that same state and the status text reads the resulting value directly.',
  } as const;

  return copy[host.value];
});
</script>

<template>
  <div class="getting-started-example">
    <HostCode
      :sources="gettingStartedCheckboxSources"
      :languages="gettingStartedCheckboxLanguages"
    />
    <p class="getting-started-example__note" v-html="explanation" />
  </div>
</template>

<style scoped>
.getting-started-example__note {
  margin: -12px 0 28px;
  color: var(--vp-c-text-2);
  font-size: 0.92rem;
  line-height: 1.7;
}
</style>

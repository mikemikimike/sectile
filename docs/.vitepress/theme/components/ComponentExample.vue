<script setup lang="ts">
import { computed, defineAsyncComponent, ref, watch } from 'vue';
import { componentExampleSources } from '../component-example-sources.js';
import { useHostPreference } from '../host-preference.js';
import { useDocsLocale } from '../locale.js';
import { pinInputExampleOptions, type PinInputExampleOptions } from '../pin-input-example-options.js';
import ExampleFrame from './ExampleFrame.vue';
import PinInputExampleControls from './PinInputExampleControls.vue';
import TerminalComponentExample from './TerminalComponentExample.vue';

const ComponentExamplePreview = defineAsyncComponent(() => import('./ComponentExamplePreview.vue'));

const props = withDefaults(defineProps<{
  readonly component: string;
  readonly scenario: string;
  readonly title: string;
  readonly description: string;
  readonly index?: number;
}>(), { index: 0 });

const sources = computed(() => componentExampleSources(props.component, props.scenario));
const pinDefaults = computed(() => pinInputExampleOptions(props.scenario));
const pinOptions = ref<PinInputExampleOptions>(pinDefaults.value);
const hasPinControl = computed(() => props.component === 'pin-input' && props.scenario !== 'verification-code');
const { host } = useHostPreference();
const { isKorean } = useDocsLocale();
const sourceNote = computed(() => {
  const notes = isKorean.value ? {
    vue: '미리보기에는 문서용 표현 스타일이 적용되어 있습니다. 아래 코드는 Vue 컴포넌트 구성과 상태 연결에 필요한 공개 API만 보여 주는 사용 코드 조각입니다.',
    dom: '아래 코드는 애플리케이션이 소유한 DOM에 Sectile 동작을 연결하는 부분만 보여 줍니다. 미리보기의 HTML 구조와 문서용 표현 스타일은 포함하지 않습니다.',
    core: 'Core는 기존 상태를 직접 바꾸지 않습니다. 이벤트를 적용하면 새 상태와 명령이 반환되며, update.state가 다음 상태이고 update.commands는 애플리케이션이나 호스트가 처리할 효과입니다. 아래 코드는 이 한 번의 순수 상태 전이를 보여 줍니다.',
    terminal: '아래 코드는 Sectile 상태를 터미널 입력과 출력에 연결하는 부분을 보여 줍니다. 미리보기는 같은 상호작용 결과를 확인하기 위한 문서용 터미널 화면입니다.',
  } : {
    vue: 'The preview uses documentation presentation styles. The source below is a usage snippet focused on the public Vue composition and state wiring.',
    dom: 'The source below shows the DOM connection layer for application-owned markup. It does not include the preview HTML structure or documentation presentation styles.',
    core: 'Core does not mutate the current state in place. Applying an event returns a new state plus commands: update.state is the next state, and update.commands are effects for the application or host to execute. The source below shows one such pure state transition.',
    terminal: 'The source below shows how Sectile state connects to terminal input and output. The preview is a documentation terminal surface for the same interaction result.',
  } as const;

  return notes[host.value];
});
watch([() => props.component, () => props.scenario], () => {
  pinOptions.value = pinDefaults.value;
});
</script>

<template>
  <ExampleFrame
    :sources="sources"
    :languages="{ vue: 'vue', core: 'ts', dom: 'ts', terminal: 'ts' }"
    source-relationship="usage"
    :source-note="sourceNote"
  >
    <template v-if="hasPinControl" #toolbar>
      <PinInputExampleControls v-model="pinOptions" :scenario="scenario" />
    </template>
    <ComponentExamplePreview v-bind="props" :pin-input-options="component === 'pin-input' ? pinOptions : undefined" />
    <template #terminal>
      <TerminalComponentExample v-bind="props" />
    </template>
  </ExampleFrame>
</template>

<script setup lang="ts">
import { CodeXml, Eye } from '@lucide/vue';
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from '@sectile/vue/tabs';
import { computed, ref } from 'vue';
import { hostLabels, type Host, useHostPreference } from '../host-preference.js';
import { useDocsLocale } from '../locale.js';
import HighlightedCode from './HighlightedCode.vue';

const props = defineProps<{
  sources: Readonly<Partial<Record<Host, string>>>;
  title: string;
  description: string;
}>();

const modes = ['view', 'code'] as const;
const mode = ref<(typeof modes)[number]>('view');
const { host } = useHostPreference();
const { isKorean } = useDocsLocale();
const source = computed(() => props.sources[host.value] ?? null);
const language = computed(() => host.value === 'vue' ? 'vue' : 'ts');
const sourceNote = computed(() => {
  const notes = isKorean.value ? {
    vue: '미리보기에는 문서용 데이터와 표현 스타일이 적용되어 있습니다. 사용 코드는 Vue에서 표·그리드 상태와 공개 컴포넌트를 연결하는 부분만 보여 줍니다.',
    dom: '사용 코드는 애플리케이션이 소유한 표·그리드 DOM에 Tabular 동작을 연결하는 부분만 보여 줍니다. 미리보기의 마크업, 데이터 준비와 문서용 표현 스타일은 포함하지 않습니다.',
    core: '사용 코드는 렌더러와 무관한 Tabular 상태, 요청과 투영 흐름만 보여 줍니다. 실제 마크업과 화면 출력은 애플리케이션이나 실행 환경이 맡습니다.',
    terminal: '',
  } : {
    vue: 'The preview uses documentation data and presentation styles. The usage code shows only the public Vue composition that connects table or grid state to components.',
    dom: 'The usage code shows the DOM connection layer for application-owned table or grid markup. It does not include the preview markup, data preparation, or documentation presentation styles.',
    core: 'The usage code shows renderer-neutral Tabular state, request, and projection flow. Your application or host owns the actual markup and rendering.',
    terminal: '',
  } as const;

  return notes[host.value];
});
const unavailableMessage = computed(() => isKorean.value
  ? `${hostLabels[host.value]} 환경용 Tabular 예제가 없습니다. 페이지 헤더에서 Vue, DOM 또는 Core를 선택하세요.`
  : `No Tabular example is available for ${hostLabels[host.value]}. Choose Vue, DOM, or Core in the page header.`);
</script>

<template>
  <TabsRoot v-model="mode" :items="modes" class="tabular-example" as="section">
    <header class="tabular-example__header">
      <div class="tabular-example__heading">
        <strong>{{ title }}</strong>
        <span>{{ description }}</span>
      </div>
      <TabsList class="tabular-example__mode-tabs" :label="isKorean ? '예시 표시 방식' : 'Example display'">
        <TabsTrigger class="tabular-example__mode" value="view">
          <Eye :size="15" aria-hidden="true" />
          {{ isKorean ? '동작 미리보기' : 'Behavior preview' }}
        </TabsTrigger>
        <TabsTrigger class="tabular-example__mode" value="code">
          <CodeXml :size="15" aria-hidden="true" />
          {{ isKorean ? '사용 코드' : 'Usage code' }}
        </TabsTrigger>
      </TabsList>
    </header>

    <TabsContent class="tabular-example__preview" value="view">
      <slot />
    </TabsContent>

    <TabsContent class="tabular-example__code" value="code">
      <template v-if="source !== null">
        <p class="tabular-example__source-note">{{ sourceNote }}</p>
        <HighlightedCode :source="source" :language="language" />
      </template>
      <p v-else class="tabular-example__unavailable" role="status">{{ unavailableMessage }}</p>
    </TabsContent>
  </TabsRoot>
</template>

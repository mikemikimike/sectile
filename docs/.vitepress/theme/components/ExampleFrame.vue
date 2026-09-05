<script setup lang="ts">
import { CodeXml, Eye } from '@lucide/vue';
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from '@sectile/vue/tabs';
import { computed, ref } from 'vue';
import { type Host, useHostPreference } from '../host-preference.js';
import { useDocsLocale } from '../locale.js';
import HighlightedCode from './HighlightedCode.vue';

const props = withDefaults(defineProps<{
  sources: Partial<Record<Host, string>>;
  koSources?: Partial<Record<Host, string>>;
  languages?: Partial<Record<Host, string>>;
  fixedHost?: Host;
  sourceRelationship?: 'exact' | 'usage';
  sourceNote?: string;
  unmountPreviewWhenHidden?: boolean;
}>(), {
  sourceRelationship: 'exact',
  sourceNote: '',
  unmountPreviewWhenHidden: false,
});

const modes = ['view', 'code'] as const;
const mode = ref('view');
const { host } = useHostPreference();
const { isKorean } = useDocsLocale();
const activeHost = computed(() => props.fixedHost ?? host.value);
const source = computed(() => {
  const value = (isKorean.value ? props.koSources?.[activeHost.value] : undefined) ?? props.sources[activeHost.value];
  if (value === undefined || value.trim() === '') {
    throw new Error(`Missing ${activeHost.value} example source`);
  }
  return value;
});
const language = computed(() => props.languages?.[activeHost.value] ?? (activeHost.value === 'vue' ? 'vue' : 'ts'));
const isExactSource = computed(() => props.sourceRelationship === 'exact');
const viewLabel = computed(() => isExactSource.value
  ? (isKorean.value ? '실행 화면' : 'View')
  : (isKorean.value ? '동작 미리보기' : 'Behavior preview'));
const codeLabel = computed(() => isExactSource.value
  ? (isKorean.value ? '코드' : 'Code')
  : (isKorean.value ? '사용 코드' : 'Usage code'));
</script>

<template>
  <TabsRoot v-model="mode" :items="modes" class="sectile-example" as="section">
    <header class="sectile-example__toolbar">
      <div v-if="$slots['toolbar']" class="sectile-example__toolbar-start">
        <slot name="toolbar" />
      </div>
      <TabsList class="sectile-example__tabs" :label="isKorean ? '예시 표시 방식' : 'Example display'">
        <TabsTrigger
          class="sectile-example__tab"
          value="view"
        >
          <Eye :size="15" aria-hidden="true" />
          {{ viewLabel }}
        </TabsTrigger>
        <TabsTrigger
          class="sectile-example__tab"
          value="code"
        >
          <CodeXml :size="15" aria-hidden="true" />
          {{ codeLabel }}
        </TabsTrigger>
      </TabsList>
    </header>
    <TabsContent
      class="sectile-example__preview"
      value="view"
    >
      <template v-if="!unmountPreviewWhenHidden || mode === 'view'">
        <slot v-if="activeHost !== 'terminal' || !$slots['terminal']" />
        <slot v-else name="terminal" />
      </template>
    </TabsContent>
    <TabsContent
      class="sectile-example__code"
      value="code"
    >
      <p v-if="!isExactSource && sourceNote" class="sectile-example__source-note">
        {{ sourceNote }}
      </p>
      <HighlightedCode :source="source" :language="language" />
    </TabsContent>
  </TabsRoot>
</template>

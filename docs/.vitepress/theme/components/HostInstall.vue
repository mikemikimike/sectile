<script setup lang="ts">
import { type Host } from '../host-preference.js';
import HostCode from './HostCode.vue';

const commands: Readonly<Record<Host, string>> = Object.freeze({
  core: 'pnpm add @sectile/core',
  dom: 'pnpm add @sectile/dom',
  terminal: 'pnpm add @sectile/terminal',
  vue: 'pnpm add @sectile/vue',
});
</script>

<template>
  <div class="host-install">
    <HostCode :sources="commands" :languages="{ core: 'sh', dom: 'sh', terminal: 'sh', vue: 'sh' }" />
  </div>
</template>

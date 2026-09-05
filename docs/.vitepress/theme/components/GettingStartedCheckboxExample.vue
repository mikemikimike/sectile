<script setup lang="ts">
import {
  gettingStartedCheckboxLanguages,
  gettingStartedCheckboxSources,
} from '../getting-started-example-code.js';
import HostCode from './HostCode.vue';
</script>

<template>
  <HostCode
    :sources="gettingStartedCheckboxSources"
    :languages="gettingStartedCheckboxLanguages"
  />
</template>

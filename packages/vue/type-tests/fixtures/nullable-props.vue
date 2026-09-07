<script setup lang="ts">
import { SelectRoot } from '@sectile/vue/select';
import { SpinButtonRoot } from '@sectile/vue/spin-button';
</script>

<template>
  <SelectRoot :items="[]" :model-value="null" :default-value="null" />
  <SpinButtonRoot
    :min="0"
    :max="10"
    :draft="null"
    :default-draft="null"
  />
</template>

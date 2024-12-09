<script lang="ts" setup>
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
</script>
<template>
    <RouterView></RouterView>
  <VueQueryDevtools />
</template>
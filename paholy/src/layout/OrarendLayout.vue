<script setup lang="ts">
import type { Lesson } from '@/api/orarend/orarend';
import { fetchOrarend } from '@/api/orarend/orarendQuery';
import { ref, watch } from 'vue';
import { format, startOfWeek, addWeeks } from 'date-fns';
</script>

<template>
  <main>
    <RouterView></RouterView>
  </main>
</template>
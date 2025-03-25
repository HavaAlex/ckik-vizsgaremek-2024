<script setup lang="ts">
import type { Lesson } from '@/api/orarend/orarend';
import { fetchOrarend } from '@/api/szulo/szuloQuery';
import { ref } from 'vue';

const lessons = ref<Lesson[]>([]);

async function orarendfeltolt(weekStart: string) { //MÁSOLANDÓ
  lessons.value = await fetchOrarend(weekStart);
}
</script>

<template>
  <main>
    <RouterView></RouterView>
  </main>
</template>
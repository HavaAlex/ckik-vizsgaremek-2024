<script setup lang="ts">
import type { Lesson } from '@/api/orarend/orarend';
import { fetchOrarend } from '@/api/orarend/orarendQuery';
import {fetchOrarend as szuloFetchOrarend} from '@/api/szulo/szuloQuery';
import { ref, watch } from 'vue';
import { format, startOfWeek, addWeeks } from 'date-fns';

async function szuloOrarendfeltolt(weekStart: string) { //MÁSOLANDÓ
  lessons.value = await szuloFetchOrarend(weekStart);
}
</script>

<template>
  <main>
  </main>
</template>
 
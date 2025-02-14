<script setup lang="ts"> 
import { ref } from 'vue'
import {  usegetGroups } from '@/api/hazik/hazikQuery';

const { data } = usegetGroups();
</script>

<template>
  <main>

    <v-btn theme="dark">Feladat kitúzése</v-btn>
  </main>
</template>
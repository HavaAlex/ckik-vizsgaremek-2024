<script setup lang="ts">
import { useGetOrarend } from '@/api/orarend/orarendQuery';
const {mutate: getGroup} = useGetOrarend()
const data = getGroup()
console.log(data)

console.log("orarend")
</script>

<template>
  <main>
  </main>
</template>
 
<script setup lang="ts">
import { useGetUzenetek } from '@/api/uzenetek/uzenetekQuery';
const data = useGetUzenetek()
console.log(data)
//fingo INSERT INTO `messages` (`ID`, `senderUserID`, `message`, `date`) VALUES (NULL, '1', 'fingo', '2025-01-28 22:17:06.000000');
</script>

<template>
  <main>
  </main>
</template>
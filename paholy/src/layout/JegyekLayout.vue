<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { getUserStatusFromLocalStorage} from '@/localstorage/localStorageManagment.ts';
const { push } = useRouter()
</script>

<template>
  <main>




    <RouterView></RouterView>
  </main>

</template>
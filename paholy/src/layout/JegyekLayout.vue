<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { getUserStatusFromLocalStorage} from '@/localstorage/localStorageManagment.ts';
const { push } = useRouter()
</script>

<template>
  <main>


    <div v-if = "getUserStatusFromLocalStorage() == 'tanar' || getUserStatusFromLocalStorage() == 'admin' ">
    </div>
    <div v-else>

    </div>

    <RouterView></RouterView>
  </main>

</template>
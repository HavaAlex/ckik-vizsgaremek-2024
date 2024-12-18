<script setup lang="ts">
import { getUserStatusFromLocalStorage} from '@/localstorage/localStorageManagment.ts';
</script>
<template>
  <main>
    <h1 v-if="getUserStatusFromLocalStorage()=='szulo'">Gyermeke orarendje: </h1>
    <h1 v-else>Órarened:</h1>
      <v-table theme="dark" height="30vw" fixed-header style="border-radius: 5%;">
        <thead>
          <tr>
            <th class="text-center">Hétfő</th>
            <th class="text-center">Kedd</th>
            <th class="text-center">Szerda</th>
            <th class="text-center">Csütörtök</th>
            <th class="text-center">Péntek</th>
            <th class="text-center">Szombat</th>
            <th class="text-center">Vasárnap</th>
          </tr>
        </thead>
        <tbody>
        </tbody>
      </v-table>
    <RouterView></RouterView>
  </main>
</template>
<style lang="css">
main{
  width: 60vw;
}

</style>
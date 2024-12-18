<script setup lang="ts">
import { getUserStatusFromLocalStorage} from '@/localstorage/localStorageManagment.ts';
</script>

<template>
  <main>
    <h1 v-if="getUserStatusFromLocalStorage()=='tanar'">Kisztott feladatok: </h1>
      <h1 v-else-if="getUserStatusFromLocalStorage()=='tanulo'">Megkapott feladatok: </h1>
      <h1 v-else>Gyermeke feladatai:</h1>
    <v-table theme="dark" height="30vw" style="margin: 10%; border-radius: 5%;">
      <thead>
        <tr>
            <th class="text-center">Határidő</th>
            <th class="text-center">Tantárgy</th>
            <th class="text-center">Feladó tanár</th>
            <th class="text-center">Rövid leírás</th>
            <th class="text-center"></th>
          </tr>
      </thead>
      <tbody>

      </tbody>
    </v-table>
    <RouterView>
      
    </RouterView>
  </main>
</template>
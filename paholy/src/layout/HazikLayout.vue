<script setup lang="ts">
import { getUserStatusFromLocalStorage} from '@/localstorage/localStorageManagment.ts';
</script>

<template>
  <main>

    <div v-if="getUserStatusFromLocalStorage()=='tanar'">
      <h1 >Kisztott feladatok: </h1>
      <v-table theme="dark" height="30vw" style="margin: 10%; border-radius: 5%;">
        <thead>
          <tr>
              <th class="text-center">Határidő</th>
              <th class="text-center">Tantárgy</th>
              <th class="text-center">Leadott feladatok száma</th>
              <th class="text-center">Rövid leírás</th>
              <th class="text-center"></th>
            </tr>
        </thead>
        <tbody>

        </tbody>
      </v-table>
    </div>

    <div v-else-if="getUserStatusFromLocalStorage()=='tanulo'">
      <h1 >Megkapott feladatok: </h1>
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
    </div>
    <div v-else>
      <h1 >Gyermeke feladatai:</h1>
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
    </div>
    <RouterView>
      
    </RouterView>
  </main>
</template>
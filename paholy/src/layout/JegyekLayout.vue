<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { getUserStatusFromLocalStorage} from '@/localstorage/localStorageManagment.ts';
const { push } = useRouter()
</script>

<template>
  <main>


    <div v-if = "getUserStatusFromLocalStorage() == 'tanar' || getUserStatusFromLocalStorage() == 'admin' ">
      <h1>Kiosztott osztályzatok</h1>

      <v-navigation-drawer theme="dark">
        <v-list-item title="Szűrési szempontok: "></v-list-item>
        <v-divider></v-divider>
        <h3>Osztályok:</h3>
        <br>
        <h3>Tantárgyak:</h3>
        <br>
        <h3>Érdemjegyek:</h3>
        <h5>Minimum:</h5>
        <v-slider
        :min="1"
        :max="5"
        :step="0.1"
        color="primary"
        class="mt-4"
        thumb-label
      ></v-slider>
      <h5>Maximum:</h5>
        <v-slider
        :min="1.1"
        :max="5"
        :step="0.1"
        color="primary"
        class="mt-4"
        thumb-label
      ></v-slider>
    </v-navigation-drawer>
      <v-table theme="dark" height="40vw" style="border-radius: 2%;">
      <thead>
        <tr>
            <th class="text-center">Tanuló</th>
            <th class="text-center">Tantárgy</th>
            <th class="text-center">Osztály</th>
            <th class="text-center">Érdemjegyek</th>
            <th class="text-center">Átlag</th>
            <th class="text-center">Interakció</th>
          </tr>
      </thead>
      <tbody>

      </tbody>
    </v-table>

    </div>
    <div v-else>
      <h1>Osztályzatok:</h1>
      <v-table theme="dark" height="40vw">
      <thead>
        <tr>
            <th class="text-center">Tantárgy</th>
            <th class="text-center">Szeptember</th>
            <th class="text-center">Október</th>
            <th class="text-center">November</th>
            <th class="text-center">December</th>
            <th class="text-center">Január</th>
            <th class="text-center">Félév</th>
            <th class="text-center">Február</th>
            <th class="text-center">Március</th>
            <th class="text-center">Április</th>
            <th class="text-center">Május</th>
            <th class="text-center">Június</th>
            <th class="text-center">Évvége</th>
          </tr>
      </thead>
      <tbody>

      </tbody>
    </v-table>
    </div>

    <RouterView></RouterView>
  </main>

</template>
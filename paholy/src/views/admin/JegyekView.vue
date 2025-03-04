<script setup lang="ts">
</script>

<template>
  <main>
    <h1>Kiosztott osztályzatok</h1>

      <v-navigation-drawer >
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
      <v-table  height="40vw" style="border-radius: 2%;">
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

    
  </main> 
</template>
 
<script setup lang="ts">
</script>

<template>
  <main>
    <div>

      <v-navigation-drawer >
        <v-list-item title="Szűrési szempontok: "></v-list-item>
        <v-divider></v-divider>
        <h3>Osztályok:</h3>
        <br>
        <h3>Tantárgyak:</h3>
        <br>
        <h3>Napok:</h3>
        <br>
    </v-navigation-drawer>
      <v-table  height="40vw" style="border-radius: 2%;">
      <thead>
        <tr>
            <th class="text-center">Tanuló</th>
            <th class="text-center">Nap</th>
            <th class="text-center">Óra</th>
            <th class="text-center">Igazolás státusza</th>
            <th class="text-center">Késés</th>
          </tr>
      </thead>
      <tbody>
      </tbody>
    </v-table>
    </div>
  </main>
</template>
 
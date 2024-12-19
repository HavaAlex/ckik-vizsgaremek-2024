<script setup lang="ts">
</script>

<template>
  <main>
    <h1>Felhasználók kezelése</h1>
    <v-navigation-drawer theme="dark">
        <v-list-item title="Szűrési szempontok: "></v-list-item>
        <v-divider></v-divider>
        <h3>Szerepkörök:</h3>
        <input type="checkbox" checked="true">
        <label for="vehicle1">Tanar</label><br>
        <input type="checkbox" checked="true">
        <label for="vehicle1">Diákok</label><br>
        <input type="checkbox" checked="true">
        <label for="vehicle1">Szülők / gondviselők</label><br>
        <input type="checkbox">
        <label for="vehicle1">Adminok</label><br>

        <h3>Osztalyok (csak tanulók):</h3>
        <br>
        <h3>Tanított tantárgyak (csak tanárok):</h3>

    </v-navigation-drawer>
    <v-table theme="dark" height="30vw" style="margin: 10%; border-radius: 5%;">
        <thead>
          <tr>
              <th class="text-center">Név</th>
              <th class="text-center">Szerepkör</th>
              <th class="text-center">Osztály</th>
              <th class="text-center">Gyerek_ID</th>
              <th class="text-center">Osztaly_ID</th>
              <th class="text-center">Születési ideje</th>
              <th class="text-center">Lakcím</th>
              <th class="text-center">Interakció</th>
            </tr>
        </thead>
        <tbody>

        </tbody>
      </v-table>
  </main>
</template>

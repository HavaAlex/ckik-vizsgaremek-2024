<script setup lang="ts">
</script>

<template>
  <main>
    <h1>Beérkezett üzenetek</h1>
    
    <v-table theme="dark" height="40vw" fixed-header style="border-radius: 3%;">
        <thead>
          <tr>
            <th class="text-center">Tárgy</th>
            <th class="text-center">Feladó</th>
            <th class="text-center">Dátum</th>
            <th class="text-center">Címzettek</th>
            <th><!--itt ez üres, alatta lesz a megnyitás gomb--></th>
            <th><!--itt ez üres, alatta lesz a törlés gomb--></th>
          </tr>
        </thead>
        <tbody></tbody>
    </v-table>
    <RouterView> 
    </RouterView>
  </main>
</template>
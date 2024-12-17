<script setup lang="ts">


</script>

<template>
  <main>

    <RouterView>
      
    </RouterView>
    <h1>Hazik layout</h1>
    <v-footer class="bg-grey-lighten-1" >
    <v-row justify="center" no-gutters>

      <v-col class="text-center mt-4" cols="12">
        {{ new Date().getFullYear() }} — <strong>Páholy</strong>
      </v-col>
    </v-row>
  </v-footer>


  </main>

</template>
<script setup lang="ts">
import type { NewMark, MarkAttribute } from '@/api/jegyek/jegyek';
import { useAddMark, useGetMarks } from '@/api/jegyek/jegyekQuery';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const NewMarkRef = ref<NewMark>({
    StudentId: 0,
    subject: '',
    mark: 0,
    markmultiplier: 0, 
})
const {data} = useGetMarks()
const {push} = useRouter()
const {back} = useRouter()
const {mutate, isPending} = useAddMark()


const range = ref([1, 5]); // Two handles, one at 1, one at 5

</script>

<template>
  <main>
    <h1>Kiosztott osztályzatok</h1>

      <v-navigation-drawer theme="dark">
        <v-list-item title="Szűrési szempontok: "></v-list-item>
        <v-divider></v-divider>
        <h3>Osztályok:</h3>
        <br>
        <h3>Tantárgyak:</h3>
        <br>
        <h3>Érdemjegyek átlaga:</h3>
        <v-range-slider
          v-model="range"
          :min="1"
          :max="5"
          :step="0.1"
          show-ticks
          color="primary"
        class="mt-4"
        thumb-label
        ></v-range-slider>
        <!--
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
      ></v-slider>-->
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

    
  </main>
</template>
  
<script setup lang="ts">
import { useGetHianyzasok } from '@/api/hianyzasok/hianyzasokQuery';
import { ref } from 'vue';
const {data} = useGetHianyzasok()
</script>

<template>
  <main>
    <div>
      <v-table theme="dark" height="40vw">
      <thead>
          <tr>
            <th class="text-center">időpont</th>
            <th class="text-center">Igazolás státusza</th>
          </tr>
      </thead>
      <tbody>
        <tr v-for="elem in data?.data" v-if="data?.data != undefined">
          <td>{{ elem.hianyzas.date }}</td>
          <td>{{ elem.hianyzas.excused }}</td>
        </tr>
        <v-card style="justify-content: center" v-else>
          <v-progress-circular indeterminate :size="37"></v-progress-circular>
        </v-card>
      </tbody>
    </v-table>
    </div>
  </main>
</template>
 
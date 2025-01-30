<script setup lang="ts">
import { useGetHianyzasok } from '@/api/hianyzasok/hianyzasokQuery';
import { ref } from 'vue';
const {data} = useGetHianyzasok()
console.log("hianyzasok újra")
console.log(data)
</script>

<template>
  <main>
    <div>
      <h1>Hiányzások:</h1>
      <v-table theme="dark" height="40vw">
      <thead>
          <tr>
            <th class="text-center">időpont</th>
            <th class="text-center">Igazolás státusza</th>
          </tr>
      </thead>
      <tbody>
        <tr v-for="elem in data?.data">
          <td>{{ elem.hianyzas.date }}</td>
          <td>{{ elem.hianyzas.excused }}</td>
        </tr>
      </tbody>
    </v-table>
    </div>
  </main>
</template>
 
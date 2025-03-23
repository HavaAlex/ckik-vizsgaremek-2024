<script setup lang="ts">
import { useGetHianyzasok } from '@/api/hianyzasok/hianyzasokQuery';

const { data } = useGetHianyzasok();

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleString(); // Adjust options here if needed
}

function formatExcused(excused: boolean): string {
  return excused ? 'Igazolva' : 'Igazolatlan';
}
</script>

<template>
  <main>
    <v-table height="40vw">
      <thead>
        <tr>
          <th class="text-center">Időpont</th>
          <th class="text-center">Igazolás státusza</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="data?.data">
          <tr v-for="elem in data.data" :key="elem.id">
            <td>{{ formatDate(elem.date) }}</td>
            <td>{{ formatExcused(elem.excused) }}</td>
          </tr>
        </template>
        <template v-else>
          <tr>
            <td colspan="2" class="text-center">
              <v-card style="display: flex; justify-content: center;">
                <v-progress-circular indeterminate :size="37"></v-progress-circular>
              </v-card>
            </td>
          </tr>
        </template>
      </tbody>
    </v-table>
  </main>
</template>

<script setup lang="ts">
import type { NewMark, MarkAttribute } from '@/api/jegyek/jegyek';
import { useAddMark, usegetGroupMarks, useGetTeacherGroups } from '@/api/jegyek/jegyekQuery';
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const NewMarkRef = ref<NewMark>({
    StudentId: 0,
    subject: '',
    mark: 0,
    markmultiplier: 0, 
})
const {data} = useGetTeacherGroups()
const groupMarks = usegetGroupMarks()
const {push} = useRouter()
const {back} = useRouter()
const {mutate, isPending} = useAddMark()

// Kiválasztott tantárgy
const selectedGroup = ref<string | null>(null);

// Egyedi tantárgyak listázása
const tantargyak = computed(() => {
  if (!data.value) return [];
  return [...new Set(data.value.map((jegy: any) => jegy.name))];
});

const filteredTantargyak = computed(() => {
  if (!data.value) return [];
  if (!selectedGroup.value) return data.value;
  return groupMarks.data.value?.find((jegy: any) => jegy.groupName === selectedGroup.value);
});

const range = ref([1, 5]); // Two handles, one at 1, one at 5

</script>

<template>
  <main>
    <h1>Osztályzatok</h1>

      <v-navigation-drawer theme="dark">
        <v-list-item title="Szűrési szempontok: "></v-list-item>
        <v-divider></v-divider>
        <h3>Osztályok:</h3>
        <v-select
        v-model="selectedGroup"
        :items="tantargyak"
        label="Válasszon osztályt!"
        ></v-select>
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
    </v-navigation-drawer>
      <v-table theme="dark" height="40vw" style="border-radius: 2%;">
      <thead>
        <tr>
            <th class="text-center">Tanuló ID</th>
            <th class="text-center">Név</th>
            <th class="text-center">Osztályzat</th>
            <th class="text-center">Dátum</th>
          </tr>
      </thead>
      <tbody>
        <tr v-for="(jegy, index) in filteredTantargyak?.marks" :key="index">
          <td style="width: 15vw; justify-content: center !important; ">{{ jegy.studentID }}</td>
          <td style="width: 15vw; justify-content: center !important; ">{{ jegy.Student?.name }}</td>
          <td style="width: 15vw; justify-content: center !important;">{{ jegy.Value }}</td>
          <td style="width: 15vw; justify-content: center !important;">{{ new Date(jegy.date).getFullYear() }}.{{ new Date(jegy.date).getMonth()+1 }}.{{ new Date(jegy.date).getDate() }}</td>
        </tr>
      </tbody>
    </v-table>

    
  </main>
</template>
  
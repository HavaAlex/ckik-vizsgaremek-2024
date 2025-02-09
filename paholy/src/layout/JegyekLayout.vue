<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { getUserStatusFromLocalStorage} from '@/localstorage/localStorageManagment.ts';
import { useGetMarks } from '@/api/jegyek/jegyekQuery';
import { ref, computed } from 'vue';
const {data} = useGetMarks();

// Kiválasztott tantárgy
const selectedSubject = ref<string | null>(null);

// Egyedi tantárgyak listázása
const tantargyak = computed(() => {
  if (!data.value) return [];
  return [...new Set(data.value.map((jegy: any) => jegy.subjectName))];
});

// Jegyek szűrése a kiválasztott tantárgy alapján
const filteredTantargyak = computed(() => {
  if (!data.value) return [];
  if (!selectedSubject.value) return data.value;
  return data.value.filter((jegy: any) => jegy.subjectName === selectedSubject.value);
});

</script>

<template>
  
  <main>
    <div class="color-picker">
      <label for="lessonColor">Szín megváltoztatása:</label>
      <input type="color" id="lessonColor"/>
    </div>
    <v-table theme="dark" class="jegytabla"  fixed-header style="border-radius: 5%;">
      <thead>
        <tr>
          <th class="text-center">
            <v-select
            v-model="selectedSubject"
            :items="tantargyak"
            label="Tantárgy"
            ></v-select></th>
          <th class="text-center">Jegy</th>
          <th class="text-center">Százalék</th>
          <th class="text-center">Dátum</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(jegy, index) in filteredTantargyak" :key="index">
          <td style="width: 15vw; justify-content: center;">{{ jegy.subjectName }}</td>
          <td style="width: 15vw; justify-content: center;">{{ jegy.Value }}</td>
          <td style="width: 15vw; justify-content: center;">{{ jegy.Multiplier }}%</td>
          <td style="width: 15vw; justify-content: center;">{{ new Date(jegy.date).getFullYear() }}.{{ new Date(jegy.date).getMonth()+1 }}.{{ new Date(jegy.date).getDate() }}</td>
        </tr>
      </tbody>
    </v-table>
    <RouterView></RouterView>
  </main>

</template>

<style lang="css">
/* Portrait mode */
@media (orientation: portrait) {
  main {
  width: 95vw;
  }
  .jegytabla{
    height: 95vw;
  }
}

/* Landscape mode */
@media (orientation: landscape) {
  main {
  width: 80vw;
  }
  .jegytabla{
    height: 40vw;
  }
}


</style>
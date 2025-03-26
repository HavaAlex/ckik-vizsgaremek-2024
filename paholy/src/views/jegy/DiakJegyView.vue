<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { getUserStatusFromLocalStorage} from '@/localstorage/localStorageManagment.ts';
import { useGetMarks } from '@/api/jegyek/jegyekQuery';
import { ref, computed } from 'vue';
import { useJegyStore } from '@/stores/jegyStore';
import { storeToRefs } from 'pinia';

const jegyStore = useJegyStore()
const refs = storeToRefs(jegyStore)

jegyStore.jegyFeltolt()

// Egyedi tantárgyak listázása
const tantargyak = computed(() => {
  if (!refs.marks.value) return [];
  return [...new Set(refs.marks.value.map((jegy: any) => jegy.subjectName))];
});

const honapLista = [9,10,11,12,1,2,3,4,5,6,7,8]
const honapNevLista = ["Szeptember","Október","November","December","Január","Február","Március","Április","Május","Június","Július","Augusztus"]

</script>

<template>
  
  <main>
    <div class="color-picker">
      <label for="lessonColor">Szín megváltoztatása:</label>
      <input type="color" id="lessonColor"/>
    </div>

    <v-table  height="40vw" style="border-radius: 2%;" v-if="refs.marks.value != undefined">
      <thead>
        <tr>
            <th style="width: 15vw; justify-content: center !important; " class="text-center">Tantárgy</th>
            <th style="width: 15vw; justify-content: center !important; " class="text-center" v-for="(honapNev) in honapNevLista">{{honapNev}}</th>
          </tr>
      </thead>
      <tbody>
        <tr v-for="(record, index) in tantargyak" :key="index" v-if="tantargyak.length>0" class="secondary">
          <td style="width: 15vw; justify-content: center !important;">{{ record }}</td>
          <td style="width: 15vw; justify-content: center !important;" v-for="(honap) in honapLista">
            <p v-for="(jegy, index) in refs.marks.value.filter((jegy:any)=>new Date(jegy.date).getMonth()+1 == honap&& jegy.subjectName == record )" :key="index">
              <v-hover
                v-slot="{ isHovering, props }"
              >
                <v-card v-bind="props" style="justify-self: center;">
                  <v-card-text v-if="isHovering == false||isHovering == undefined">
                    {{ jegy.Value }}
                  </v-card-text>
                  <v-card-text v-else>
                    Jegy: {{ jegy.Value }} Tanár: {{ jegy.teacherID }} Százalék: {{ jegy.Multiplier }}%
                  </v-card-text>
                </v-card>
              </v-hover>
            </p>
          </td>
        </tr>
        <v-card v-else>
          <v-card style="justify-content: center">
          Nincs megjeleníthető adat!
          </v-card>
        </v-card>
      </tbody>
    </v-table>
    <v-card style="justify-content: center" v-else>
      <v-progress-circular indeterminate :size="37"></v-progress-circular>
    </v-card>
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
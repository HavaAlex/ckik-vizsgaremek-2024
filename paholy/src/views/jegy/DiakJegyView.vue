<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, onUpdated } from 'vue';
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

const isPortrait = ref(window.matchMedia("(orientation: portrait)").matches);
const updateOrientation = () => {
  isPortrait.value = window.matchMedia("(orientation: portrait)").matches;
};

onUpdated(()=>{
  jegyStore.jegyFeltolt()
})

onMounted(() => {
  window.matchMedia("(orientation: portrait)").addEventListener("change", updateOrientation);
});
onUnmounted(() => {
  window.matchMedia("(orientation: portrait)").removeEventListener("change", updateOrientation);
});//itt ér véget

</script>

<template>
  
  <main>
    <div v-if="isPortrait">
      <v-card>
      <v-card-item style="padding: 0; width: 100vw;">
      <v-expansion-panels>
        <template v-if="Object.keys(refs.marks.value)?.length  > 0">
          <v-expansion-panel v-for="(record, index) in tantargyak" :key="index" >
            <v-expansion-panel-title>
              {{ record }}
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <div style="max-height: 75vw; overflow-y: auto;">
              <v-table>
                <thead>
                  <tr>
                    <th class="text-center">Érdemjegy</th>
                    <th class="text-center">Százalék</th>
                    <th class="text-center">Dátum</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="jegy in refs.marks.value.filter((jegy:any)=>jegy.subjectName == record )" :key="jegy.ID">
                    <td class="text-center">
                      <v-card class="secondary" style="width: 20vw; justify-self: center;" >
                        <v-card-text>
                          {{ jegy.Value }}
                        </v-card-text>
                      </v-card>
                    </td>
                    <td class="text-center">
                      <v-card class="secondary" style="width: 20vw; justify-self: center;" >
                        <v-card-text>
                          {{ jegy.Multiplier }}%
                        </v-card-text>
                      </v-card>
                    </td>
                    <td class="text-center" >
                      <v-card class="secondary" style="width: 20vw; justify-self: center;" >
                        <v-card-text>
                          {{ new Date(jegy.date).getFullYear()+'.'+(new Date(jegy.date).getMonth()+1)+'.'+new Date(jegy.date).getDate() }}
                        </v-card-text>
                      </v-card>
                    </td>
                  </tr>
                </tbody>
              </v-table>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </template>
        <template v-else-if="Object.keys(refs.marks.value)?.length == 0">
          <v-card style=" padding: 1rem;">
            Nincs jegy!
          </v-card>
        </template>
        <template v-else>
          <v-card style="display: flex; justify-content: center;">
            <v-progress-circular indeterminate :size="37"></v-progress-circular>
          </v-card>
        </template>
      </v-expansion-panels>
    </v-card-item>
    </v-card>
    </div>
    <div v-else>
      <v-table  height="40vw" style="border-radius: 2%;" v-if="refs.marks.value != undefined">
        <thead>
          <tr>
              <th style="width: 15vw; justify-content: center !important; " class="text-center">Tantárgy</th>
              <th style="width: 15vw; justify-content: center !important; " class="text-center" v-for="(honapNev) in honapNevLista">{{honapNev}}</th>
            </tr>
        </thead>
        <tbody>
          <tr v-for="(record, index) in tantargyak" :key="index" v-if="tantargyak.length>0">
            <td style="width: 15vw; justify-content: center !important;" class="secondary">{{ record }}</td>
            <td style="width: 15vw; justify-content: center !important;" v-for="(honap) in honapLista">
              <p v-for="(jegy, index) in refs.marks.value.filter((jegy:any)=>new Date(jegy.date).getMonth()+1 == honap&& jegy.subjectName == record )" :key="index">
                <v-hover
                  v-slot="{ isHovering, props }"
                >
                  <v-card v-bind="props" style="justify-self: center;" class="secondary">
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
    </div>
  </main>

</template>

<style lang="css">

@media (orientation: portrait) {
  main {
  width: 95vw;
  }
  .jegytabla{
    height: 95vw;
  }
}

@media (orientation: landscape) {
  main {
  width: 80vw;
  }
  .jegytabla{
    height: 40vw;
  }
}


</style>
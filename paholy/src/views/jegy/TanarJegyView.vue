<script setup lang="ts">
import type { NewMark, MarkAttribute, Mark } from '@/api/jegyek/jegyek';
import { useAddMark, usegetGroupMarks, useGetGroupMembers, useGetSubjects, useGetTeacherGroups } from '@/api/jegyek/jegyekQuery';
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const NewMarkRef = ref<NewMark>({
    StudentId: 0,
    subject: '',
    mark: 0,
    markmultiplier: 100, 
})

const {data} = useGetTeacherGroups()
const groupMarks = usegetGroupMarks()
const {push} = useRouter()
const {back} = useRouter()
const {mutate, isPending} = useAddMark()

const tab = ref<string>("one");

// Kiválasztott tantárgy
const selectedGroup = ref<string | null>(null);
const selectedSubject = ref<string | null>(null);

// Egyedi tantárgyak listázása
const csoportok = computed(() => {
  if (!data.value) return [];
  return [...new Set(data.value.map((csoport: any) => csoport.name))];
});

const csoportJegyek = computed(() => {
  if (!data.value) return [];
  if (!selectedGroup.value) return data.value;
  return groupMarks.data.value?.find((csoport: any) => csoport.groupName === selectedGroup.value);
});

const tantargyJegyek = computed(() => {
  if (!data.value) return [];
  //console.log("DATA")
  //console.log(data.value)
  if (!csoportJegyek.value) return [];
  //console.log("JEGYEK")
  //console.log(csoportJegyek.value)
  if (!selectedSubject.value) return [];
  //console.log("SUBJECT")
  //console.log(selectedSubject.value)
  //console.log(csoportJegyek.value.tantargyak.indexOf(selectedSubject.value))
  return csoportJegyek.value?.marks[csoportJegyek.value.tantargyak.indexOf(selectedSubject.value)];
});

// stackoverflow sponzor
const groupBy = <T, K extends keyof any>(arr: T[], key: (i: T) => K) =>
  arr.reduce((groups, item) => {
    (groups[key(item)] ||= []).push(item);
    return groups;
  }, {} as Record<K, T[]>);

const szemelyJegyek = computed(() => {
  if (!tantargyJegyek.value) return [];
  return groupBy(tantargyJegyek.value,i=>i?.studentID)
});

const selectedOsszGroup = ref<string | null>(null);
const selectedOsszTantargy = ref<string | null>(null);

const osszTantargy = useGetSubjects()

const osszTantargyComputed = computed(() => {
  if (!osszTantargy.data.value) return [];
  return [...new Set(osszTantargy.data.value?.map((lesson: any) => lesson.subjectName))];
});

const osszTag = useGetGroupMembers()

const osszTagComputed = computed(() => {
  if (!osszTag.data.value) return [];
  if (!selectedOsszGroup.value) return [];
  return osszTag.data.value?.find((group: any) => group.groupName === selectedOsszGroup.value)
});

const newMarks = ref<Object>({});

function adatOsszeszedes(){
  const tempMarks = [];

  for (let index = 0; index < osszTagComputed.value?.members.length; index++) {
    const element = osszTagComputed.value?.members[index];
    console.log(element)
    if(newMarks.value[index] == undefined)
    {
      continue
    }
    const newMark = ref<Mark>({
      ID:-1,
      studentID: element.ID, // Helyes azonosító hozzárendelés
      teacherID: -1,
      Value: newMarks.value[index],
      Multiplier: 100,
      subjectName: selectedOsszTantargy.value,
      date:Date.now().toString(),
    });
    tempMarks.push(newMark);
  }
  return tempMarks
}

const jegyFeltoltes = async () =>
{
  const adatok = adatOsszeszedes()
  for(let index = 0; index < adatok.length; index++){
      console.log(adatok[index].value)
      const valasz = mutate(adatok[index].value)
  }
  newMarks.value = ref<Object>({});
}


const range = ref([1, 5]); // Two handles, one at 1, one at 5

const honapLista = [9,10,11,12,1,2,3,4,5,6,7,8]
const honapNevLista = ["Szeptember","Október","November","December","Január","Február","Március","Április","Május","Június","Július","Augusztus"]

</script>

<template>
  <main>
      <v-navigation-drawer class="bg-secondary">
        <v-card style="margin-bottom: 10px;">
          <v-tabs v-model="tab">
            <v-tab value="one">Megtekintés</v-tab>
            <v-tab value="two">Beírás</v-tab>
          </v-tabs>
        </v-card>
        <v-card>
          <v-tabs-window v-model="tab">
            <v-tabs-window-item value="one">
              <v-list-item title="Szűrési szempontok: "></v-list-item>
              <v-divider></v-divider>
              <h3>Osztályok:</h3>
              <v-select
              v-if="csoportok.length>0"
              v-model="selectedGroup"
              :items="csoportok"
              label="Válasszon osztályt!"
              ></v-select>
              <v-card v-else>
                "Nincsenek megjeleníthető csoportok!"
              </v-card>
              <br>
              <h3>Tantárgyak:</h3>
              <v-select
               v-if="csoportJegyek?.tantargyak"
              v-model="selectedSubject"
              :items="csoportJegyek?.tantargyak"
              label="Válasszon tantárgyat!"
              ></v-select>
              <v-card v-else>
                "Nincsenek megjeleníthető tantárgyak!"
              </v-card>
              <br>
              <!--<h3>Érdemjegyek átlaga:</h3>
              <v-range-slider
                v-model="range"
                :min="1"
                :max="5"
                :step="0.1"
                show-ticks
                color="primary"
              class="mt-4"
              thumb-label
              ></v-range-slider>-->
            </v-tabs-window-item>
            <v-tabs-window-item value="two">
              <v-list-item title="Beállítások: "></v-list-item>
              <v-divider></v-divider>
              <h3>Osztályok:</h3>
              <v-select
              v-if="csoportok.length>0"
              v-model="selectedOsszGroup"
              :items="csoportok"
              label="Válasszon osztályt!"
              ></v-select>
              <v-card v-else>
                "Nincsenek megjeleníthető csoportok!"
              </v-card>
              <br>
              <h3>Tantárgyak:</h3>
              <v-select
              v-if="osszTantargyComputed?.length>0"
              v-model="selectedOsszTantargy"
              :items="osszTantargyComputed"
              label="Válasszon tantárgyat!"
              ></v-select>
              <v-card v-else>
                "Nincsenek megjeleníthető csoportok!"
              </v-card>
              <br>
              <!--<h3>Érdemjegyek átlaga:</h3>
              <v-range-slider
                v-model="range"
                :min="1"
                :max="5"
                :step="0.1"
                show-ticks
                color="primary"
              class="mt-4"
              thumb-label
              ></v-range-slider>-->
            </v-tabs-window-item>
        </v-tabs-window>
      </v-card>
    </v-navigation-drawer>
    <v-tabs-window v-model="tab">
      <v-tabs-window-item value="one">
        <v-table  height="40vw" style="border-radius: 2%;" v-if="groupMarks.data != undefined">
          <thead>
            <tr>
                <th style="width: 15vw; justify-content: center !important; " class="text-center">Név</th>
                <th style="width: 15vw; justify-content: center !important; " class="text-center" v-for="(honapNev) in honapNevLista">{{honapNev}}</th>
              </tr>
          </thead>
          <tbody>
            <tr v-for="(record, index) in szemelyJegyek" :key="index" v-if="szemelyJegyek!=undefined">
              <td style="width: 15vw; justify-content: center !important;" class="bg-secondary">{{ record[0].Student?.name }}</td>
              <td style="width: 15vw; justify-content: center !important;" v-for="(honap) in honapLista">
                <p v-for="(jegy, index2) in record.filter((jegy:any)=>new Date(jegy.date).getMonth()+1 == honap)" :key="index2">
                  <v-hover
                    v-slot="{ isHovering, props }"
                  >
                    <v-card v-bind="props" class="bg-secondary">
                      <v-card-text class="bg-secondary" v-if="isHovering == false||isHovering == undefined" style="justify-self: center;">
                        {{ jegy.Value }}
                      </v-card-text>
                      <v-card-text class="bg-secondary" v-else>
                        id:{{ jegy.studentID }}
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
      </v-tabs-window-item>
      <v-tabs-window-item value="two">
        <v-table  height="40vw" style="border-radius: 2%;">
          <thead>
            <tr>
              <th class="text-center">Név</th>
              <th class="text-center">Jegy</th>
            </tr>
          </thead>
          <tbody class="secondary">
            <tr v-for="(record, index) in osszTagComputed?.members" :key="index">
              <td style="width: 15vw; text-align: center !important; font-size: large" class="border border-s-lg">{{ record.name }}</td>
              <td style="width: 15vw; text-align: center !important; font-size: large" class="border border-s-lg">
                <v-radio-group inline v-model="newMarks[index]" label="Add meg a jegyet:" style="justify-self: center;">
                  <v-radio label="1" :value="1"></v-radio>
                  <v-radio label="2" :value="2"></v-radio>
                  <v-radio label="3" :value="3"></v-radio>
                  <v-radio label="4" :value="4"></v-radio>
                  <v-radio label="5" :value="5"></v-radio>
                </v-radio-group>
              </td>
            </tr>
          </tbody>
        </v-table>
        <br>
        <v-btn @click="jegyFeltoltes()" v-if="selectedOsszGroup&&selectedOsszTantargy" class="appnavbarmenu">Jegyek felvitele</v-btn>
      </v-tabs-window-item>
    </v-tabs-window>
  </main>
</template>

<style lang="css">
.targetelement:hover {
  cursor: pointer;
}
.secondary{
  background-color: rgb(var(--v-theme-secondary)) !important;
}
</style>
  
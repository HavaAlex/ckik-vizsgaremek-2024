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

const szemelyJegyek = computed(() => {
  if (!tantargyJegyek.value) return [];
  return tantargyJegyek.value.reduce((acc: Record<string, any[]>, jegy: any) => {
    if (!acc[jegy.studentId]) {
      acc[jegy.studentId] = [];
    }
    acc[jegy.studentId].push(jegy);
    return acc;
  }, {});
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
      const valasz = mutate(adatok[index].value)
  }
  newMarks.value = ref<Object>({});
}


const range = ref([1, 5]); // Two handles, one at 1, one at 5

</script>

<template>
  <main>
    <h1>Osztályzatok</h1>

      <v-navigation-drawer theme="dark">
        <v-card>
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
              v-model="selectedGroup"
              :items="csoportok"
              label="Válasszon osztályt!"
              ></v-select>
              <br>
              <h3>Tantárgyak:</h3>
              <v-select
              v-model="selectedSubject"
              :items="csoportJegyek?.tantargyak"
              label="Válasszon tantárgyat!"
              ></v-select>
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
            </v-tabs-window-item>
            <v-tabs-window-item value="two">
              <v-list-item title="Beállítások: "></v-list-item>
              <v-divider></v-divider>
              <h3>Osztályok:</h3>
              <v-select
              v-model="selectedOsszGroup"
              :items="csoportok"
              label="Válasszon osztályt!"
              ></v-select>
              <br>
              <h3>Tantárgyak:</h3>
              <v-select
              v-model="selectedOsszTantargy"
              :items="osszTantargyComputed"
              label="Válasszon tantárgyat!"
              ></v-select>
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
            </v-tabs-window-item>
        </v-tabs-window>
      </v-card>
    </v-navigation-drawer>
    <v-tabs-window v-model="tab">
      <v-tabs-window-item value="one">
        <v-table theme="dark" height="40vw" style="border-radius: 2%;">
          <thead>
            <tr>
                <th style="width: 15vw; justify-content: center !important; " class="text-center">Név</th>
                <th style="width: 15vw; justify-content: center !important; " class="text-center">Szeptember</th>
                <th style="width: 15vw; justify-content: center !important; " class="text-center">Október</th>
                <th style="width: 15vw; justify-content: center !important; " class="text-center">November</th>
                <th style="width: 15vw; justify-content: center !important; " class="text-center">December</th>
                <th style="width: 15vw; justify-content: center !important; " class="text-center">Január</th>
                <th style="width: 15vw; justify-content: center !important; " class="text-center">Február</th>
                <th style="width: 15vw; justify-content: center !important; " class="text-center">Március</th>
                <th style="width: 15vw; justify-content: center !important; " class="text-center">Április</th>
                <th style="width: 15vw; justify-content: center !important; " class="text-center">Május</th>
                <th style="width: 15vw; justify-content: center !important; " class="text-center">Június</th>
                <th style="width: 15vw; justify-content: center !important; " class="text-center">Július</th>
                <th style="width: 15vw; justify-content: center !important; " class="text-center">Augusztus</th>
              </tr>
          </thead>
          <tbody>
            <tr v-for="(record, index) in szemelyJegyek" :key="index">
              <td style="width: 15vw; justify-content: center !important;">{{ record[0].Student?.name }}</td>
              <td style="width: 15vw; justify-content: center !important;" v-for="(jegy, index) in record" :key="index"><p v-if="new Date(jegy.date).getMonth()+1 == 9">{{ jegy.Value }}</p></td>
              <td style="width: 15vw; justify-content: center !important;" v-for="(jegy, index) in record" :key="index"><p v-if="new Date(jegy.date).getMonth()+1 == 10">{{ jegy.Value }}</p></td>
              <td style="width: 15vw; justify-content: center !important;" v-for="(jegy, index) in record" :key="index"><p v-if="new Date(jegy.date).getMonth()+1 == 11">{{ jegy.Value }}</p></td>
              <td style="width: 15vw; justify-content: center !important;" v-for="(jegy, index) in record" :key="index"><p v-if="new Date(jegy.date).getMonth()+1 == 12">{{ jegy.Value }}</p></td>
              <td style="width: 15vw; justify-content: center !important;" v-for="(jegy, index) in record" :key="index"><p v-if="new Date(jegy.date).getMonth()+1 == 1">{{ jegy.Value }}</p></td>
              <td style="width: 15vw; justify-content: center !important;" v-for="(jegy, index) in record" :key="index"><p v-if="new Date(jegy.date).getMonth()+1 == 2">{{ jegy.Value }}</p></td>
              <td style="width: 15vw; justify-content: center !important;" v-for="(jegy, index) in record" :key="index"><p v-if="new Date(jegy.date).getMonth()+1 == 3">{{ jegy.Value }}</p></td>
              <td style="width: 15vw; justify-content: center !important;" v-for="(jegy, index) in record" :key="index"><p v-if="new Date(jegy.date).getMonth()+1 == 4">{{ jegy.Value }}</p></td>
              <td style="width: 15vw; justify-content: center !important;" v-for="(jegy, index) in record" :key="index"><p v-if="new Date(jegy.date).getMonth()+1 == 5">{{ jegy.Value }}</p></td>
              <td style="width: 15vw; justify-content: center !important;" v-for="(jegy, index) in record" :key="index"><p v-if="new Date(jegy.date).getMonth()+1 == 6">{{ jegy.Value }}</p></td>
              <td style="width: 15vw; justify-content: center !important;" v-for="(jegy, index) in record" :key="index"><p v-if="new Date(jegy.date).getMonth()+1 == 7">{{ jegy.Value }}</p></td>
              <td style="width: 15vw; justify-content: center !important;" v-for="(jegy, index) in record" :key="index"><p v-if="new Date(jegy.date).getMonth()+1 == 8">{{ jegy.Value }}</p></td>
            </tr>
          </tbody>
        </v-table>
      </v-tabs-window-item>
      <v-tabs-window-item value="two">
        <v-table theme="dark" height="40vw" style="border-radius: 2%;">
          <thead>
            <tr>
              <th class="text-center">Név</th>
              <th class="text-center">Jegy</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(record, index) in osszTagComputed?.members" :key="index">
              <td style="width: 15vw; justify-content: center !important;">{{ record.name }}</td>
              <td style="width: 15vw; justify-content: center !important;">
                {{ newMarks[index] }}
                <v-radio-group inline v-model="newMarks[index]" label="Add meg a jegyet:">
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
  
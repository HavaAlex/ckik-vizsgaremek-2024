<script setup lang="ts">
import type { NewMark, MarkAttribute, Mark } from '@/api/jegyek/jegyek';
import { useAddMark, useGetGroupMarks, useGetGroupMembers, useGetSubjects, useGetTeacherGroups } from '@/api/jegyek/jegyekQuery';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const NewMarkRef = ref<NewMark>({
    StudentId: 0,
    subject: '',
    mark: 0,
    markmultiplier: 100, 
})

const {data} = useGetTeacherGroups()
const {data:groupMarks} = useGetGroupMarks()
const {mutate} = useAddMark()

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
  if (!data.value) return undefined;
  if (!selectedGroup.value) return undefined;
  return groupMarks.value?.find((csoport: any) => csoport.groupName === selectedGroup.value);
});

const tantargyJegyek = computed(() => {
  if (!data.value) return [];

  if (!csoportJegyek.value) return [];

  if (!selectedSubject.value) return [];

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
  return groupBy(tantargyJegyek.value,(i:any)=>i.studentID)
});

const selectedOsszGroup = ref<string>('');
const selectedOsszTantargy = ref<string>('');

const osszTantargy = useGetSubjects()

const osszTantargyComputed = computed(() => {
  if (!osszTantargy.data.value) return[];
  return [...new Set(osszTantargy.data.value?.map((lesson: any) => lesson.subjectName))];
});

const osszTag = useGetGroupMembers()


const osszTagComputed = computed(() => {
  if (!osszTag.data.value) return  {groupName:"Nincs",members:[]};
  if (!selectedOsszGroup.value) return  {groupName:"Nincs",members:[]};
  return osszTag.data.value?.find((group: any) => group.groupName === selectedOsszGroup.value)??{groupName:"Nincs",members:[]};
});

const newMarks = ref<any>({});

function adatOsszeszedes(){
  const tempMarks = [];

  for (let index = 0; index < osszTagComputed.value?.members.length; index++) {
    const element = osszTagComputed.value?.members[index];
    if(newMarks.value[index] == undefined)
    {
      continue
    }
    const newMark = ref<Mark>({
      ID:-1,
      studentID:Number(element.ID), // Helyes azonosító hozzárendelés
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
  newMarks.value = ref<any>({});
}


const range = ref([1, 5]); // Two handles, one at 1, one at 5

const honapLista = [9,10,11,12,1,2,3,4,5,6,7,8]
const honapNevLista = ["Szeptember","Október","November","December","Január","Február","Március","Április","Május","Június","Július","Augusztus"]

//itt kezdődik a forgatásnak a figyelése
const isPortrait = ref(window.matchMedia("(orientation: portrait)").matches);
const updateOrientation = () => {
  isPortrait.value = window.matchMedia("(orientation: portrait)").matches;
};
onMounted(() => {
  window.matchMedia("(orientation: portrait)").addEventListener("change", updateOrientation);
});
onUnmounted(() => {
  window.matchMedia("(orientation: portrait)").removeEventListener("change", updateOrientation);
});//itt ér véget

const drawer = ref<boolean>(false)


</script>

<template>
  <main>
    <div v-if="isPortrait">
      <v-app-bar class="border-t-lg" color="primary"  density="compact">
          <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
          <v-toolbar-title style="height: min-content">Opciók</v-toolbar-title>
      </v-app-bar>
      <v-navigation-drawer class="bg-secondary" v-model="drawer" style="" :width="1000">
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
            </v-tabs-window-item>
        </v-tabs-window>
      </v-card>
      </v-navigation-drawer>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="one">
          <v-card>
          <v-card-item style="padding: 0; width: 100vw;">
          <v-expansion-panels>
            <template v-if="Object.keys(szemelyJegyek)?.length  > 0">
              <v-expansion-panel v-for="(record, index) in szemelyJegyek" :key="index">
                <v-expansion-panel-title>
                  {{ record[0].Student?.name }}
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
                      <tr v-for="jegy in record" :key="jegy.ID">
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
            <template v-else-if="Object.keys(szemelyJegyek).length == 0">
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
        </v-tabs-window-item>
        <v-tabs-window-item value="two">
          <v-card>
          <v-card-item style="padding: 0; width: 100vw;">
          <v-expansion-panels>
            <template v-if="Object.keys(osszTagComputed?.members)?.length > 0">
              <v-expansion-panel v-for="(record, index) in osszTagComputed?.members" :key="index">
                <v-expansion-panel-title>
                  {{record?.name}}<p v-if="newMarks[index]!=null">: {{ newMarks[index]}}</p>
                </v-expansion-panel-title>
                <div style="max-height: 75vw; overflow-y: auto;">
                <v-expansion-panel-text>
                  <v-card class="secondary"> 
                    <v-radio-group inline v-model="newMarks[index]" label="Add meg a jegyet:" style="justify-self: center;" >
                      <v-radio label="1" :value="1"></v-radio>
                      <v-radio label="2" :value="2"></v-radio>
                      <v-radio label="3" :value="3"></v-radio>
                      <v-radio label="4" :value="4"></v-radio>
                      <v-radio label="5" :value="5"></v-radio>
                    </v-radio-group>
                  </v-card>
                </v-expansion-panel-text>
                </div>
              </v-expansion-panel>
            </template>
            <template v-else-if="Object.keys(osszTagComputed?.members)?.length == 0">
              <v-card style=" padding: 1rem;">
                Nincs tanulója a csoportnak!
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
          <!---->
          <br>
          <v-btn @click="jegyFeltoltes()" v-if="selectedOsszGroup&&selectedOsszTantargy" class="appnavbarmenu">Jegyek felvitele</v-btn>
        </v-tabs-window-item>
      </v-tabs-window>
    </div>
    <div v-else>
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
            </v-tabs-window-item>
        </v-tabs-window>
      </v-card>
      </v-navigation-drawer>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="one">
          <v-table  height="40vw" style="border-radius: 2%;" v-if="groupMarks != undefined">
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
                          Jegy: {{ jegy.Value }} Tanár: {{ jegy.teacherID }} Százalék: {{ jegy.Multiplier }}% Dátum: {{ new Date(jegy.date).getFullYear()+'.'+(new Date(jegy.date).getMonth()+1)+'.'+new Date(jegy.date).getDate() }}
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
          <v-table  height="26vw" style="border-radius: 2%;">
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
    </div>
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
  
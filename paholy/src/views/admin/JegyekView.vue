<script setup lang="ts">
import { useDeleteMark, useGetAllGroups, useGetAllMarks } from '@/api/admin/adminQuery';
import type { NewMark, MarkAttribute, Mark } from '@/api/jegyek/jegyek';
import { useAddMark, useGetGroupMarks, useGetGroupMembers, useGetSubjects, useGetTeacherGroups } from '@/api/jegyek/jegyekQuery';
import queryClient from '@/lib/queryClient';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fa } from 'vuetify/locale';

const {data} = useGetAllGroups()
const {data:groupMarks} = useGetAllMarks()
const {mutate:deleteMark} = useDeleteMark()

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

const groupBy = <T, K extends keyof any>(arr: T[], key: (i: T) => K) =>
  arr.reduce((groups, item) => {
    (groups[key(item)] ||= []).push(item);
    return groups;
  }, {} as Record<K, T[]>);

const szemelyJegyek = computed(() => {
  if (!tantargyJegyek.value) return [];
  return groupBy(tantargyJegyek.value,(i:any)=>i.studentID)
});

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

const markDialog = ref<boolean>(false)

const selectedMark = ref<Mark>({
  ID: 0,
  teacherID: 0,
  studentID: 0,
  Value: 0,
  Multiplier: 0,
  subjectName: '',
  date: ''
})

function openMark(mark: Mark) {
  markDialog.value = true
  selectedMark.value = mark;
  console.log(selectedMark.value)
}

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
                        <td class="text-center" @click="openMark(jegy)">
                          <v-card class="secondary" style="width: 20vw; justify-self: center;" >
                            <v-card-text>
                              {{ jegy.Value }}
                            </v-card-text>
                          </v-card>
                        </td>
                        <td class="text-center" @click="openMark(jegy)">
                          <v-card class="secondary" style="width: 20vw; justify-self: center;" >
                            <v-card-text>
                              {{ jegy.Multiplier }}%
                            </v-card-text>
                          </v-card>
                        </td>
                        <td class="text-center" @click="openMark(jegy)">
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
      </v-tabs-window>
    </div>
    <div v-else>
      <v-navigation-drawer class="bg-secondary">
        <v-card style="margin-bottom: 10px;">
          <v-tabs v-model="tab">
            <v-tab value="one">Megtekintés</v-tab>
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
                        <v-card-text class="bg-secondary" v-else @click="openMark(jegy)">
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
      </v-tabs-window>
    </div>
    <template>
    <v-dialog v-model="markDialog" max-width="500px">
      <v-card>
        <v-card-title>
          Jegy törlése: (jegy: {{ selectedMark.Value }} | dátum: {{ new Date(selectedMark.date).getFullYear()+'.'+(new Date(selectedMark.date).getMonth()+1)+'.'+new Date(selectedMark.date).getDate() }})
        </v-card-title>
        <v-card-item>
          Biztosan törölni akarod ezt a jegyet?
        </v-card-item>
        <v-card-actions class="d-flex flex-column">
          <v-btn color="red" block @click="()=>{deleteMark(selectedMark.ID);markDialog = false}">Jegy törlése</v-btn>
          <v-btn color="grey" block @click="()=>{markDialog = false}">Bezárás</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
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
  
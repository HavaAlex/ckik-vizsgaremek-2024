<script setup lang="ts">
import type { Disruption, Teacher } from '@/api/admin/admin';
import { useGetAllGroups,useAddLessons, useGetAllTeachers, useModifyLesson, useAddDisruption, useDeleteLesson } from '@/api/admin/adminQuery';
import type { NewMark, MarkAttribute, Mark } from '@/api/jegyek/jegyek';
import { useAddMark, usegetGroupMarks, useGetGroupMembers, useGetSubjects, useGetTeacherGroups } from '@/api/jegyek/jegyekQuery';
import type { Group, Lesson } from '@/api/orarend/orarend';
import { useGetTeachers } from '@/api/orarend/orarendQuery';
import queryClient from '@/lib/queryClient';
import { useOrarendStore } from '@/stores/orarendStore';
import { QUERY_KEYS } from '@/utils/QueryKeys';
import { addWeeks, format, startOfWeek } from 'date-fns';
import { storeToRefs } from 'pinia';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import * as XLSX from 'xlsx';

const {data:csoportok} = useGetAllGroups()
const {data:tanarok} = useGetAllTeachers()
const { mutate: addLessons, } = useAddLessons();
const { mutate: modifyLesson } = useModifyLesson();
const { mutate: addDisruption } = useAddDisruption();
const { mutate: deleteLesson } = useDeleteLesson();


const computedCsoportok = computed(() =>{
  if(csoportok?.value&&selectedCsoport.value==-1)
  {
    selectedCsoport.value = csoportok?.value[0].ID
    NewLessonRef.value.groupID = csoportok?.value[0].ID
    const newWeekStart = format(currentWeekStart.value, 'yyyy-MM-dd');
    queryClient.refetchQueries({ queryKey: [QUERY_KEYS.getTimetable,newWeekStart] })
    orarendStore.orarendfeltoltAdmin(newWeekStart,selectedCsoport.value);
  }
  return csoportok?.value?? []
});

const computedTanarok = computed(() =>{
  if(tanarok?.value&&NewLessonRef.value.teacherID==-1)
  {
    NewLessonRef.value.teacherID = tanarok?.value[0].ID
  }
  return tanarok?.value?? []
});

const selectedCsoport= ref<number>(-1);

const NewLessonRef = ref<Lesson>({
    ID:-1,
    groupID: -1,
    teacherID: -1,
    start_Hour: 0,
    start_Minute: 0, 
    length:0,
    day:"hetfo",
    subjectName:"",
    excused:false,
})

const lessonCopy = ref<Lesson>({
    ID:-1,
    groupID: -1,
    teacherID: -1,
    start_Hour: 0,
    start_Minute: 0, 
    length:0,
    day:"hetfo",
    subjectName:"",
    excused:false,
});

const tab = ref<string>("one");

// stackoverflow sponzor
const groupBy = <T, K extends keyof any>(arr: T[], key: (i: T) => K) =>
  arr.reduce((groups, item) => {
    (groups[key(item)] ||= []).push(item);
    return groups;
  }, {} as Record<K, T[]>);

const newLessons = ref<Lesson[]>([]);

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

//ÓRAREND VIEW KEZDETE
const currentWeekStart = ref(startOfWeek(new Date(), { weekStartsOn: 1 }));
const days = [{name:"Hétfő",key:"hetfo"},{name:"Kedd",key:"kedd"},{name:"Szerda",key:"szerda"},{name:"Csütörtök",key:"csutortok"},{name:"Péntek",key:"pentek"},{name:"Szombat",key:"szombat"},{name:"Vasárnap",key:"vasarnap"},];
const dayKeys = ["hetfo", "kedd", "szerda", "csutortok", "pentek", "szombat", "vasarnap"];
const lessonColor = ref("#9c0913");

const startMinute = 300;  
const endMinute = 1440;
const totalMinutes = endMinute - startMinute;

const dayNames: Record<string, string> = {
  hetfo: "Hétfő",
  kedd: "Kedd",
  szerda: "Szerda",
  csutortok: "Csütörtök",
  pentek: "Péntek",
  szombat: "Szombat",
  vasarnap: "Vasárnap"
};

const timeTicks: number[] = [];
for (let t = startMinute; t <= endMinute; t += 15) {
  timeTicks.push(t);
}

const orarendStore = useOrarendStore()
const refs = storeToRefs(orarendStore)


const teachers = ref<Teacher[]>([]);

const teacherQuery = useGetTeachers();
watch(
  () => teacherQuery.data.value,
  (data) => {
    teachers.value = data || [];
  },
  { immediate: true }
);

function getTeacherName(teacherId: number): string {
  const teacher = teachers.value.find(t => t.ID === teacherId);
  return teacher ? teacher.name : teacherId.toString();
}

function changeWeek(weeks: number) {
  currentWeekStart.value = addWeeks(currentWeekStart.value, weeks);
  //const newWeekStart = format(currentWeekStart.value, 'yyyy-MM-dd');
  //queryClient.refetchQueries({ queryKey: [QUERY_KEYS.getTimetable,newWeekStart] })
  //orarendStore.orarendfeltoltAdmin(newWeekStart,selectedCsoport.value);
}

watch(
  currentWeekStart,
  (newWeekStart) => {
    if(selectedCsoport.value!=-1)
    {
      orarendStore.orarendfeltoltAdmin(format(newWeekStart, 'yyyy-MM-dd'),selectedCsoport.value);
    }
  },
  { immediate: true }
);
//ÓRAREND VIEW VÉGE

const lessons = ref<Lesson[]>([]);

const selectedFiles = ref<File[]>([]);

function removeLesson(index: number) {
  lessons.value.splice(index, 1);
}

function submitLessons() {
  if (!lessons.value.length) return;
  addLessons(lessons.value, {
    onSuccess: (response) => {
      console.log("addLessons response:", response);
      const textContent = JSON.stringify(response, null, 2);
      const blob = new Blob([textContent], { type: 'text/plain' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'addLessonsResponse.txt';
      link.click();
      URL.revokeObjectURL(link.href);
      lessons.value = [];
    },
    onError: (error) => {
      console.error("Error uploading lessons:", error);
    }
  });
}

function processFile(file: File): Promise<Lesson[]> {
  return new Promise((resolve, reject) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    if (extension === 'csv' || extension === 'txt') {
      reader.onload = () => {
        const text = reader.result as string;
        const delimiter = extension === 'txt' ? '\t' : ';';
        const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
        const rows = lines.map(line => line.split(delimiter));
        const validRows = rows.filter(cols => cols.length >= 4);
        const lessonsFromFile: Lesson[] = validRows.map(cols => ({
          ID:-1,
          groupID: Number(cols[0].trim()),
          teacherID: Number(cols[1].trim()),
          start_Hour: Number(cols[2].trim()),
          start_Minute: Number(cols[3].trim()),
          length: Number(cols[4].trim()),
          day: cols[5].trim(),
          subjectName: cols[6].trim(),
          excused:false,
        }));
        resolve(lessonsFromFile);
      };
      reader.readAsText(file);
    } else if (extension === 'xlsx') {
      reader.onload = () => {
        const data = reader.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const lessonsFromFile: Lesson[] = [];
        jsonData.forEach(row => {
          if (row && row.length >= 4) {
            lessonsFromFile.push({
              ID:-1,
              groupID: Number(String(row[0]).trim()),
              teacherID: Number(String(row[1]).trim()),
              start_Hour: Number(String(row[2]).trim()),
              start_Minute: Number(String(row[3]).trim()),
              length: Number(String(row[4]).trim()),
              day: String(row[5]).trim(),
              subjectName: String(row[6]).trim(),
              excused:false,
            });
          }
        });
        resolve(lessonsFromFile);
      };
      reader.readAsBinaryString(file);
    } else {
      resolve([]);
    }
  });
}

async function sendLessons() {
  if (selectedFiles.value.length) {
    for (const file of selectedFiles.value) {
      try {
        const lessonsFromFile = await processFile(file);
        lessons.value.push(...lessonsFromFile);
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
      }
    }
  }
  console.log("Lessons array:", lessons.value);
}

function addLesson() {
  lessons.value.push(NewLessonRef.value);
  NewLessonRef.value = {
      ID:-1,
      groupID: computedCsoportok.value[0].ID,
      teacherID: computedTanarok.value[0].ID,
      start_Hour: 0,
      start_Minute: 0, 
      length:0,
      day:"hetfo",
      subjectName:"",
      excused:false,
  }
}

const drawer = ref<boolean>(true)


const selectedLesson = ref<Lesson>();

const lessonDialog = ref<boolean>(false);

const disruptionDialog = ref<boolean>(false);

const modifyDialog = ref<boolean>(false);

const deleteDialog = ref<boolean>(false);


function openLesson(lesson: Lesson) {
  lessonDialog.value = true
  selectedLesson.value = lesson;
  lessonCopy.value = JSON.parse(JSON.stringify(lesson));
  lessonCopy.value.start_Hour = Math.floor(lessonCopy.value.start_Minute/60)
  lessonCopy.value.start_Minute = lessonCopy.value.start_Minute%60
}

function closeLesson() {
  lessonDialog.value = false
  selectedLesson.value = undefined;
}


function openDisruption() {
  disruptionDialog.value = true
}

function closeDisruption() {
  disruptionDialog.value = false
}

const disruptionDate = ref<string>(new Date().toISOString().split("T")[0]);

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
              <h3>Csoportok:</h3>
              <v-select
              v-if="computedCsoportok.length>0"
              v-model="selectedCsoport"
              item-title="name"
              item-value="ID"
              :items="computedCsoportok"
              label="Válasszon csoportot!"
              ></v-select>
              <v-card v-else>
                "Nincsenek megjeleníthető csoportok!"
              </v-card>
              <br>
            </v-tabs-window-item>
            <v-tabs-window-item value="two">
              <v-list-item title="Órarend felvitel: "></v-list-item>
              <v-divider></v-divider>
              <h3>Csoportok:</h3>
              <v-select
              v-if="computedCsoportok.length>0"
              v-model="computedCsoportok"
              :items="computedCsoportok"
              label="Válasszon osztályt!"
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
          </v-card-item>
          </v-card>
        </v-tabs-window-item>
        <v-tabs-window-item value="two">
          <v-card>
          <v-card-item style="padding: 0; width: 100vw;">
          </v-card-item>
          </v-card>
          <!---->
          <br>
        </v-tabs-window-item>
      </v-tabs-window>
    </div>
    <div v-else>
      <v-navigation-drawer class="bg-secondary" v-model="drawer">
        <v-card style="margin-bottom: 10px;">
          <v-tabs v-model="tab">
            <v-tab value="one">Megtekintés</v-tab>
            <v-tab value="two">Feltöltés</v-tab>
          </v-tabs>
        </v-card>
        <v-card>
          <v-tabs-window v-model="tab">
            <v-tabs-window-item value="one">
              <v-list-item title="Szűrési szempontok: "></v-list-item>
              <v-divider></v-divider>
              <h3>Csoportok:</h3>
              <v-select
              v-if="computedCsoportok.length>0"
              v-model="selectedCsoport"
              item-title="name"
              item-value="ID"
              :items="computedCsoportok"
              label="Válasszon csoportot!"
              @update:model-value="async (value) => { 
                console.log(format(currentWeekStart, 'yyyy-MM-dd'))
                const newWeekStart = format(currentWeekStart, 'yyyy-MM-dd');
                queryClient.refetchQueries({ queryKey: [QUERY_KEYS.getTimetable,newWeekStart] })
                orarendStore.orarendfeltoltAdmin(newWeekStart,selectedCsoport);
              }"
              ></v-select>
              <v-card v-else>
                "Nincsenek megjeleníthető csoportok!"
              </v-card>
              <br>
            </v-tabs-window-item>
            <v-tabs-window-item value="two">
              <v-list-item title="Órarend felvitel"></v-list-item>
  
            </v-tabs-window-item>
        </v-tabs-window>
      </v-card>
      </v-navigation-drawer>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="one">

            <!--ÓRAREND VIEW KEZDETE-->

            <div v-if="refs.lessons.value !== null">
              <div class="color-picker">
                <label for="lessonColor">Szín megváltoztatása:</label>
                <input type="color" id="lessonColor" v-model="lessonColor" />
              </div>

              <div class="week-navigation">
                <v-btn @click="changeWeek(-1)" color="primary">Előző hét</v-btn>
                <span>{{ format(currentWeekStart, 'yyyy-MM-dd') }}</span>
                <v-btn @click="changeWeek(1)" color="primary" >Következő hét</v-btn>
              </div>

              <div class="timetable-scrollable">
                <div class="timetable-container">
                  <div class="time-labels">
                    <div class="time-labels-header"></div>
                    <div class="time-labels-content">
                      <div
                        v-for="tick in timeTicks"
                        :key="tick"
                        :class="['time-tick', { 'hour-tick': tick % 60 === 0 }]"
                        :style="{ top: ((tick - startMinute) / totalMinutes * 100) + '%' }"
                      >
                        <span v-if="tick % 60 === 0" class="time-label-text">
                          {{ Math.floor(tick / 60) }}:00
                        </span>
                      </div>
                    </div>
                  </div>

                  <div class="days-container">
                    <div v-for="day in dayKeys" :key="day" class="day-column">
                      <div class="day-header">{{ dayNames[day] }}</div>
                      <div class="day-content">
                        <div class="grid-lines">
                          <div
                            v-for="tick in timeTicks"
                            :key="tick"
                            :class="['grid-line', { 'grid-hour': tick % 60 === 0 }]"
                            :style="{ top: ((tick - startMinute) / totalMinutes * 100) + '%' }"
                          ></div>
                        </div>
                        <div class="lessons-container">
                          <div
                            v-for="lesson in refs.lessons.value.filter(l => l.day === day)"
                            :key="lesson.ID"
                            class="lesson-block"
                            :style="{
                              top: ((lesson.start_Minute - startMinute) / totalMinutes * 100) + '%',
                              height: (lesson.length / totalMinutes * 100) + '%',
                              backgroundColor: lesson.excused 
                                ? (lesson.teacherID !== null ? 'orange' : 'red') 
                                : lessonColor
                            }"
                            @click="openLesson(lesson)"
                          >
                            <div>
                              <div>
                                <template v-if="lesson.teacherID === null">
                                  <s>{{ lesson.subjectName }}</s>
                                </template>
                                <template v-else>
                                  {{ lesson.subjectName }}
                                </template>
                              </div>
                              <div v-if="lesson.teacherID == null" style="font-size: 10px; margin-top: 4px;">
                                Elmarad
                              </div>
                              <div v-else-if="lesson.teacherID !== null" style="font-size: 10px; margin-top: 4px;">
                                Tanár: {{ lesson.Teacher.name }}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <v-card style="justify-content: center" v-else>
              <v-progress-circular indeterminate :size="37"></v-progress-circular>
            </v-card>



            <!--ÓRAREND VIEW VÉGE-->

            <template>
              <v-dialog v-model="lessonDialog" max-width="500px">
                <v-card>
                  <v-card-title>
                    Óra elnaplózása: {{ lessonCopy?.subjectName }}
                  </v-card-title>
                  <v-card-item>
                    <v-row>
                      <v-col cols="12">
                        <v-select
                          v-if="computedTanarok.length > 0"
                          v-model="lessonCopy.teacherID"
                          item-title="name"
                          item-value="ID"
                          :items="computedTanarok"
                          label="Órát tartó tanár"
                        ></v-select>
                        <v-card v-else>
                          "Nincsenek megjeleníthető tanárok!"
                        </v-card>
                      </v-col>
                      <v-col cols="12">
                        <v-select
                          v-if="computedCsoportok.length > 0"
                          v-model="lessonCopy.groupID"
                          item-title="name"
                          item-value="ID"
                          :items="computedCsoportok"
                          label="Csoport"
                        ></v-select>
                        <v-card v-else>
                          "Nincsenek megjeleníthető csoportok!"
                        </v-card>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field v-model="lessonCopy.start_Hour" label="Óra kezdete (óra)"></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field v-model="lessonCopy.start_Minute" label="Óra kezdete (perc)"></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field v-model="lessonCopy.length" label="Óra hossza (percben)"></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-select
                          v-model="lessonCopy.day"
                          item-title="name"
                          item-value="key"
                          :items="days"
                          label="Nap (héten melyik napon)"
                        ></v-select>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field v-model="lessonCopy.subjectName" label="Tantárgy" required></v-text-field>
                      </v-col>
                    </v-row>
                  </v-card-item>
                  <v-card-actions class="d-flex flex-column">
                    <v-btn color="yellow" block @click="()=>{openDisruption()}">Óra helyettesítése</v-btn>
                    <v-btn color="yellow" block @click="()=>{modifyDialog = true}">Óra módosítása</v-btn>
                    <v-btn color="red" block @click="()=>{deleteDialog = true}">Óra törlése</v-btn>
                    <v-btn color="grey" block @click="()=>{closeLesson();}">Bezárás</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </template>

            <template>
              <v-dialog v-model="disruptionDialog" max-width="500px">
                <v-card>
                  <v-card-title>
                    Óra elnaplózása: {{ lessonCopy?.subjectName }}
                  </v-card-title>
                  <v-card-item>
                    <v-row>
                      <v-col cols="12">
                        <v-text-field v-model="disruptionDate" label="Dátum(év,hónap,nap) vesszőkkel elválasztva"></v-text-field>
                      </v-col>
                    </v-row>
                  </v-card-item>
                  <v-card-actions class="d-flex flex-column">
                    <v-btn color="yellow" block @click="()=>{addDisruption({
                      ID:-1,
                      date:new Date(disruptionDate),
                      groupID: lessonCopy.groupID,
                      teacherID: lessonCopy.teacherID,
                      start_Hour: lessonCopy.start_Hour,
                      start_Minute: lessonCopy.start_Minute, 
                      length:lessonCopy.length,
                      day:lessonCopy.day,
                      subjectName:lessonCopy.subjectName
                    });closeDisruption();closeLesson(); }">Óra helyettesítése</v-btn>
                    <v-btn color="grey" block @click="closeDisruption">Bezárás</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </template>

            <template>
              <v-dialog v-model="deleteDialog" max-width="500px">
                <v-card>
                  <v-card-title>
                    Óra törlése: {{ lessonCopy?.subjectName }}
                  </v-card-title>
                  <v-card-text>
                    Biztosan törölni akarod?
                  </v-card-text>
                  <v-card-actions class="d-flex flex-column">
                    <v-btn color="red" block @click="()=>{deleteLesson(lessonCopy.ID);deleteDialog = false;closeLesson(); }">Óra törlése</v-btn>
                    <v-btn color="grey" block @click="deleteDialog = false">Nem</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </template>

            <template>
              <v-dialog v-model="modifyDialog" max-width="500px">
                <v-card>
                  <v-card-title>
                    Óra módosítása: {{ lessonCopy?.subjectName }}
                  </v-card-title>
                  <v-card-text>
                    Biztosan módosítani akarod?
                  </v-card-text>
                  <v-card-actions class="d-flex flex-column">
                    <v-btn color="yellow" block @click="()=>{modifyLesson(lessonCopy);modifyDialog = false;closeLesson(); }">Óra módosítása</v-btn>
                    <v-btn color="grey" block @click="modifyDialog = false">Nem</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </template>
        </v-tabs-window-item>
        <v-tabs-window-item value="two">
              <v-card>
                <v-card-title>Óra hozzáadás</v-card-title>
                <v-card-text>
                  <h1>Órák manuális hozzáadása:</h1>
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                        <v-select required
                        v-if="computedTanarok.length>0"
                        v-model="NewLessonRef.teacherID"
                        item-title="name"
                        item-value="ID"
                        :items="computedTanarok"
                        label="Órát tartó tanár"
                        ></v-select>
                        <v-card v-else>
                          "Nincsenek megjeleníthető tanárok!"
                        </v-card>
                      </v-col>
                      <v-col cols="12">
                        <v-select required
                        v-if="computedCsoportok.length>0"
                        v-model="NewLessonRef.groupID"
                        item-title="name"
                        item-value="ID"
                        :items="computedCsoportok"
                        label="Csoport"
                        ></v-select>
                        <v-card v-else>
                          "Nincsenek megjeleníthető csoportok!"
                        </v-card>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field v-model="NewLessonRef.start_Hour" label="Óra kezdete (óra)" required></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field v-model="NewLessonRef.start_Minute" label="Óra kezdete (perc)" required></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field v-model="NewLessonRef.length" label="Óra hossza (percben)" required></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-select required
                        v-model="NewLessonRef.day"
                        item-title="name"
                        item-value="key"
                        :items="days"
                        label="Nap (héten melyik napon)"
                        ></v-select>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field v-model="NewLessonRef.subjectName" label="Tantárgy" required></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-btn color="primary" @click="addLesson()">Óra feltöltése</v-btn>
                      </v-col>
                    </v-row>
                  </v-container>
                  
                  <h1>Órák fájlból történő feltöltése</h1>
                  <h3>Kizárólag txt, csv és xlsx fájlok tölthetők fel!</h3>
                  <h6>(A txt fájlban az adattagokat tabulátorral elválasztva kell megadni)</h6>
                  <v-file-input 
                    label="Fájlok feltöltése (egyszerre)"
                    multiple
                    v-model="selectedFiles"
                    accept=".txt, .csv, .xlsx"
                    show-size
                    counter
                  ></v-file-input>
                  <v-btn color="primary" :disabled="teachers.length === 0 && selectedFiles.length === 0" @click="sendLessons">Fájlok beolvasása</v-btn>
                </v-card-text>
                
                <v-card-text>
                  <h1>Bekerülő órák listája:</h1>
                  <v-list>
                    <v-list-item v-for="(lesson, index) in lessons" :key="index" @click="removeLesson(index)">
                      <v-list-item-title>{{ lesson.subjectName }} - {{ lesson.groupID }} - {{ lesson.teacherID }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-card-text>
                <v-card-actions>
                  <v-btn color="primary" @click="submitLessons">Feltöltés az adatbázisba</v-btn>
                </v-card-actions>
              </v-card>
          <!---->
          <br>
        </v-tabs-window-item>
      </v-tabs-window>
    </div>
  </main>
</template>


<style lang="css">
.bg-title {
  color: #000;
}

.timetable-scrollable {
  width: 100%;
  height: 1200px;
  max-height: max-content;
  overflow: auto;
}

.timetable-container {
  display: flex;
  min-width: 1000px;
  height: 100%;
  position: relative;
}

.time-labels {
  width: 60px;
  border-right: 1px solid #ccc;
  display: flex;
  flex-direction: column;
}
.time-labels-header {
  height: 30px;
  border-bottom: 1px solid #ccc;
}
.time-labels-content {
  position: relative;
  flex: 1;
}

.time-tick {
  position: absolute;
  left: 0;
  right: 0;
  border-top: 1px dashed #ddd;
  box-sizing: border-box;
}
.hour-tick {
  border-top: 2px solid #444;
}

.time-label-text {
  position: absolute;
  left: 5px;
  top: 0;
  transform: translateY(-50%);
  background-color: #fff;
  padding: 0 3px;
  font-size: 10px;
  border-radius: 3px;
  color: #000; 
}

.days-container {
  display: flex;
  flex: 1;
}

.day-column {
  flex: 0 0 250px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #ccc;
}

.day-header {
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-weight: bold;
  border-bottom: 1px solid #ccc;
  background-color: #f5f5f5;
  color: #000;
}

.day-content {
  position: relative;
  flex: 1;
  overflow: hidden;
}

.grid-lines {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}
.grid-line {
  position: absolute;
  left: 0;
  right: 0;
  border-top: 1px dashed #eee;
}
.grid-hour {
  border-top: 2px solid #444;
}

.lessons-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.lesson-block {
  position: absolute;
  left: 5px;
  right: 5px;
  color: #fff;
  padding: 2px 4px;
  border-radius: 3px;
  font-size: 12px;
  overflow: hidden;
  box-sizing: border-box;
}

.week-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  color: #000;
}
.week-navigation button {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}
.week-navigation span {
  font-weight: bold;
  color: #000; 
}

.color-picker label {
  color: #000;
}
</style>

  
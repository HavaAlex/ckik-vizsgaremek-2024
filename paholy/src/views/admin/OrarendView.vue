<script setup lang="ts">
import { useGetAllGroups } from '@/api/admin/adminQuery';
import type { NewMark, MarkAttribute, Mark } from '@/api/jegyek/jegyek';
import { useAddMark, usegetGroupMarks, useGetGroupMembers, useGetSubjects, useGetTeacherGroups } from '@/api/jegyek/jegyekQuery';
import type { Group, NewLesson, Teacher } from '@/api/orarend/orarend';
import { useGetTeachers } from '@/api/orarend/orarendQuery';
import queryClient from '@/lib/queryClient';
import { useOrarendStore } from '@/stores/orarendStore';
import { QUERY_KEYS } from '@/utils/QueryKeys';
import { addWeeks, format, startOfWeek } from 'date-fns';
import { storeToRefs } from 'pinia';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const {data:csoportok} = useGetAllGroups()
const computedCsoportok = computed(() => csoportok?.value ?? []);
const selectedCsoport= ref<number>(computedCsoportok.value[0]?.ID||-1);

const NewLessonRef = ref<NewLesson>({
    groupID: -1,
    teacherID: -1,
    start_Hour: 0,
    start_Minute: 0, 
    length:0,
    day:"",
    subjectName:""
})

const tab = ref<string>("one");

// stackoverflow sponzor
const groupBy = <T, K extends keyof any>(arr: T[], key: (i: T) => K) =>
  arr.reduce((groups, item) => {
    (groups[key(item)] ||= []).push(item);
    return groups;
  }, {} as Record<K, T[]>);

const newLessons = ref<NewLesson[]>([]);


const lessonUpload = async () =>
{
  for(let index = 0; index < newLessons.value.length; index++){
  }
  newLessons.value = [];
}


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
const days = ["hetfo", "kedd", "szerda", "csutortok", "pentek", "szombat", "vasarnap"];
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
  const teacher = teachers.value.find(t => t.id === teacherId);
  return teacher ? teacher.name : teacherId.toString();
}

function changeWeek(weeks: number) {
  currentWeekStart.value = addWeeks(currentWeekStart.value, weeks);
  const newWeekStart = format(currentWeekStart.value, 'yyyy-MM-dd');
  queryClient.refetchQueries({ queryKey: [QUERY_KEYS.getTimetable,newWeekStart] })
  orarendStore.orarendfeltoltAdmin(newWeekStart,selectedCsoport.value);
}

watch(
  currentWeekStart,
  (newWeekStart) => {
    orarendStore.orarendfeltoltAdmin(format(newWeekStart, 'yyyy-MM-dd'),selectedCsoport.value);
  },
  { immediate: true }
);
//ÓRAREND VIEW VÉGE

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
              <v-list-item title="Órarend felvitel: "></v-list-item>
              <v-divider></v-divider>
              <h3>Csoportok:</h3>
              <v-select
              v-if="computedCsoportok.length>0"
              v-model="selectedCsoport"
              item-title="name"
              item-value="ID"
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
          <v-card-item>

            <!--ÓRAREND VIEW KEZDETE-->
            <v-card style="border-radius: 10px; margin-bottom: 10px; margin-top: 620px;">
              <h1 style="padding: 10px;" class="bg-title">Órarend</h1>
            </v-card>

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
                                Teacher: {{ getTeacherName(lesson.teacherID) }}
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

  
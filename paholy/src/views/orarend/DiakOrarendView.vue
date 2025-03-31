<script setup lang="ts">
import type { Teacher } from '@/api/orarend/orarend';
import { useGetTeachers } from '@/api/orarend/orarendQuery';
import { ref, watch, onMounted, onUnmounted,computed } from 'vue';
import { format, startOfWeek, addWeeks , addDays} from 'date-fns';
import { useOrarendStore } from '@/stores/orarendStore';
import { storeToRefs } from 'pinia';

const currentWeekStart = ref(startOfWeek(new Date(), { weekStartsOn: 1 }));
const endOfWeek = computed(() => addDays(currentWeekStart.value, 6));
const dayKeys = ["hetfo", "kedd", "szerda", "csutortok", "pentek", "szombat", "vasarnap"];
const lessonColor = ref("#9c0913"); 


const portraitDayIndex = ref(0);
let currentDay = new Date().getDay();
currentDay = (currentDay === 0) ? 6 : currentDay - 1;
portraitDayIndex.value = currentDay;



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

const orarendStore = useOrarendStore();
const refs = storeToRefs(orarendStore);

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
  const newWeekStart = format(currentWeekStart.value, 'yyyy-MM-dd');
  const endOfWeek = computed(() => addDays(currentWeekStart.value, 6));
  orarendStore.orarendfeltolt(newWeekStart);
}

function showDay() {
  let date = new Date(currentWeekStart.value);
  date.setDate(date.getDate() + portraitDayIndex.value);
  return date;
}

function changeDay(direction: number) {
  console.log(dayKeys[portraitDayIndex.value]);
  if (direction === 1) {
    if (portraitDayIndex.value === 6) {
      portraitDayIndex.value = 0;
      changeWeek(1);
    } else {
      portraitDayIndex.value++;
    }
  } else {
    if (portraitDayIndex.value === 0) {
      portraitDayIndex.value = 6;
      changeWeek(-1);
    } else {
      portraitDayIndex.value--;
    }
  }
}

watch(
  currentWeekStart,
  (newWeekStart) => {
    orarendStore.orarendfeltolt(format(newWeekStart, 'yyyy-MM-dd'));
  },
  { immediate: true }
);

const isPortrait = ref(window.matchMedia("(orientation: portrait)").matches);
const updateOrientation = () => {
  isPortrait.value = window.matchMedia("(orientation: portrait)").matches;
};
onMounted(() => {
  window.matchMedia("(orientation: portrait)").addEventListener("change", updateOrientation);
});
onUnmounted(() => {
  window.matchMedia("(orientation: portrait)").removeEventListener("change", updateOrientation);
});
</script>

<template>
  <main>

    <div v-if="isPortrait">
      <v-card style="border-radius: 2%;">
        <v-card-title>Órarend</v-card-title>
        <v-card-text style="max-height: 100vw !important; overflow-y: auto;">
          <div v-if="refs.lessons.value !== null">
            <div class="color-picker">
              <label for="lessonColor">Szín megváltoztatása:</label>
              <input type="color" id="lessonColor" v-model="lessonColor" />
            </div>

            <div v-if="!isPortrait">
              <div class="week-navigation">
                <v-btn @click="changeWeek(-1)" color="primary">Előző hét</v-btn>
                <span>{{ format(currentWeekStart, 'yyyy-MM-dd') }} - {{ format(endOfWeek, 'yyyy-MM-dd') }}</span>
                <v-btn @click="changeWeek(1)" color="primary">Következő hét</v-btn>
              </div>
            </div>
            
            <div v-else>
              <div class="week-navigation">
                <v-btn @click="changeDay(-1)" color="primary">Előző nap</v-btn>
                <span>{{ format(showDay(), 'yyyy-MM-dd') }}</span>
                <v-btn @click="changeDay(1)" color="primary">Következő nap</v-btn>
              </div>
            </div>

            <div v-if="!isPortrait">
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
                                Tanár: {{ getTeacherName(lesson.teacherID) }}
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

            <div v-else>
              <div class="day-header-portrait">
                {{ dayNames[ dayKeys[portraitDayIndex] ] }}
              </div>

              <div class="timetable-scrollable">
                <div class="timetable-container">
                  <div class="time-labels">
                    <div class="time-labels-header-portrait"></div>
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
                            v-for="lesson in refs.lessons.value.filter(l => l.day === dayKeys[portraitDayIndex])"
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
        </v-card-text>
      </v-card>
    </div>
    <div v-else>
      <v-card style="border-radius: 2%;">
        <v-card-title>Órarend</v-card-title>
        <v-card-text style="max-height: 35vw; overflow-y: auto;">
          <div v-if="refs.lessons.value !== null">
            <div class="color-picker">
              <label for="lessonColor">Szín megváltoztatása:</label>
              <input type="color" id="lessonColor" v-model="lessonColor" />
            </div>

            <div v-if="!isPortrait">
              <div class="week-navigation">
                <v-btn @click="changeWeek(-1)" color="primary">Előző hét</v-btn>
                <span>{{ format(currentWeekStart, 'yyyy-MM-dd') }} - {{ format(endOfWeek, 'yyyy-MM-dd') }}</span>
                <v-btn @click="changeWeek(1)" color="primary">Következő hét</v-btn>
              </div>
            </div>
            
            <div v-else>
              <div class="week-navigation">
                <v-btn @click="changeDay(-1)" color="primary">Előző nap</v-btn>
                <span>{{ format(showDay(), 'yyyy-MM-dd') }}</span>
                <v-btn @click="changeDay(1)" color="primary">Következő nap</v-btn>
              </div>
            </div>

            <div v-if="!isPortrait">
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

            <div v-else>
              <div class="day-header-portrait">
                {{ dayNames[ dayKeys[portraitDayIndex] ] }}
              </div>

              <div class="timetable-scrollable">
                <div class="timetable-container">
                  <div class="time-labels">
                    <div class="time-labels-header-portrait"></div>
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
                            v-for="lesson in refs.lessons.value.filter(l => l.day === dayKeys[portraitDayIndex])"
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
                                Tanár: {{ getTeacherName(lesson.teacherID) }}
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
        </v-card-text>
      </v-card>
    </div>

    

    <RouterView></RouterView>
  </main>
</template>
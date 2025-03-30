<script setup lang="ts">
import type { Lesson, Teacher } from '@/api/orarend/orarend';
import { fetchOrarend } from '@/api/orarend/orarendQuery';
import { useGetStudentsInGroup, useAddAbsence,useGetAbsences } from '@/api/hianyzasok/hianyzasokQuery';
import type { Students } from '@/api/hianyzasok/hianyzasok';

import { ref, watch, onMounted, onUnmounted, computed } from 'vue';
import { format, startOfWeek, addWeeks } from 'date-fns';


const {mutate} = useAddAbsence()

const currentWeekStart = ref(startOfWeek(new Date(), { weekStartsOn: 1 }));
const dayKeys = ["hetfo", "kedd", "szerda", "csutortok", "pentek", "szombat", "vasarnap"];
const lessonColor = ref("#9c0913");
const currentTeacherId = 123;

const startMinute = 300;  
const endMinute = 1440;
const totalMinutes = endMinute - startMinute;


const absences = ref<any[]>([]);
const absenceQuery = useGetAbsences();
watch(
  () => absenceQuery.data.value,
  (data) => {
    absences.value = data || [];
  },
  { immediate: true }
);


const portraitDayIndex = ref(0);
let currentDay = new Date().getDay();
currentDay = (currentDay === 0) ? 6 : currentDay - 1;
portraitDayIndex.value = currentDay;

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

const lessons = ref<Lesson[]>([]);
async function orarendfeltolt(weekStart: string) {
  lessons.value = await fetchOrarend(weekStart);
}

function changeWeek(weeks: number) {
  currentWeekStart.value = addWeeks(currentWeekStart.value, weeks);
  const newWeekStart = format(currentWeekStart.value, 'yyyy-MM-dd');
  orarendfeltolt(newWeekStart);
}

watch(
  currentWeekStart,
  (newWeekStart) => {
    orarendfeltolt(format(newWeekStart, 'yyyy-MM-dd'));
  },
  { immediate: true }
);



const selectedLesson = ref<Lesson | null>(null);

const attendance = ref<{ [studentId: number]: { studentID: number; absent: boolean } }>({});

const students = ref<Students[]>([]);

const currentGroupID = ref<number | null>(null);


const { data: studentsData } = useGetStudentsInGroup(
  computed(() => currentGroupID.value),
  { enabled: computed(() => currentGroupID.value !== null) }
);

watch(studentsData, (newData) => {
  if (newData) {
    students.value = newData;
    if (selectedLesson.value) {
      newData.forEach(student => {
        if (!attendance.value[student.ID]) {
          attendance.value[student.ID] = { studentID: student.ID, absent: false };
        }
      });
    }
  }
});

function openAttendance(lesson: Lesson) {
  selectedLesson.value = lesson;
  currentGroupID.value = lesson.groupID;


  for (const student of students.value) {
    if (!attendance.value[student.ID]) {
      attendance.value[student.ID] = { studentID: student.ID, absent: false };
    }
  }
}

function submitAttendance() {
  if (!selectedLesson.value) return;

  
  console.log("Lesson:", selectedLesson.value);
  console.log("Attendance:", attendance.value);
  
  const absencesToPost = students.value.map((student) => {
    const isAbsent = attendance.value[student.ID]?.absent;


    let date = new Date(currentWeekStart.value); // Ensure it's a Date object

    date.setDate(date.getDate() + dayKeys.indexOf(selectedLesson.value.day));


    return {
      studentID: student.ID,
      teacherID: selectedLesson.value?.teacherID || currentTeacherId, 
      lessonID: selectedLesson.value.ID,
      date: date,
      absent: isAbsent ? true : false,
    };
  });

  absencesToPost.forEach((absence) => {
    if (absence.absent === true) {
      const valasz = mutate(absence)

      console.log("Valasz:", valasz);
      // itt kell a post
    }
  });

  closeAttendance();
}

function closeAttendance() {
  selectedLesson.value = null;
  attendance.value = [];
  currentGroupID.value = null;
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
    <v-card style="border-radius: 10px; margin-bottom: 10px; margin-top: 620px;">
      <h1 style="padding: 10px;" class="bg-title">Hiányzások beirása</h1>
    </v-card>

    <div v-if="lessons !== null">
      <div class="color-picker">
        <label for="lessonColor">Szín megváltoztatása:</label>
        <input type="color" id="lessonColor" v-model="lessonColor" />
      </div>

      <div v-if="!isPortrait">
        <div class="week-navigation">
          <v-btn @click="changeWeek(-1)" color="primary">Előző hét</v-btn>
          <span>{{ format(currentWeekStart, 'yyyy-MM-dd') }}</span>
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
                      v-for="lesson in lessons.filter(l => l.day === day && (!l.excused || (l.teacherID !== null && l.teacherID === currentTeacherId)))"
                      :key="lesson.ID"
                      class="lesson-block"
                      :style="{
                        top: ((lesson.start_Minute - startMinute) / totalMinutes * 100) + '%',
                        height: (lesson.length / totalMinutes * 100) + '%',
                        backgroundColor: lesson.excused ? 'orange' : lessonColor
                      }"
                      @click="openAttendance(lesson)"
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
                      v-for="lesson in lessons.filter(l => l.day === dayKeys[portraitDayIndex] && (!l.excused || (l.teacherID !== null && l.teacherID === currentTeacherId)))"
                      :key="lesson.ID"
                      class="lesson-block"
                      :style="{
                        top: ((lesson.start_Minute - startMinute) / totalMinutes * 100) + '%',
                        height: (lesson.length / totalMinutes * 100) + '%',
                        backgroundColor: lesson.excused ? 'orange' : lessonColor
                      }"
                      @click="openAttendance(lesson)"
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

    <transition name="fade">
      <div class="attendance-modal" v-if="selectedLesson">
        <div class="modal-content">
          <h2 class="modal-header">
            Óra elnaplózása: {{ selectedLesson.subjectName }}
          </h2>

          <div v-for="student in students" :key="student.ID" class="student-attendance">
            <span class="student-name">{{ student.name }}</span>
            <div class="attendance-options" v-if="attendance[student.ID]">
              <label>
                <input 
                  type="radio" 
                  :name="'attendance-' + student.ID" 
                  :value="false" 
                  v-model="attendance[student.ID].absent" 
                />
                Itt volt
              </label>
              <label>
                <input 
                  type="radio" 
                  :name="'attendance-' + student.ID" 
                  :value="true" 
                  v-model="attendance[student.ID].absent" 
                />
                Hiányzott
              </label>
            </div>
          </div>

          <div class="modal-buttons">
            <button class="submit-button" @click="submitAttendance">Óra elnaplózása</button>
            <button class="close-button" @click="closeAttendance">Bezárás</button>
          </div>
        </div>
      </div>
    </transition>
  </main>
</template>

<style lang="css" scoped> /* scoped kell hogy nem lehesson "rányomni" az orára másholl*/
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
  cursor: pointer;
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

/* Fade transition for modal appearance */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}


.attendance-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-content {
  background: #2c2c2c;
  padding: 20px;
  border-radius: 10px;
  width: 320px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  color: #f1f1f1;
}


.modal-header {
  margin-bottom: 15px;
  font-size: 18px;
  color: #ffffff;
  text-align: center;
}

.student-attendance {
  margin-bottom: 10px;
}
.student-name {
  color: #ffffff;
}
.attendance-options {
  display: flex;
  justify-content: space-around;
  margin-top: 5px;
}
.attendance-options label {
  color: #ffffff;
}

.modal-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
.submit-button {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
}
.close-button {
  background-color: #dc3545;
  color: #fff;
  border: none;
  padding: 8px 12px;
  border-radius: 5px;
  cursor: pointer;
}
</style>

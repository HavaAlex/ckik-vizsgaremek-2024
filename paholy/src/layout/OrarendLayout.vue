<script setup lang="ts">
import type { Lesson } from '@/api/orarend/orarend';
import { useGetOrarend } from '@/api/orarend/orarendQuery';
import { ref, watch } from 'vue';

const {data} = useGetOrarend()
console.log(data)

// Hungarian days of the week
const days =["hetfo", "kedd", "szerda", "csutortok", "pentek", "szombat", "vasarnap"];
const lessonColor = ref("#9c0913"); // Default to blue
// Time intervals
const startMinute = 300;
const endMinute = 1440;
const interval = 5;
// Reactive timetable
const timetable = ref<{ time: string; lessons: (string | null)[] }[]>([]);

function orarendfeltolt(lessons: Lesson[]) {
  let newTimetable = [];

  for (let index = startMinute; index < endMinute; index += interval) {
    let row = { 
      time: `${Math.floor(index / 60)}:${(index % 60).toString().padStart(2, '0')}`, 
      lessons: Array(days.length).fill(null) 
    };

    // Populate lessons in the correct column
    lessons.forEach((lesson) => {
      let lessonDayIndex = days.indexOf(lesson.day);
      if (
        lessonDayIndex !== -1 &&
        index >= lesson.start_Minute &&
        index <= lesson.start_Minute + lesson.length
      )  {
        row.lessons[lessonDayIndex] = lesson.subjectName;
      }
    });

    newTimetable.push(row);
  }

  timetable.value = newTimetable;
}

// Watch for changes in data and update timetable
watch(data, (newData) => {
  if (newData) {
    orarendfeltolt(newData);
  }
}, { immediate: false }); // Run immediately on first load

</script>

<template>
  
  <main>
    <v-card theme="dark" style="border-radius: 10px; border: 1px; margin-bottom: 10px;">
      <h1 style="padding: 10px;">Órarend</h1>
    </v-card>
    <div v-if="data != undefined">
      <div class="color-picker">
        <label for="lessonColor">Szín megváltoztatása:</label>
        <input type="color" id="lessonColor" v-model="lessonColor" />
      </div>
      <v-table theme="dark" class="orarendtabla"  fixed-header style="border-radius: 5%;">
        <thead>
          <tr>
            <th class="text-center">Idő</th>
            <th v-for="day in days" :key="day" class="text-center">{{ day }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in timetable" :key="index">
            <td class="text-center">{{ row.time }}</td>
            <td v-for="(lesson, dayIndex) in row.lessons" :key="dayIndex" class="text-center" :style="{ backgroundColor: lesson ? lessonColor : 'transparent' }">
              {{ lesson || "" }}
            </td>
          </tr>
        </tbody>
      </v-table>
    </div>
    <v-card style="justify-content: center" v-else>
      <v-progress-circular indeterminate :size="37"></v-progress-circular>
    </v-card>
    <RouterView></RouterView>
  </main>

</template>

<style lang="css">
/* Portrait mode */
@media (orientation: portrait) {
  main {
  width: 95vw;
  }
  .orarendtabla{
    height: 95vw;
  }
}

/* Landscape mode */
@media (orientation: landscape) {
  main {
  width: 80vw;
  }
  .orarendtabla{
    height: 40vw;
  }
}


</style>

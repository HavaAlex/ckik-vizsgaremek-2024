<script setup lang="ts">
import type { Lesson } from '@/api/orarend/orarend';
import { useGetOrarend } from '@/api/orarend/orarendQuery';
import { ref, watch } from 'vue';

const { data } = useGetOrarend(); // This is already an array

// Hungarian days of the week
const days =["hetfo", "kedd", "szerda", "csutortok", "pentek", "szombat", "vasarnap"];

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
      ) {
        if(row.lessons[lessonDayIndex-1] != lesson.subjectName){
          row.lessons[lessonDayIndex] = lesson.subjectName;
        }
        else{
          
        }

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
}, { immediate: true }); // Run immediately on first load

</script>

<template>
  
  <main>
    <v-table theme="dark" height="30vw" fixed-header style="border-radius: 5%;">
      <thead>
        <tr>
          <th class="text-center">Idő</th>
          <th v-for="day in days" :key="day" class="text-center">{{ day }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, index) in timetable" :key="index">
          <td class="text-center">{{ row.time }}</td>
          <td v-for="(lesson, dayIndex) in row.lessons" :key="dayIndex" class="text-center">
            {{ lesson || "" }}
          </td>
        </tr>
      </tbody>
    </v-table>
    <RouterView></RouterView>
  </main>

</template>

<style lang="css">
main {
  width: 80vw;

}

</style>

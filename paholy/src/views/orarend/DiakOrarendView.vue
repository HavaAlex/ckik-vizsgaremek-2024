<script setup lang="ts">
import type { Lesson } from '@/api/orarend/orarend';
import { fetchOrarend } from '@/api/orarend/orarendQuery';
import { ref, watch } from 'vue';
import { format, startOfWeek, addWeeks } from 'date-fns';
import { useOrarendStore } from '@/stores/orarendStore';
import { storeToRefs } from 'pinia';

const currentWeekStart = ref(startOfWeek(new Date(), { weekStartsOn: 1 }));
const days = ["hetfo", "kedd", "szerda", "csutortok", "pentek", "szombat", "vasarnap"];
const lessonColor = ref("#9c0913");

const startMinute = 300;  
const endMinute = 1440;
const totalMinutes = endMinute - startMinute;

const timeTicks: number[] = [];
for (let t = startMinute; t <= endMinute; t += 15) {
  timeTicks.push(t);
}

const orarendStore= useOrarendStore()
const refs = storeToRefs(orarendStore)

function changeWeek(weeks: number) {
  currentWeekStart.value = addWeeks(currentWeekStart.value, weeks);
  const newWeekStart = format(currentWeekStart.value, 'yyyy-MM-dd');
  orarendStore.orarendfeltolt(newWeekStart);
}

watch(currentWeekStart, (newWeekStart) => {
    orarendStore.orarendfeltolt(format(newWeekStart, 'yyyy-MM-dd'));
}, { immediate: true });
</script>

<template>
  <main>
    <v-card style="border-radius: 10px; margin-bottom: 10px; margin-top: 620px;">
      <h1 style="padding: 10px;" class="bg-title">Órarend</h1>
    </v-card>

    <div v-if="refs.lessons.value.length">
      <div class="color-picker">
        <label for="lessonColor">Szín megváltoztatása:</label>
        <input type="color" id="lessonColor" v-model="lessonColor" />
      </div>

      <div class="week-navigation">
        <button @click="changeWeek(-1)">Előző hét</button>
        <span>{{ format(currentWeekStart, 'yyyy-MM-dd') }}</span>
        <button @click="changeWeek(1)">Következő hét</button>
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

                <span
                  v-if="tick % 60 === 0"
                  class="time-label-text"
                >
                  {{ Math.floor(tick / 60) }}:00
                </span>
              </div>
            </div>
          </div>

          <div class="days-container">
            <div v-for="day in days" :key="day" class="day-column">
              <div class="day-header">{{ day }}</div>
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
                      backgroundColor: lessonColor
                    }"
                  >
                    {{ lesson.subjectName }}
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

    <RouterView></RouterView>
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

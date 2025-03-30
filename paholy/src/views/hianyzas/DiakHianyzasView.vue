<script setup lang="ts">
import { useGetHianyzasok, useGetLessons, useGetTeachers } from '@/api/hianyzasok/hianyzasokQuery';
import type { Teacher } from '@/api/hianyzasok/hianyzasok'; 
import { ref, watch,onMounted,onUnmounted } from 'vue';
import { computed } from 'vue';

const { data } = useGetHianyzasok();
const { data: lessons } = useGetLessons();


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
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString(); // Group by day only
}

function convertMinutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

function formatTimeRange(lessonID: number): string {
  const lesson = lessons.value && Array.isArray(lessons.value)
    ? lessons.value.find((lesson) => lesson.ID === lessonID)
    : null;

  if (!lesson) return "N/A";

  const startTime = convertMinutesToTime(lesson.start_Minute);
  const endTime = convertMinutesToTime(lesson.start_Minute + lesson.length);
  return `${startTime} - ${endTime}`;
}

function getSubjectName(lessonID: number): string {
  const lesson = lessons.value && Array.isArray(lessons.value)
    ? lessons.value.find((lesson) => lesson.ID === lessonID)
    : null;

  return lesson ? lesson.subjectName : "N/A";
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
});//itt ér véget



function formatExcused(excused: boolean): string {
  return excused ? 'Igazolva' : 'Igazolatlan';
}

const groupedAbsences = computed(() => {
  if (!data?.value) return {};
  
  return data.value.reduce((acc, absence) => {
    const dateKey = formatDate(absence.date);
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(absence);
    return acc;
  }, {} as Record<string, typeof data.value>);
});

</script>

<template>
  <main>
    <div v-if="isPortrait">
      <v-card>
        <v-card-title>Hiányzások</v-card-title>
        <v-card-text style="height: 80vw !important; overflow-y: auto;">
          <v-expansion-panels>
            <template v-if="Object.keys(groupedAbsences).length > 0">
              <v-expansion-panel v-for="(absences, date) in groupedAbsences" :key="date">
                <v-expansion-panel-title>
                  {{ date }} ({{ absences.length }} hiányzás)
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-table v-if="!isPortrait">
                    <thead>
                      <tr>
                        <th class="text-center">Tantárgy</th>
                        <th class="text-center">Időtartam</th>
                        <th class="text-center">Tanár</th>
                        <th class="text-center">Igazolás státusza</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="absence in absences" :key="absence.ID">
                        <td class="text-center">{{ getSubjectName(absence.lessonID) }}</td>
                        <td class="text-center">{{ formatTimeRange(absence.lessonID) }}</td>
                        <td class="text-center">{{ getTeacherName(absence.teacherID) }}</td>
                        <td class="text-center">{{ formatExcused(absence.excused) }}</td>
                      </tr>
                    </tbody>
                  </v-table>
                  <v-container v-else>
                    <v-row v-for="absence in absences" :key="absence.ID" class="mb-4">
                      <v-col>
                        <v-card>
                          <v-card-text>
                            <div><strong>Tantárgy:</strong> {{ getSubjectName(absence.lessonID) }}</div>
                            <div><strong>Időtartam:</strong> {{ formatTimeRange(absence.lessonID) }}</div>
                            <div><strong>Tanár:</strong> {{ getTeacherName(absence.teacherID) }}</div>
                            <div><strong>Igazolás státusza:</strong> {{ formatExcused(absence.excused) }}</div>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </template>
            <template v-else-if="Object.keys(groupedAbsences).length == 0">
              <v-card style=" padding: 1rem;">
                Nincs még hiányzás
              </v-card>
            </template>
            <template v-else>
              <v-card style="display: flex; justify-content: center;">
                <v-progress-circular indeterminate :size="37"></v-progress-circular>
              </v-card>
            </template>
          </v-expansion-panels>
        </v-card-text>
      </v-card>
    </div>
    <div v-else>
      <v-card>
        <v-card-title>Hiányzások</v-card-title>
        <v-card-text style="height: 30vw !important; overflow-y: auto;">
          <v-expansion-panels>
            <template v-if="Object.keys(groupedAbsences).length > 0">
              <v-expansion-panel v-for="(absences, date) in groupedAbsences" :key="date">
                <v-expansion-panel-title>
                  {{ date }} ({{ absences.length }} hiányzás)
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-table v-if="!isPortrait">
                    <thead>
                      <tr>
                        <th class="text-center">Tantárgy</th>
                        <th class="text-center">Időtartam</th>
                        <th class="text-center">Tanár</th>
                        <th class="text-center">Igazolás státusza</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="absence in absences" :key="absence.ID">
                        <td class="text-center">{{ getSubjectName(absence.lessonID) }}</td>
                        <td class="text-center">{{ formatTimeRange(absence.lessonID) }}</td>
                        <td class="text-center">{{ getTeacherName(absence.teacherID) }}</td>
                        <td class="text-center">{{ formatExcused(absence.excused) }}</td>
                      </tr>
                    </tbody>
                  </v-table>
                  <v-container v-else>
                    <v-row v-for="absence in absences" :key="absence.ID" class="mb-4">
                      <v-col>
                        <v-card>
                          <v-card-text>
                            <div><strong>Tantárgy:</strong> {{ getSubjectName(absence.lessonID) }}</div>
                            <div><strong>Időtartam:</strong> {{ formatTimeRange(absence.lessonID) }}</div>
                            <div><strong>Tanár:</strong> {{ getTeacherName(absence.teacherID) }}</div>
                            <div><strong>Igazolás státusza:</strong> {{ formatExcused(absence.excused) }}</div>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </template>
            <template v-else-if="Object.keys(groupedAbsences).length == 0">
              <v-card style=" padding: 1rem;">
                Nincs még hiányzás
              </v-card>
            </template>
            <template v-else>
              <v-card style="display: flex; justify-content: center;">
                <v-progress-circular indeterminate :size="37"></v-progress-circular>
              </v-card>
            </template>
          </v-expansion-panels>
        </v-card-text>
      </v-card>
    </div>
    
  </main>
</template>

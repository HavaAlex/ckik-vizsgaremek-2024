<script setup lang="ts">
import { useGetHianyzasok, useGetLessons, useGetTeachers } from '@/api/hianyzasok/hianyzasokQuery';
import { useGetAbsences, useGetStudents, useDeleteAbsence, useModifyAbsence} from '@/api/admin/adminQuery'

import type { Teacher } from '@/api/hianyzasok/hianyzasok';
import { ref, watch, onMounted, onUnmounted, computed } from 'vue';

const { data } = useGetHianyzasok();
const { data: lessons } = useGetLessons();
const { data: userList } = useGetStudents();
const { mutate: deleteAbsence } = useDeleteAbsence();
const { mutate: modifyAbsence } = useModifyAbsence();


const absences = ref<any[]>([]);
const absenceQuery = useGetAbsences();
watch(
  () => absenceQuery.data.value,
  (data) => {
    absences.value = data || [];
  },
  { immediate: true }
);

function formatExcused(excused: boolean): string {
  return excused ? 'Igazolva' : 'Igazolatlan';
}

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

function getStudentName(studentID: number): string {
  const student = userList.value.find(student => student.ID === studentID);
  console.log(student);
  return student ? student.OMID : studentID.toString();
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
});

// Updated grouping that works with the new replacement code – using absences.value
const groupedAbsences = computed(() => {
  if (!absences.value || absences.value.length === 0) return {};
  return absences.value.reduce((acc, absence) => {
    const dateKey = formatDate(absence.date);
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(absence);
    return acc;
  }, {} as Record<string, any[]>);
});
console.log("=============7")
console.log(groupedAbsences)
console.log("=============7")
const DeleteAbsenceDialog = ref(false);
const SelectedAbsence = ref<any>(null);


async function fastdelete(absence: any) {
  try {
    // const data = await getUser(user.ID);
    SelectedAbsence.value = { ...absence };
    
    DeleteAbsenceDialog.value = true;
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}

async function deleteAbsenceFunction() {

  console.log(SelectedAbsence.value.ID)
  await deleteAbsence(SelectedAbsence.value.ID, {
    onSuccess: (response) => {
      console.log("Deletion result:", response);
      absences.value = absences.value.filter(absence => absence.ID !== SelectedAbsence.value.ID);
      DeleteAbsenceDialog.value = false;
    }
  });
}

async function approval(absence: any) {
  const newAbsence = { ...absence, excused: !absence.excused };
  
  modifyAbsence(newAbsence, {
    onSuccess: () => {
      // Ensure reactivity by updating absences.value properly
      absences.value = absences.value.map(a => 
        a.ID === newAbsence.ID ? newAbsence : a
      );
    }
  });
}



</script>

<template>
  <main>
    <div v-if="isPortrait">
      <v-card>
        <v-card-title>Hiányzások</v-card-title>
          <v-card-text style="height: 80vw !important; overflow-y: auto;">
            <template v-if="Object.keys(groupedAbsences).length > 0">
        
              <!-- Wrap your expansion panels in v-expansion-panels -->
              <v-expansion-panels>
                <v-expansion-panel v-for="(absences, date) in groupedAbsences" :key="date">
                  <v-expansion-panel-title>
                    {{ date }} ({{ absences.length }} hiányzás)
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <!-- Replacement code inserted here -->
                    <v-table v-if="!isPortrait">
                      <thead>
                        <tr>
                          <th class="text-center">OMID</th>
                          <th class="text-center">Tantárgy</th>
                          <th class="text-center">Időtartam</th>
                          <th class="text-center">Tanár</th>
                          <th class="text-center">Igazolás státusza</th>
                          <th class="text-center">Interakció</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="absence in absences" :key="absence.ID">
                          <td class="text-center">{{ getStudentName(absence.studentID) }}</td>
                          <td class="text-center">{{ getSubjectName(absence.lessonID) }}</td>
                          <td class="text-center">{{ formatTimeRange(absence.lessonID) }}</td>
                          <td class="text-center">{{ getTeacherName(absence.teacherID) }}</td>
                          <td class="text-center">{{ formatExcused(absence.excused) }}</td>
                          <td>
                                <v-btn v-if="!absence.excused" color="green" style="margin-right: 10px;" @click="approval(absence)">Leigazolás</v-btn>
                                <v-btn v-else color="primary" style="margin-right: 10px;" @click="approval(absence)">Igazolás visszavonása</v-btn>
                                <v-btn color="error" @click="fastdelete(absence)">Törlés</v-btn>
                          </td>
                        </tr>
                      </tbody>
                    </v-table>
                    <v-container v-else>
                      <v-row v-for="absence in absences" :key="absence.ID" class="mb-4">
                        <v-col>
                          <v-card>
                            <v-card-text>
                              <div><strong>OMID:</strong> {{ getStudentName(absence.studentID) }}</div>
                              <div><strong>Tantárgy:</strong> {{ getSubjectName(absence.lessonID) }}</div>
                              <div><strong>Időtartam:</strong> {{ formatTimeRange(absence.lessonID) }}</div>
                              <div><strong>Tanár:</strong> {{ getTeacherName(absence.teacherID) }}</div>
                              <div><strong>Igazolás státusza:</strong> {{ formatExcused(absence.excused) }}</div>
                              <div>
                                <v-btn v-if="!absence.excused" color="primary" style="margin-right: 10px;" @click="approval(absence)">Leigazolás</v-btn>
                                <v-btn v-else color="primary" style="margin-right: 10px;" @click="approval(absence)">gazolás visszavonása</v-btn>
                                <v-btn color="error" @click="fastdelete(absence)">Törlés</v-btn>
                              </div>
                            </v-card-text>
                          </v-card>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </template>
            <template v-else-if="Object.keys(groupedAbsences).length == 0">
              <v-card style="padding: 1rem;">
                Nincs még hiányzás
              </v-card>
            </template>
          </v-card-text>
        </v-card>
    </div>
    <div v-else>
      <v-card>
        <v-card-title>Hiányzások</v-card-title>
        <v-card-text style="height: 40vw !important; overflow-y: auto;">
          <template v-if="Object.keys(groupedAbsences).length > 0">
      
            <!-- Wrap your expansion panels in v-expansion-panels -->
            <v-expansion-panels>
              <v-expansion-panel v-for="(absences, date) in groupedAbsences" :key="date">
                <v-expansion-panel-title>
                  {{ date }} ({{ absences.length }} hiányzás)
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <!-- Replacement code inserted here -->
                  <v-table v-if="!isPortrait">
                    <thead>
                      <tr>
                        <th class="text-center">OMID</th>
                        <th class="text-center">Tantárgy</th>
                        <th class="text-center">Időtartam</th>
                        <th class="text-center">Tanár</th>
                        <th class="text-center">Igazolás státusza</th>
                        <th class="text-center">Interakció</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="absence in absences" :key="absence.ID">
                        <td class="text-center">{{ getStudentName(absence.studentID) }}</td>
                        <td class="text-center">{{ getSubjectName(absence.lessonID) }}</td>
                        <td class="text-center">{{ formatTimeRange(absence.lessonID) }}</td>
                        <td class="text-center">{{ getTeacherName(absence.teacherID) }}</td>
                        <td class="text-center">{{ formatExcused(absence.excused) }}</td>
                        <td>
                              <v-btn v-if="!absence.excused" color="green" style="margin-right: 10px;" @click="approval(absence)">Leigazolás</v-btn>
                              <v-btn v-else color="primary" style="margin-right: 10px;" @click="approval(absence)">Igazolás visszavonása</v-btn>
                              <v-btn color="error" @click="fastdelete(absence)">Törlés</v-btn>
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
                  <v-container v-else>
                    <v-row v-for="absence in absences" :key="absence.ID" class="mb-4">
                      <v-col>
                        <v-card>
                          <v-card-text>
                            <div><strong>OMID:</strong> {{ getStudentName(absence.studentID) }}</div>
                            <div><strong>Tantárgy:</strong> {{ getSubjectName(absence.lessonID) }}</div>
                            <div><strong>Időtartam:</strong> {{ formatTimeRange(absence.lessonID) }}</div>
                            <div><strong>Tanár:</strong> {{ getTeacherName(absence.teacherID) }}</div>
                            <div><strong>Igazolás státusza:</strong> {{ formatExcused(absence.excused) }}</div>
                            <div>
                              <v-btn v-if="!absence.excused" color="primary" style="margin-right: 10px;" @click="approval(absence)">Leigazolás</v-btn>
                              <v-btn v-else color="primary" style="margin-right: 10px;" @click="approval(absence)">gazolás visszavonása</v-btn>
                              <v-btn color="error" @click="fastdelete(absence)">Törlés</v-btn>
                            </div>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </template>
          <template v-else-if="Object.keys(groupedAbsences).length == 0">
            <v-card style="padding: 1rem;">
              Nincs még hiányzás
            </v-card>
          </template>
        </v-card-text>
      </v-card>

    </div>

    <v-dialog v-model="DeleteAbsenceDialog" max-width="80vw" theme="dark">
        <v-card>
          <v-card-title>Biztos törölni akarja?</v-card-title>
          <v-card-actions>
            <v-btn @click="deleteAbsenceFunction()">Törlés</v-btn>
            <v-btn @click="DeleteAbsenceDialog = false">Mégse</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  </main>
</template>


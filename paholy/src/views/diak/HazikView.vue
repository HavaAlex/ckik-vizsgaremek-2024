<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { Assignment, OpenAssignment } from '@/api/hazik/hazik';
import { useUploadFiles, usegetAssignmentsStudent } from '@/api/hazik/hazikQuery';

const dialog = ref(false); // dialog for sending assignment
const successDialog = ref(false); // shows when submission is successful
const { mutate: uploadFiles } = useUploadFiles();
const { data: assignmentStudentList } = usegetAssignmentsStudent();


function formatDate(dateString: Date | string) {
  if (!dateString) return "";
  const dateObj = new Date(dateString);
  return dateObj.toISOString().slice(0, 19).replace("T", " ");
}
</script>

<template>
  <main>
    <h1>Az ön feladatai</h1>
    <v-table style="height: 30vw !important;">
      <thead>
        <tr>
          <th class="text-center" style="width: 10vw; justify-content: center;">Feladó tanár</th>
          <th class="text-center" style="width: 10vw; justify-content: center;">Határidő</th>
          <th class="text-center" style="width: 10vw; justify-content: center;">Feltöltési idő</th>
          <th class="text-center" style="width: 10vw; justify-content: center;">Leírás</th>
          <th class="text-center" style="width: 10vw; justify-content: center;">Státusz</th>
          <th class="text-center" style="width: 10vw; justify-content: center;">Interakció</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="feladat in assignmentStudentList">
          <td>{{ feladat.feladat.senderUserName.name }}</td>
          <td>{{ feladat.feladat.deadline }}</td>
          <td>{{ feladat.feladat.uploadDate }}</td>
          <td class="shortenedDesc">{{ feladat.feladat.desc }}</td>
          <td>{{ feladat.valasz.status }}</td>
        </tr>
      </tbody>
    </v-table>
  </main>
</template>
<style lang="css">
.shortenedDesc {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 10vw;
  display: inline-block;
}
</style>
<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { Assignment, OpenAssignment,THEULTIMATEASSIGNMENTTYPE,OpenCompletedAssignment } from '@/api/hazik/hazik';
import { useUploadFiles, usegetAssignmentsStudent, usemodifyCompletedAssignment} from '@/api/hazik/hazikQuery';
import { fa } from 'vuetify/locale';


const successDialog = ref(false); // shows when submission is successful
const { mutate: uploadFiles } = useUploadFiles();
const { mutate: modifyCompletedAssignment,isPending } = usemodifyCompletedAssignment();
const { data: assignmentStudentList } = usegetAssignmentsStudent();


function formatDate(dateString: Date | string) {
  if (!dateString) return "";
  const dateObj = new Date(dateString);
  return dateObj.toISOString().slice(0, 19).replace("T", " ");
}

// For viewing assignment details
const selectedAssignment = ref<OpenAssignment>({
    ID: -1,
    deadline: new Date("0000-00-00"),
    desc: "",
    teacherID: -1,
    uploadDate: new Date("0000-00-00"),
})

const openCompletedAssignment = ref<OpenCompletedAssignment>({
    ID: -1,
    assignmentID: -1,
    date:  new Date("0000-00-00"),
    status: "",
    studentID: -1,
    textAnswer: ""
})

const ViewAssignmentDialog = ref(false);
const openAssignmentViewDialog = (selected: OpenAssignment, complassignment: OpenCompletedAssignment) => {
  selectedAssignment.value = selected;
    // Create a mutable shallow copy of complassignment
    openCompletedAssignment.value = { ...complassignment };
    ViewAssignmentDialog.value = true;
    ViewAssignmentDialog.value = true;
};
function modositasmentese(){
  console.log("EZ LESZ elküldve")
  console.log(openCompletedAssignment)
  
  modifyCompletedAssignment(openCompletedAssignment.value, {
    onSuccess: async (assignmentResponse) => {

      console.log("*autistic scream* YIPEEEEEEEEEEEEEEEeee");
      console.log(assignmentResponse)
      ViewAssignmentDialog.value = false
    }
  });
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
          <v-btn @click="openAssignmentViewDialog(feladat.feladat,feladat.valasz)">Feladat megtekintése</v-btn>
        </tr>
      </tbody>
    </v-table>


    <v-dialog v-model="ViewAssignmentDialog" max-width="50vw" theme="dark">
      <v-card max-width="50vw">
        <v-card-title>Feladat részletei</v-card-title>
        <v-card-text>
          <p><strong>Feladás dátuma:</strong> {{ formatDate(selectedAssignment?.uploadDate) }}</p>
          <p><strong>Dátum:</strong> {{ formatDate(selectedAssignment?.deadline) }}</p>
          <p><strong>Leírás:</strong> {{ selectedAssignment?.desc }}</p>
          <p><strong>Az ön válasza:</strong></p>
          <v-textarea placeholder="Ide írhat" v-model="openCompletedAssignment.textAnswer"> {{ openCompletedAssignment.textAnswer }} </v-textarea>
          <p><strong>Utoljára módosítva: </strong>{{ formatDate(openCompletedAssignment.date) }}</p>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="ViewAssignmentDialog = false">Bezárás</v-btn>
          <v-btn @click="modositasmentese">Módosítás</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


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
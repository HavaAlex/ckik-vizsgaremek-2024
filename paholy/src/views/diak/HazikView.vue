<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { Assignment, OpenAssignment,OpenCompletedAssignment } from '@/api/hazik/hazik';
import { usegetAssignmentsStudent, usemodifyCompletedAssignment,usegetAssignmentFiles,useuploadCompletedAssignmentFiles} from '@/api/hazik/hazikQuery';
import { fa } from 'vuetify/locale';


const successDialog = ref(false); // shows when submission is successful
const { mutate: modifyCompletedAssignment,isPending } = usemodifyCompletedAssignment();
const { data: assignmentStudentList } = usegetAssignmentsStudent();
const { mutate: getAssignmentFiles } = usegetAssignmentFiles();
const { mutate: uploadCompletedAssignmentFiles } = useuploadCompletedAssignmentFiles();

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
const resetForm = () => {
console.log("KAKAKAAAAAA jo JAJAJAJKKAKAKAKA")
};
const assignmentFiles = ref<any[]>([]);
function modositasmentese(){
  modifyCompletedAssignment(openCompletedAssignment.value, {
    onSuccess: async (assignmentResponse) => {
      console.log("ez emgy fel   ", openCompletedAssignment.value)
      console.log("valast   ",assignmentResponse)
      const completedAssignmentID = assignmentResponse.ID;
      if (assignmentFiles.value.length > 0) {
        console.log("KINTIKINT")
        console.log(assignmentFiles)
        console.log(assignmentFiles.value)
        
        await uploadCompletedAssignmentFiles({ files: assignmentFiles.value , completedAssignmentId: completedAssignmentID }, {
          onSuccess: resetForm
        });

      } else {
        console.log("CUCUCUCUCUCUCUC")
      }
    }
  });
}

// Holds the files fetched for a given assignment


// Fetch assignment files (no change here except we confirm the response is an array of objects
// that include { ID, buffer, filename, mimetype, ... }):
const fetchAssignmentFiles = async (selectedAssignmentID: number) => {
  console.log("Fetching files for assignment:", selectedAssignmentID);
  await getAssignmentFiles(selectedAssignmentID, {
    onSuccess: async (response) => {
      console.log("Files fetched:", response);
      // Assign the array of files to our local reactive array
      assignmentFiles.value = response;
    }
  });
};

// Updated download function
// Use file.buffer.data, the file’s correct mimetype, and file.filename as the download name:
const downloadFile = (file: any) => {
  // Convert the array of bytes to a Uint8Array
  const byteArray = new Uint8Array(file.buffer.data);

  // Create a blob with the actual MIME type (if available)
  const blob = new Blob([byteArray], { type: file.mimetype || 'application/octet-stream' });

  // Create a temporary link element
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);

  // Download using the original filename (which should include the extension)
  link.download = file.filename;

  // Trigger the download and clean up
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};





</script>

<template>
  <main>
    <v-table style="height: 30vw !important;" >
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
          <v-btn @click="openAssignmentViewDialog(feladat.feladat,feladat.valasz),fetchAssignmentFiles(feladat.feladat.ID)">Feladat megtekintése</v-btn>
        </tr>
      </tbody>
    </v-table>


    <v-dialog v-model="ViewAssignmentDialog" max-width="50vw" >
      <v-card max-width="50vw">
        <v-card-title>Feladat részletei</v-card-title>
        <v-card-text>
          <p><strong>Feladás dátuma:</strong> {{ formatDate(selectedAssignment?.uploadDate) }}</p>
          <p><strong>Dátum:</strong> {{ formatDate(selectedAssignment?.deadline) }}</p>
          <p><strong>Leírás:</strong> {{ selectedAssignment?.desc }}</p>
          <!-- Inline file list (if any) -->
          <div v-if="assignmentFiles.length">
            <p><strong>Fájlok:</strong></p>
            <v-list-item
              v-for="(file, index) in assignmentFiles"
              :key="file.ID"
              @click="downloadFile(file)"
              style="cursor: pointer;"
            >
              <v-list-item-content>
                <!-- Display the file’s actual name (with extension) -->
                <v-list-item-title>{{ file.filename }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </div>
          <div v-else>
            <p><strong>Fájlok:</strong> Nincsenek fájlok ehhez a feladathoz.</p>
          </div>
          <p><strong>Az ön válasza:</strong></p>
          <v-textarea placeholder="Ide írhat" v-model="openCompletedAssignment.textAnswer"> {{ openCompletedAssignment.textAnswer }} </v-textarea>
          <v-file-input 
          label="Fájlok feltöltése (egyszerre töltse fel)"
          multiple
          v-model="assignmentFiles"
          show-size
          counter
        ></v-file-input>
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
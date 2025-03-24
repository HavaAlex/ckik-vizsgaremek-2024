<script setup lang="ts">
import { ref, computed,onMounted, onUnmounted  } from 'vue';
import type { Assignment, OpenAssignment, OpenCompletedAssignment } from '@/api/hazik/hazik';
import { usegetAssignmentsStudent, usemodifyCompletedAssignment, usegetAssignmentFiles,
   useuploadCompletedAssignmentFiles, usegetCompletedAssignmentFiles, usedeleteAnswerFile } from '@/api/hazik/hazikQuery';

const successDialog = ref(false); // shows when submission is successful
const { mutate: modifyCompletedAssignment, isPending } = usemodifyCompletedAssignment();
const { data: assignmentStudentList } = usegetAssignmentsStudent();
const { mutate: getAssignmentFiles } = usegetAssignmentFiles();
const { mutate: uploadCompletedAssignmentFiles } = useuploadCompletedAssignmentFiles();
const { mutate: getCompletedAssignmentFiles } = usegetCompletedAssignmentFiles();
const { mutate: deleteAnswerFile } = usedeleteAnswerFile();

function formatDate(dateString: Date | string | null) {
  if (!dateString) return "";
  const date = new Date(dateString);
  date.setHours(date.getHours() + 1); // Add one hour
  return date.toISOString().slice(0, 19).replace("T", " ");
}

// Helper function for status styling
const getStatusClass = (status: string) => {
  if(status === "Nincs leadva") return "status-yellow";
  if(status === "Leadva") return "status-green";
  if(status === "Határidő lejárt") return "status-red";
  return "";
};

// For viewing assignment details
const selectedAssignment = ref<OpenAssignment>({
  ID: -1,
  deadline: new Date("0000-00-00"),
  desc: "",
  teacherID: -1,
  uploadDate: new Date("0000-00-00"),
});

const openCompletedAssignment = ref<OpenCompletedAssignment>({
  ID: -1,
  assignmentID: -1,
  date: new Date("0000-00-00"),
  status: "",
  studentID: -1,
  textAnswer: ""
});

const ViewAssignmentDialog = ref(false);
const openAssignmentViewDialog = (selected: OpenAssignment, complassignment: OpenCompletedAssignment) => {
  selectedAssignment.value = selected;
  // Create a mutable shallow copy of complassignment
  openCompletedAssignment.value = { ...complassignment };
  ViewAssignmentDialog.value = true;
};

const resetForm = () => {
  console.log("Reset form triggered");
  // Close the assignment details dialog
  ViewAssignmentDialog.value = false;
  // Clear files from the file input
  completedAssignmentFiles.value = [];
  // Open success dialog
  successDialog.value = true;
};

const assignmentFiles = ref<any[]>([]);
const completedAssignmentFiles = ref<any[]>([]);

// Computed property to check if deadline is past
const isDeadlinePast = computed(() => {
  return new Date(selectedAssignment.value.deadline) < new Date();
});

function modositasmentese(){
  modifyCompletedAssignment(openCompletedAssignment.value, {
    onSuccess: async (assignmentResponse) => {
      const completedAssignmentID = assignmentResponse.ID;
      if (completedAssignmentFiles.value.length > 0) {
        await uploadCompletedAssignmentFiles(
          { files: completedAssignmentFiles.value, completedAssignmentId: completedAssignmentID },
          { onSuccess: resetForm }
        );
      }
      else{
        resetForm();
      }
    }
  });
}

// Fetch assignment files for a given assignment
const fetchAssignmentFiles = async (selectedAssignmentID: number) => {
  console.log("Fetching files for assignment:", selectedAssignmentID);
  await getAssignmentFiles(selectedAssignmentID, {
    onSuccess: async (response) => {
      console.log("Files fetched:", response);
      assignmentFiles.value = response;
    }
  });
};

// Download function remains unchanged
const downloadFile = (file: any) => {
  const byteArray = new Uint8Array(file.buffer.data);
  const blob = new Blob([byteArray], { type: file.mimetype || 'application/octet-stream' });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = file.filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Delete file functions
const DeleteAssignmentID = ref<number>(-1);
const DeleteAssignmentDialog = ref(false);
const openDeleteAssignmentDialog = async (id: number) => {
  DeleteAssignmentID.value = id;
  DeleteAssignmentDialog.value = true;
};

const deleteFile = async () => {
  await deleteAnswerFile(DeleteAssignmentID.value, {
    onSuccess: (response) => {
      console.log("File deletion successful");
      // Remove the file from the answerFiles list for the current assignment answer
      const currentAnswerId = openCompletedAssignment.value.ID;
      if (answerFiles.value[currentAnswerId]) {
        answerFiles.value[currentAnswerId] = answerFiles.value[currentAnswerId].filter(
          (file) => file.ID !== DeleteAssignmentID.value
        );
      }
      // Optionally, close the delete dialog after deletion
      DeleteAssignmentDialog.value = false;
    }
  });
};

const answerFiles = ref<Record<number, any[]>>({});
// Fetch answer files expects an array with one element (the answer ID)
const fetchAnswerFiles = async (answerFilesIDs: number[]) => {
  console.log("Fetching answer files for answer id:", answerFilesIDs);
  await getCompletedAssignmentFiles(answerFilesIDs, {
    onSuccess: (response) => {
      const filesArray = response.data || response;
      const filesByAnswer: Record<number, any[]> = {};
      answerFilesIDs.forEach((id, index) => {
        filesByAnswer[id] = filesArray[index];
      });
      answerFiles.value = filesByAnswer;
    }
  });
};

const handleOpenAssignment = (selected: OpenAssignment, complassignment: OpenCompletedAssignment) => {
  openAssignmentViewDialog(selected, complassignment);
  fetchAssignmentFiles(selected.ID);
  // Pass the answer ID inside an array
  fetchAnswerFiles([complassignment.ID]);
};

//itt kezdődik a forgatásnak a figyelése
const isPortrait = ref(window.matchMedia("(orientation: portrait)").matches);
const updateOrientation = () => {
  isPortrait.value = window.matchMedia("(orientation: portrait)").matches;
};
onMounted(() => {
  window.matchMedia("(orientation: portrait)").addEventListener("change", updateOrientation);
  if(document.cookie != ''){
    const decoded = jwtDecode(getCookie("alap"))
    push({name:decoded.userData.role+'orarend'})
  }
});
onUnmounted(() => {
  window.matchMedia("(orientation: portrait)").removeEventListener("change", updateOrientation);
});//itt ér véget
</script>

<template>
  <div v-if="isPortrait">
    <v-table style="height: 80vw !important; border-radius: 3%;">
      <thead>
        <tr>
          <th class="text-center" style="width: 10vw;">Feladó tanár</th>
          <th class="text-center" style="width: 10vw;">Határidő</th>
          <th class="text-center" style="width: 10vw;">Feltöltési idő</th>
          <th class="text-center" style="width: 10vw;">Leírás</th>
          <th class="text-center" style="width: 10vw;">Státusz</th>
          <th class="text-center" style="width: 10vw;">Interakció</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="feladat in assignmentStudentList" :key="feladat.feladat.ID">
          <td>{{ feladat.feladat.senderUserName }}</td>
          <td>{{ formatDate(feladat.feladat.deadline) }}</td>
          <td>{{ formatDate(feladat.feladat.uploadDate) }}</td>
          <td class="shortenedDesc">{{ feladat.feladat.desc }}</td>
          <td>
            <span :class="getStatusClass(feladat.valasz.status)">
              {{ feladat.valasz.status }}
            </span>
          </td>
          <!-- Use the helper function to open assignment details -->
          <v-btn color="primary" @click="handleOpenAssignment(feladat.feladat, feladat.valasz)">
            Feladat megtekintése
          </v-btn>
        </tr>
      </tbody>
    </v-table>

    <v-dialog v-model="ViewAssignmentDialog" max-width="80vw">
      <v-card max-width="80vw">
        <v-card-title>Feladat részletei</v-card-title>
        <v-card-text>
          <p><strong>Feladás dátuma:</strong> {{ formatDate(selectedAssignment?.uploadDate) }}</p>
          <p><strong>Dátum:</strong> {{ formatDate(selectedAssignment?.deadline) }}</p>
          <p><strong>Leírás:</strong> {{ selectedAssignment?.desc }}</p>

          <!-- Assignment Files Section (Teacher's Files) -->
          <div v-if="assignmentFiles.length">
            <p><strong>Fájlok:</strong></p>
            <v-list-item
              v-for="(file, index) in assignmentFiles"
              :key="file.ID"
              @click="downloadFile(file)"
              style="cursor: pointer;"
            >
              <v-list-item-content>
                <v-list-item-title>{{ file.filename }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </div>
          <div v-else>
            <p><strong>Fájlok:</strong> Nincsenek fájlok ehhez a feladathoz.</p>
          </div>

          <!-- Completed Assignment Files Section (Student's Files) -->
          <div v-if="answerFiles[openCompletedAssignment.ID] && answerFiles[openCompletedAssignment.ID].length">
            <p><strong>Beadott fájlok:</strong></p>
            <v-list-item
              v-for="(file, index) in answerFiles[openCompletedAssignment.ID]"
              :key="file.ID"
              style="display: flex; align-items: center;"
            >
              <v-list-item-content>
                <v-list-item-title>{{ file.filename }}</v-list-item-title>
              </v-list-item-content>
              <v-btn small color="primary" @click="downloadFile(file)">Download</v-btn>
              <v-btn
                small
                color="error"
                @click="openDeleteAssignmentDialog(file.ID)"
                :disabled="isDeadlinePast"
              >
                Delete
              </v-btn>
            </v-list-item>
          </div>
          <div v-else>
            <p><strong>Beadott fájlok:</strong> Nincsenek beadott fájlok.</p>
          </div>

          <p><strong>Az ön válasza:</strong></p>
          <v-textarea placeholder="Ide írhat" v-model="openCompletedAssignment.textAnswer">
            {{ openCompletedAssignment.textAnswer }}
          </v-textarea>
          <v-file-input 
            label="Fájlok feltöltése (egyszerre töltse fel)"
            multiple
            v-model="completedAssignmentFiles"
            show-size
            counter
          ></v-file-input>
          <p><strong>Utoljára módosítva:</strong> {{ formatDate(openCompletedAssignment.date) }}</p>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="ViewAssignmentDialog = false">Bezárás</v-btn>
          <v-btn @click="modositasmentese" :disabled="isDeadlinePast">Módosítás</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete File Confirmation Dialog -->
    <v-dialog v-model="DeleteAssignmentDialog" max-width="80vw" theme="dark">
      <v-card>
        <v-card-title>Biztos törölni akarod?</v-card-title>
        <v-btn @click="deleteFile">Törlés</v-btn>
        <v-btn @click="DeleteAssignmentDialog = false">Mégse</v-btn>
      </v-card>
    </v-dialog>

    <!-- Success Dialog -->
    <v-dialog v-model="successDialog" max-width="80vw" theme="dark">
      <v-card>
        <v-card-title>Sikeres módosítás</v-card-title>
        <v-card-text>A módosítás sikeresen megtörtént.</v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="successDialog = false">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>

  <!-- asztali nézet -->
  <div v-else>
    <v-container>
      <v-card>
        <v-card-title>Házifeladatok:</v-card-title>
        <v-card-text>
          <v-table style="height: 30vw !important;">
            <thead>
              <tr>
                <th class="text-center" style="width: 10vw;">Feladó tanár</th>
                <th class="text-center" style="width: 10vw;">Határidő</th>
                <th class="text-center" style="width: 10vw;">Feltöltési idő</th>
                <th class="text-center" style="width: 10vw;">Leírás</th>
                <th class="text-center" style="width: 10vw;">Státusz</th>
                <th class="text-center" style="width: 10vw;">Interakció</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="feladat in assignmentStudentList" :key="feladat.feladat.ID">
                <td>{{ feladat.feladat.senderUserName }}</td>
                <td>{{ formatDate(feladat.feladat.deadline) }}</td>
                <td>{{ formatDate(feladat.feladat.uploadDate) }}</td>
                <td class="shortenedDesc">{{ feladat.feladat.desc }}</td>
                <td>
                  <span :class="getStatusClass(feladat.valasz.status)">
                    {{ feladat.valasz.status }}
                  </span>
                </td>
                <!-- Use the helper function to open assignment details -->
                <v-btn color="primary"@click="handleOpenAssignment(feladat.feladat, feladat.valasz)">
                  Feladat megtekintése
                </v-btn>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>
      </v-card>
    </v-container>

    <v-dialog v-model="ViewAssignmentDialog" max-width="50vw">
      <v-card max-width="50vw">
        <v-card-title>Feladat részletei</v-card-title>
        <v-card-text>
          <p><strong>Feladás dátuma:</strong> {{ formatDate(selectedAssignment?.uploadDate) }}</p>
          <p><strong>Dátum:</strong> {{ formatDate(selectedAssignment?.deadline) }}</p>
          <p><strong>Leírás:</strong> {{ selectedAssignment?.desc }}</p>

          <!-- Assignment Files Section (Teacher's Files) -->
          <div v-if="assignmentFiles.length">
            <p><strong>Fájlok:</strong></p>
            <v-list-item
              v-for="(file, index) in assignmentFiles"
              :key="file.ID"
              @click="downloadFile(file)"
              style="cursor: pointer;"
            >
              <v-list-item-content>
                <v-list-item-title>{{ file.filename }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </div>
          <div v-else>
            <p><strong>Fájlok:</strong> Nincsenek fájlok ehhez a feladathoz.</p>
          </div>

          <!-- Completed Assignment Files Section (Student's Files) -->
          <div v-if="answerFiles[openCompletedAssignment.ID] && answerFiles[openCompletedAssignment.ID].length">
            <p><strong>Beadott fájlok:</strong></p>
            <v-list-item
              v-for="(file, index) in answerFiles[openCompletedAssignment.ID]"
              :key="file.ID"
              style="display: flex; align-items: center;"
            >
              <v-list-item-content>
                <v-list-item-title>{{ file.filename }}</v-list-item-title>
              </v-list-item-content>
              <v-btn small color="primary" @click="downloadFile(file)">Download</v-btn>
              <v-btn
                small
                color="error"
                @click="openDeleteAssignmentDialog(file.ID)"
                :disabled="isDeadlinePast"
              >
                Delete
              </v-btn>
            </v-list-item>
          </div>
          <div v-else>
            <p><strong>Beadott fájlok:</strong> Nincsenek beadott fájlok.</p>
          </div>

          <p><strong>Az ön válasza:</strong></p>
          <v-textarea placeholder="Ide írhat" v-model="openCompletedAssignment.textAnswer">
            {{ openCompletedAssignment.textAnswer }}
          </v-textarea>
          <v-file-input 
            label="Fájlok feltöltése (egyszerre töltse fel)"
            multiple
            v-model="completedAssignmentFiles"
            show-size
            counter
          ></v-file-input>
          <p><strong>Utoljára módosítva:</strong> {{ formatDate(openCompletedAssignment.date) }}</p>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="ViewAssignmentDialog = false">Bezárás</v-btn>
          <v-btn @click="modositasmentese" :disabled="isDeadlinePast">Módosítás</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete File Confirmation Dialog -->
    <v-dialog v-model="DeleteAssignmentDialog" max-width="50vw" theme="dark">
      <v-card>
        <v-card-title>Biztos törölni akarod?</v-card-title>
        <v-btn @click="deleteFile">Törlés</v-btn>
        <v-btn @click="DeleteAssignmentDialog = false">Mégse</v-btn>
      </v-card>
    </v-dialog>

    <!-- Success Dialog -->
    <v-dialog v-model="successDialog" max-width="30vw" theme="dark">
      <v-card>
        <v-card-title>Sikeres módosítás</v-card-title>
        <v-card-text>A módosítás sikeresen megtörtént.</v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="successDialog = false">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style lang="css">
.shortenedDesc {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 10vw;
  display: inline-block;
}

.status-yellow {
  background-color: yellow;
  color: black;
  padding: 2px 5px;
  border-radius: 4px;
}

.status-green {
  background-color: green;
  color: white;
  padding: 2px 5px;
  border-radius: 4px;
}

.status-red {
  background-color: red;
  color: white;
  padding: 2px 5px;
  border-radius: 4px;
}
</style>

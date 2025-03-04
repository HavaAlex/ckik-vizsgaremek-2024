<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { Assignment, OpenAssignment } from '@/api/hazik/hazik';
import { 
  usegetGroups, 
  useaddAssignment, 
  useuploadAssignmentFiles, 
  usegetAssignmentsTeacher, 
  usegetAssignmentFiles, 
  usegetCompletedAssignmentFiles,
  usedeleteAssignment
} from '@/api/hazik/hazikQuery';

const dialog = ref(false); // dialog for sending assignment
const successDialog = ref(false); // shows when submission is successful
const { data } = usegetGroups(); // target groups
const { mutate: addAssignment, isPending } = useaddAssignment();
const { mutate: uploadAssignmentFiles } = useuploadAssignmentFiles();
const { mutate: getAssignmentFiles } = usegetAssignmentFiles();
const { mutate: getCompletedAssignmentFiles } = usegetCompletedAssignmentFiles();
const { mutate: deleteAssignment } = usedeleteAssignment();
const { data: assignmentTeacherList } = usegetAssignmentsTeacher();

// Store assignment data for adding an assignment
const AssignmentDataRef = ref<Assignment>({
  Groups: [],
  Description: "",
  DeadLine: new Date(0),
  UploadDate: new Date(0),
});

// Deadline selection:
const date = ref<Date | null>(null);
const hour = ref<number | null>(null);
const minute = ref<number | null>(null);

const formattedDate = computed(() => {
  if (!date.value || hour.value === null || minute.value === null) {
    return "Még nem állított be határidőt";
  }
  return `${date.value.toLocaleDateString()} ${String(hour.value).padStart(2, "0")}:${String(minute.value).padStart(2, "0")}`;
});

watch([date, hour, minute], ([newDate, newHour, newMinute]) => {
  if (newDate && newHour !== null && newMinute !== null) {
    const deadline = new Date(newDate);
    deadline.setHours(newHour, newMinute, 0, 0);
    AssignmentDataRef.value.DeadLine = deadline;
  }
});

const handleTimeChange = (timeString: string) => {
  const [selectedHour, selectedMinute] = timeString.split(':').map(Number);
  hour.value = selectedHour;
  minute.value = selectedMinute;
};

const hours = Array.from({ length: 24 }, (_, i) => i);
const minutes = Array.from({ length: 60 }, (_, i) => i);

// Send assignment (first create assignment, then upload files if any)
const selectedFiles = ref<File[]>([]);
const sendAssignment = async () => {
  await addAssignment(AssignmentDataRef.value, {
    onSuccess: async (assignmentResponse) => {
      const assignmentId = assignmentResponse.ID;
      if (selectedFiles.value.length > 0) {
        await uploadAssignmentFiles({ files: selectedFiles.value, assignmentId }, {
          onSuccess: resetForm,
        });
      } else {
        resetForm();
      }
    }
  });
};

const resetForm = () => {
  AssignmentDataRef.value = {
    Groups: [],
    Description: "",
    DeadLine: new Date(0),
    UploadDate: new Date(0),
  };
  selectedFiles.value = [];
  successDialog.value = true;
  dialog.value = false;
};

function formatDate(dateString: Date | string) {
  if (!dateString) return "";
  const dateObj = new Date(dateString);
  return dateObj.toISOString().slice(0, 19).replace("T", " ");
}

// -------------------------
// Assignment view & answer dialogs
// -------------------------

// For viewing answers, we need the full teacher-assignment item (which contains the answers array)
const selectedAssignmentForAnswers = ref<{ anwsers: any[]; feladat: OpenAssignment } | null>(null);
const ViewAssignmentAnwserDialog = ref(false);

// Store files for each answer keyed by answer id
const answerFiles = ref<Record<number, any[]>>({});
const answerFilesIDs = ref<any[]>([]);

// Fetch files for a given answer using its ID
const fetchAnswerFiles = async (answerFilesIDs: any[]) => {
  console.log("Fetching answer files for answer id:", answerFilesIDs);
  await getCompletedAssignmentFiles(answerFilesIDs, {
    onSuccess: (response) => {
      const filesArray = response.data || response;
      const filesByAnswer: Record<number, any[]> = {};
      // Map each answer ID to its corresponding file array from the response.
      answerFilesIDs.forEach((id, index) => {
        filesByAnswer[id] = filesArray[index];
      });
      answerFiles.value = filesByAnswer;
    }
  });
};

const openViewAssignmentAnswerDialog = async (assignmentItem: { anwsers: any[]; feladat: OpenAssignment }) => {
  fetchAssignmentFiles(assignmentItem.feladat.ID);
  selectedAssignmentForAnswers.value = assignmentItem;
  ViewAssignmentAnwserDialog.value = true;
  
  // Reset the answerFilesIDs array before pushing new IDs.
  answerFilesIDs.value = [];
  
  // For each answer, fetch its associated files
  if (assignmentItem.anwsers) {
    for (const answer of assignmentItem.anwsers) {
      const answerId = answer.id || answer.ID;
      if (answerId) {
        answerFilesIDs.value.push(answerId);
      }
    }
    fetchAnswerFiles(answerFilesIDs.value);
  }
};
const DeleteAssignmentID = ref<number>(-1)
const DeleteAssignmentDialog = ref(false);
const openDeleteAssignmentDialog = async(id:number)=>{
  DeleteAssignmentID.value = id
  DeleteAssignmentDialog.value = true
}

const csinaldnigga = async() =>{
  console.log("aaaaaaaaaaaaaaaaa  ",DeleteAssignmentID)
  await deleteAssignment(DeleteAssignmentID.value, { onSuccess: (response) => { console.log("SIKER"); } });

}


// Holds the files fetched for a given assignment
const assignmentFiles = ref<any[]>([]);

// Fetch assignment files (we expect an array of objects including { ID, buffer, filename, mimetype, ... })
const fetchAssignmentFiles = async (selectedAssignmentID: number) => {
  console.log("Fetching files for assignment:", selectedAssignmentID);
  await getAssignmentFiles(selectedAssignmentID, {
    onSuccess: async (response) => {
      console.log("Files fetched:", response);
      assignmentFiles.value = response.data || response;
    }
  });
};

// Updated download function
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
</script>

<template>
  <main>
    <v-table style="height: 30vw !important;" >
      <thead>
        <tr>
          <th class="text-center" style="width: 15vw; justify-content: center;">Határidő</th>
          <th class="text-center" style="width: 15vw; justify-content: center;">Feltöltési idő</th>
          <th class="text-center" style="width: 15vw; justify-content: center;">Leírás</th>
          <th class="text-center" style="width: 15vw; justify-content: center;">Interakció</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="feladat in assignmentTeacherList" :key="feladat.feladat.ID">
          <td>{{ formatDate(feladat.feladat.deadline) }}</td>
          <td>{{ formatDate(feladat.feladat.uploadDate) }}</td>
          <td style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 15vw; display: inline-block;">
            {{ feladat.feladat.desc }}
          </td>
          <td>
            <div style="display: flex; gap: 10px;">
              <!-- Open answers dialog and fetch assignment files -->
              <v-btn @click="openViewAssignmentAnswerDialog(feladat);">
                Válaszok megtekintése
              </v-btn>
              <v-btn @click="openDeleteAssignmentDialog(feladat.feladat.ID)">
                Törlés
              </v-btn>
            </div>
          </td>
        </tr>
      </tbody>
    </v-table>

    <!-- Dialog for viewing answers -->
    <v-dialog v-model="ViewAssignmentAnwserDialog" max-width="50vw" >
      <v-card max-width="50vw">
        <v-card-title>Feladat:</v-card-title>
        <v-card-text>
          <p><strong>Feladás dátuma:</strong> {{ formatDate(selectedAssignmentForAnswers?.feladat.uploadDate) }}</p>
          <p><strong>Határidő:</strong> {{ formatDate(selectedAssignmentForAnswers?.feladat.deadline) }}</p>
          <p><strong>Feladat leírása:</strong> {{ selectedAssignmentForAnswers?.feladat.desc }}</p>

          <!-- Assignment files -->
          <div v-if="assignmentFiles.length">
            <p><strong>Fájlok:</strong></p>
            <v-list-item
              v-for="(file, index) in assignmentFiles"
              :key="file.ID"
              @click="downloadFile(file)"
              style="cursor: pointer;"
            >
              <v-list-item-title>{{ file.filename }}</v-list-item-title>
            </v-list-item>
          </div>
          <div v-else>
            <p><strong>Fájlok:</strong> Nincsenek fájlok ehhez a feladathoz.</p>
          </div>

          <!-- Answers -->
          <v-card-title>Válaszok:</v-card-title>
          <v-list>
            <!-- Loop over each answer in the selected assignment -->
            <v-list-item
              v-for="(answer, index) in selectedAssignmentForAnswers?.anwsers"
              :key="answer.ID"
            >
              <!-- Basic answer info -->
              <v-list-item-title>{{ answer.senderUserName.name }}</v-list-item-title>
              <v-list-item-subtitle>Válasz szövege: {{ answer.textAnswer }}</v-list-item-subtitle>

              <!-- Files for this particular answer -->
              <div v-if="answerFiles[answer.ID] && answerFiles[answer.ID].length">
                <p><strong>Fájlok:</strong></p>
                <v-list dense>
                  <v-list-item
                    v-for="(file, fileIndex) in answerFiles[answer.ID]"
                    :key="file.ID"
                    @click="downloadFile(file)"
                    style="cursor: pointer;"
                  >
                    <v-list-item-title>{{ file.filename }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </div>
              <div v-else>
                <p><strong>Fájlok:</strong> Nincsenek fájlok ehhez a válaszhoz.</p>
              </div>
            </v-list-item>
          </v-list>
        </v-card-text>

        <v-card-actions>
          <v-btn color="primary" @click="ViewAssignmentAnwserDialog = false">Bezárás</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

<!---------------------------------------------------------------->
      <!-- Dialog for viewing answers -->
      <v-dialog v-model="DeleteAssignmentDialog" max-width="50vw" theme="dark">
        <v-card>
          <v-card-title >Biztos törölni akarod?</v-card-title>
          <v-btn @click="csinaldnigga">Törlés</v-btn>
          <v-btn @click="DeleteAssignmentDialog = false">Mégse</v-btn>
        </v-card>
      </v-dialog>
    



    <!-- Dialog for sending assignment -->
    <v-btn  @click="dialog = true">Feladat kitűzése</v-btn>
    <v-dialog v-model="dialog">
      <v-card max-width="85vw">
        <p>Címzettek:</p>
        <v-list-item 
          v-for="(group, index) in AssignmentDataRef.Groups" 
          :key="index" 
          @click="AssignmentDataRef.Groups.splice(index, 1)"
        >
          {{ group.name + " (kattintson az eltávolításhoz)" }}
        </v-list-item>

        <v-menu class="appnavbarmenubtn">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" class="appnavbarmenubtn">Osztály kiválasztása</v-btn>
          </template>
          <v-list>
            <v-list-item 
              v-for="elem in data" 
              :key="elem.id" 
              @click="AssignmentDataRef.Groups.push(elem)"
            >
              {{ elem.name }}
            </v-list-item>
          </v-list>
        </v-menu>

        <v-container class="d-flex flex-column align-center">
          <v-row>
            <v-col>
              <v-date-picker v-model="date" :first-day-of-week="1" />
            </v-col>
            <v-col>
              <v-time-picker @update:modelValue="handleTimeChange" format="24hr" />
              <v-row style="width: 25vw;" justify="center">
                <v-col>
                  <v-select v-model="hour" :items="hours" label="Óra" density="compact" variant="outlined" />
                </v-col>
                <v-col>
                  <v-select v-model="minute" :items="minutes" label="Perc" density="compact" variant="outlined" />
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <v-alert class="mt-4" type="info" variant="outlined">
            Beállított határidő: {{ formattedDate }}
          </v-alert>
        </v-container>

        <v-card-text>
          <v-textarea label="A feladat leírása" v-model="AssignmentDataRef.Description"></v-textarea>
        </v-card-text>

        <v-file-input 
          label="Fájlok feltöltése (egyszerre töltse fel)"
          multiple
          v-model="selectedFiles"
          show-size
          counter
        ></v-file-input>

        <v-card-actions>
          <v-btn text="Feladat küldése" @click="sendAssignment" :loading="isPending"></v-btn>
          <v-btn color="primary" @click="dialog = false">Bezárás</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </main>
</template>

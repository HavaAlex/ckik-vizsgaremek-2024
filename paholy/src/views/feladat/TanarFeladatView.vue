<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
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

// New ref for selected group (radio buttons)
const selectedGroup = ref(null);

// Deadline selection:
const date = ref<Date | null>(null);
const hour = ref<number | null>(null);
const minute = ref<number | null>(null);

/**
 * minDate is a string in 'YYYY-MM-DD' format for the v-date-picker's :min prop.
 * This ensures the user cannot pick a date earlier than today's date.
 */
const minDate = computed(() => {
  // Create a new Date for today at midnight, convert to YYYY-MM-DD
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
});

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
  // Set the assignment's group using the selected radio button
  if (selectedGroup.value) {
    AssignmentDataRef.value.Groups = [selectedGroup.value];
  } else {
    AssignmentDataRef.value.Groups = [];
  }
  await addAssignment(AssignmentDataRef.value, {
    onSuccess: async (assignmentResponse) => {
      const assignmentId = assignmentResponse.ID;
      if (selectedFiles.value.length > 0) {
        console.log("legalább ez megy")
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
  console.log("MEG EZ IS AM"),
  AssignmentDataRef.value = {
    Groups: [],
    Description: "",
    DeadLine: new Date(0),
    UploadDate: new Date(0),
  };
  selectedFiles.value = [];
  selectedGroup.value = null;
  successDialog.value = true;
  dialog.value = false;
};

function formatDate(dateString: Date | string | null) {
  if (!dateString) return "";
  const date = new Date(dateString);
  date.setHours(date.getHours() + 1); // Add one hour
  return date.toISOString().slice(0, 19).replace("T", " ");
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

const DeleteAssignmentID = ref<number>(-1);
const DeleteAssignmentDialog = ref(false);
const openDeleteAssignmentDialog = async(id: number) => {
  DeleteAssignmentID.value = id;
  DeleteAssignmentDialog.value = true;
};

const deleteThis = async () => {
  await deleteAssignment(DeleteAssignmentID.value, { onSuccess: (response) => { console.log("SIKER"); } });
  DeleteAssignmentDialog.value = false;
};

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

// New helper function to return status style based on the answer status
const getStatusStyle = (status: string) => {
  if (status === "Nincs leadva") {
    return { backgroundColor: "yellow", color: "black", padding: "4px", borderRadius: "4px", display: "inline-block" };
  } else if (status === "Leadva") {
    return { backgroundColor: "green", color: "white", padding: "4px", borderRadius: "4px", display: "inline-block" };
  } else if (status === "Határidő lejárt") {
    return { backgroundColor: "red", color: "white", padding: "4px", borderRadius: "4px", display: "inline-block" };
  }
  return {};
};



// Responsive dialog width for viewing answers
// Responsive dialog width for viewing answers
const viewAssignmentDialogWidth = ref('50vw');
// Responsive card height for viewing answers
const viewAssignmentCardHeight = ref('auto');

const updateDialogSize = () => {
  // Check if in portrait mode (mobile)
  if (window.innerHeight > window.innerWidth) {
    viewAssignmentDialogWidth.value = '80vw';
    viewAssignmentCardHeight.value = '80vh'; // Card height set to 60vw on mobile
  } else {
    viewAssignmentDialogWidth.value = '50vw';
    viewAssignmentCardHeight.value = 'auto';
  }
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
  <main>
    <div v-if="isPortrait">
      <v-container>
        <v-card>
          <v-card-title>Feladatok: </v-card-title>
          <v-card-text style="overflow-y: auto; max-height: 80vw;">
            <v-list>
              <v-list-item v-for="feladat in assignmentTeacherList" :key="feladat.feladat.ID">
                  <strong>Határidő: </strong>{{ formatDate(feladat.feladat.deadline) }}
                  <strong>Feltöltési idő: </strong>{{ formatDate(feladat.feladat.uploadDate) }}
                  <p style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 50vw; display: inline-block;">{{ feladat.feladat.desc }}</p>
                  <v-btn color="primary" @click="openViewAssignmentAnswerDialog(feladat);">
                    Válaszok megtekintése
                  </v-btn>
                  <v-btn color="error" @click="openDeleteAssignmentDialog(feladat.feladat.ID)">
                    Törlés
                  </v-btn>
                </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="dialog = true">Feladat kitűzése</v-btn>
          </v-card-actions>
        </v-card>
      </v-container>
      <!--néző dialog-->
      <v-dialog v-model="ViewAssignmentAnwserDialog" >
        <v-card >
          <v-card-title>Feladat:</v-card-title>
          <v-card-text>
            <p>
              <strong>Feladás dátuma:</strong>
              {{ formatDate(selectedAssignmentForAnswers?.feladat.uploadDate) }}
            </p>
            <p>
              <strong>Határidő:</strong>
              {{ formatDate(selectedAssignmentForAnswers?.feladat.deadline) }}
            </p>
            <p>
              <strong>Feladat leírása:</strong>
              {{ selectedAssignmentForAnswers?.feladat.desc }}
            </p>


            <div v-if="assignmentFiles.length">
              <p><strong>Fájlok:</strong></p>
              <v-list-item
                v-for="(file, index) in assignmentFiles"
                :key="file.ID"
                @click="downloadFile(file)"
                style="cursor: pointer;"
              >
                <v-list-item-title>{{ file.filename }} <div>(A fájl letöltéséhez nyomja meg)</div></v-list-item-title>
              </v-list-item>
            </div>
            <div v-else>
              <p><strong>Fájlok:</strong> Nincsenek fájlok ehhez a feladathoz.</p>
            </div>
            <v-card-title>Válaszok:</v-card-title>
            <v-list>
              <v-list-item
                v-for="(answer, index) in selectedAssignmentForAnswers?.anwsers"
                :key="answer.ID"
              >
                <h3>{{ answer.senderUserName }}</h3>
                <div :style="getStatusStyle(answer.status)" class="mt-2">
                  <strong>Státusz:</strong> {{ answer.status }}
                </div>
                <p><strong>Válasz szövege: </strong>{{ answer.textAnswer }}</p>
                
                
                <div v-if="answerFiles[answer.ID] && answerFiles[answer.ID].length">
                  <p><strong>Fájlok:</strong></p>
                  <v-list dense>
                    <v-list-item
                      v-for="(file, fileIndex) in answerFiles[answer.ID]"
                      :key="file.ID"
                      @click="downloadFile(file)"
                      style="cursor: pointer;"
                    >
                      <v-list-item-title>{{ file.filename }}<div>(A fájl letöltéséhez nyomja meg)</div></v-list-item-title>
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
            <v-btn color="primary" @click="ViewAssignmentAnwserDialog = false">
              Bezárás
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!--törlés dialog-->
      <v-dialog v-model="DeleteAssignmentDialog" max-width="80vw" theme="dark">
          <v-card>
            <v-card-title>Biztos törölni akarja?</v-card-title>
            <v-card-text><div>A kitörölt házifeladat végleg elveszik, nem lehet visszaállítani</div></v-card-text>
            <v-card-actions>
              <v-btn color="error" @click="deleteThis">Törlés</v-btn>
              <v-btn @click="DeleteAssignmentDialog = false">Mégse</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

      <!--új feladat dialog-->
      <v-dialog v-model="dialog" style="max-width: 100vw;">
        <v-card>
          <v-card-title>Új feladat:</v-card-title>
          <v-card-text style="overflow-y: auto;">
            <v-list>
              <v-list-item >
                <v-radio-group v-model="selectedGroup" label="Címzett osztály">
                    <v-radio
                      v-for="elem in data"
                      :key="elem.id"
                      :label="elem.name"
                      :value="elem"
                    ></v-radio>
                  </v-radio-group>
              </v-list-item>
              <v-list-item style="padding: 0vw;"> 
                <v-date-picker
                    style="max-width: 100vw;"
                    v-model="date"
                    :first-day-of-week="1"
                    scrollable
                    :min="minDate"
                    locale: hu
                  />
              </v-list-item>
              <v-list-item style="padding: 0vw;">
                <v-time-picker
                theme="light"
                style="background-color: rgb(82, 82, 82); max-width: 80vw;"
                @update:modelValue="handleTimeChange"
                format="24hr"
                
                />
                <v-select
                  v-model="hour"
                  :items="hours"
                  label="Óra"
                  density="compact"
                  variant="outlined"
                />
                <v-select
                  v-model="minute"
                  :items="minutes"
                  label="Perc"
                  density="compact"
                  variant="outlined"
                />
              </v-list-item>
              <v-list-item>
                <v-alert class="mt-4" type="info" variant="outlined">
                    Beállított határidő: {{ formattedDate }}
                  </v-alert>
              </v-list-item>
              <v-list-item>
                <v-textarea
                  label="A feladat leírása"
                  v-model="AssignmentDataRef.Description"
                ></v-textarea>
              </v-list-item>
              <v-list-item>
                <v-file-input 
                  label="Fájlok feltöltése (egyszerre töltse fel)"
                  multiple
                  v-model="selectedFiles"
                  show-size
                  counter
                ></v-file-input>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-actions>
            <v-btn text="Feladat küldése" @click="sendAssignment" :loading="isPending"></v-btn>
            <v-btn color="primary" @click="dialog = false">Bezárás</v-btn>
          </v-card-actions>
        
        </v-card>
      </v-dialog>
    </div>
    <div v-else>
      <v-container>
        <v-card>
          <v-card-title>
            <h1 style="padding: 10px;" class="bg-title"> Feladatok</h1>
          </v-card-title>
          <v-card-text>
            <v-table style="height: 30vw !important;">
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
                  <td
                    style="
                      white-space: nowrap;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      width: 15vw;
                      display: inline-block;
                    "
                  >
                    {{ feladat.feladat.desc }}
                  </td>
                  <td>
                    <div style="display: flex; gap: 10px;">
                      <!-- Open answers dialog and fetch assignment files -->
                      <v-btn color="primary" @click="openViewAssignmentAnswerDialog(feladat);">
                        Válaszok megtekintése
                      </v-btn>
                      <v-btn color="error" @click="openDeleteAssignmentDialog(feladat.feladat.ID)">
                        Törlés
                      </v-btn>
                    </div>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="dialog = true">Feladat kitűzése</v-btn>
          </v-card-actions>
        </v-card>
        <v-dialog v-model="ViewAssignmentAnwserDialog" :max-width="viewAssignmentDialogWidth">
          <v-card :style="{ width: viewAssignmentDialogWidth, height: viewAssignmentCardHeight }">
            <v-card-title>Feladat:</v-card-title>
            <v-card-text>
              <p>
                <strong>Feladás dátuma:</strong>
                {{ formatDate(selectedAssignmentForAnswers?.feladat.uploadDate) }}
              </p>
              <p>
                <strong>Határidő:</strong>
                {{ formatDate(selectedAssignmentForAnswers?.feladat.deadline) }}
              </p>
              <p>
                <strong>Feladat leírása:</strong>
                {{ selectedAssignmentForAnswers?.feladat.desc }}
              </p>

              <!-- Assignment files -->
              <div v-if="assignmentFiles.length">
                <p><strong>Fájlok:</strong></p>
                <v-list-item
                  v-for="(file, index) in assignmentFiles"
                  :key="file.ID"
                  @click="downloadFile(file)"
                  style="cursor: pointer;"
                >
                  <v-list-item-title>{{ file.filename }} <div>(A fájl letöltéséhez kattintson)</div></v-list-item-title>
                </v-list-item>
              </div>
              <div v-else>
                <p><strong>Fájlok:</strong> Nincsenek fájlok ehhez a feladathoz.</p>
              </div>

              
              <v-card-title>Válaszok:</v-card-title>
              <v-list>
                <v-list-item
                  v-for="(answer, index) in selectedAssignmentForAnswers?.anwsers"
                  :key="answer.ID"
                >
                  <v-list-item-title>{{ answer.senderUserName }}</v-list-item-title>
                  <div :style="getStatusStyle(answer.status)" class="mt-2">
                    <strong>Státusz:</strong> {{ answer.status }}
                  </div>
                  <p><strong>Válasz szövege: </strong>{{ answer.textAnswer }}</p>
                  
                 
                  <div v-if="answerFiles[answer.ID] && answerFiles[answer.ID].length">
                    <p><strong>Fájlok:</strong></p>
                    <v-list dense>
                      <v-list-item
                        v-for="(file, fileIndex) in answerFiles[answer.ID]"
                        :key="file.ID"
                        @click="downloadFile(file)"
                        style="cursor: pointer;"
                      >
                        <v-list-item-title>{{ file.filename }}<div>(A fájl letöltéséhez kattintson)</div></v-list-item-title>
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
              <v-btn color="primary" @click="ViewAssignmentAnwserDialog = false">
                Bezárás
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="DeleteAssignmentDialog" max-width="50vw" theme="dark">
          <v-card>
            <v-card-title>Biztos törölni akarja?</v-card-title>
            <v-card-text><div>A kitörölt házifeladat végleg elveszik, nem lehet visszaállítani</div></v-card-text>
            <v-card-actions>
              <v-btn color="error" @click="deleteThis">Törlés</v-btn>
              <v-btn @click="DeleteAssignmentDialog = false">Mégse</v-btn>
            </v-card-actions>

          </v-card>
        </v-dialog>

        <!-- Új feladat -->
        <v-dialog v-model="dialog" style="max-width: 70vw;">
          <v-card>
            <v-card-title>Új feladat:</v-card-title>
            <v-container>
              <v-row>
                <v-col cols="4">
                  <v-radio-group v-model="selectedGroup" label="Címzett osztály">
                    <v-radio
                      v-for="elem in data"
                      :key="elem.id"
                      :label="elem.name"
                      :value="elem"
                    ></v-radio>
                  </v-radio-group>
                </v-col>
                <v-col cols="8">
                  <v-row>
                    <v-col>

                      <v-date-picker
                        v-model="date"
                        :first-day-of-week="1"
                        scrollable
                        :min="minDate"
                      />
                    </v-col>
                    <v-col>
                      <v-time-picker

                        theme="light"
                        style="background-color: rgb(82, 82, 82);"
                        @update:modelValue="handleTimeChange"
                        format="24hr"
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-select
                        v-model="hour"
                        :items="hours"
                        label="Óra"
                        density="compact"
                        variant="outlined"
                      />
                    </v-col>
                    <v-col>
                      <v-select
                        v-model="minute"
                        :items="minutes"
                        label="Perc"
                        density="compact"
                        variant="outlined"
                      />
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-alert class="mt-4" type="info" variant="outlined">
                    Beállított határidő: {{ formattedDate }}
                  </v-alert>
                </v-col>
              </v-row>
            </v-container>

            <v-card-text>
              <v-textarea
                label="A feladat leírása"
                v-model="AssignmentDataRef.Description"
              ></v-textarea>
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
      </v-container>
    </div>
    
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watchEffect } from 'vue';
import type { Assignment, OpenAssignment, OpenCompletedAssignment } from '@/api/hazik/hazik';
import { 
  usegetAssignmentsStudent, 
  usemodifyCompletedAssignment, 
  usegetAssignmentFiles,
  useuploadCompletedAssignmentFiles, 
  usegetCompletedAssignmentFiles, 
  usedeleteAnswerFile 
} from '@/api/hazik/hazikQuery';
import { useCookieHandler } from '@/stores/cookieHandler';

const successDialog = ref(false); 
const { mutate: modifyCompletedAssignment, isPending } = usemodifyCompletedAssignment();
const { data: assignmentStudentList, refetch } = usegetAssignmentsStudent();
const { mutate: getAssignmentFiles } = usegetAssignmentFiles();
const { mutate: uploadCompletedAssignmentFiles } = useuploadCompletedAssignmentFiles();
const { mutate: getCompletedAssignmentFiles } = usegetCompletedAssignmentFiles();
const { mutate: deleteAnswerFile } = usedeleteAnswerFile();

const cookieHandler = useCookieHandler();
const role = ref<string>();
cookieHandler.hasValidCookie();
role.value = cookieHandler.utolsoDecoded?.userData.role;
refetch();

function formatDate(dateString: Date | string | null) {
  if (!dateString) return "";
  const date = new Date(dateString);
  date.setHours(date.getHours() + 1); // plusz egy óra
  return date.toISOString().slice(0, 19).replace("T", " ");
}

const getStatusClass = (status: string) => { // színezés
  if(status === "Nincs leadva") return "status-yellow";
  if(status === "Leadva") return "status-green";
  if(status === "Határidő lejárt") return "status-red";
  return "";
};

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

// Dialog megnyitáshoz
const ViewAssignmentDialog = ref(false);
const openAssignmentViewDialog = (selected: OpenAssignment, complassignment: OpenCompletedAssignment) => {
  selectedAssignment.value = selected;
  openCompletedAssignment.value = { ...complassignment }; // deep copy for editing
  ViewAssignmentDialog.value = true;
};

const resetForm = () => {
  ViewAssignmentDialog.value = false;
  completedAssignmentFiles.value = [];
  successDialog.value = true;
};

const assignmentFiles = ref<any[]>([]);
const completedAssignmentFiles = ref<any[]>([]);

// Deadline checking
const isDeadlinePast = computed(() => {
  return new Date(selectedAssignment.value.deadline) < new Date();
});

function modositasmentese(){ 
  modifyCompletedAssignment(openCompletedAssignment.value, {
    onSuccess: async (assignmentResponse: any) => {
      // Convert the returned ID to a string before passing it to uploadCompletedAssignmentFiles
      const completedAssignmentID = assignmentResponse.ID;
      if (completedAssignmentFiles.value.length > 0) {
        await uploadCompletedAssignmentFiles(
          { 
            files: completedAssignmentFiles.value, 
            completedAssignmentId: String(completedAssignmentID) 
          },
          { onSuccess: resetForm }
        );
      } else {
        resetForm();
      }
    }
  });
}

const fetchAssignmentFiles = async (selectedAssignmentID: number) => { 
  await getAssignmentFiles(selectedAssignmentID, {
    onSuccess: async (response: any) => {
      console.log("Files fetched:", response);
      // If response is an array, use it directly; otherwise, use response.data
      const res: any = response;
      assignmentFiles.value = res.data || res;
    }
  });
};

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

// Leadott fájl törlése
const DeleteAssignmentID = ref<number>(-1);
const DeleteAssignmentDialog = ref(false); 
const openDeleteAssignmentDialog = async (id: number) => { 
  DeleteAssignmentID.value = id;
  DeleteAssignmentDialog.value = true;
};

const deleteFile = async () => {
  await deleteAnswerFile(DeleteAssignmentID.value, {
    onSuccess: (response: any) => {
      console.log("File deletion successful");
      const currentAnswerId = openCompletedAssignment.value.ID;
      if (answerFiles.value[currentAnswerId]) {
        answerFiles.value[currentAnswerId] = answerFiles.value[currentAnswerId].filter(
          (file: any) => file.ID !== DeleteAssignmentID.value
        );
      }
      DeleteAssignmentDialog.value = false;
    }
  });
};

const answerFiles = ref<Record<number, any[]>>({});

const fetchAnswerFiles = async (answerFilesIDs: number[]) => {
  console.log("Fetching answer files for answer id:", answerFilesIDs);
  await getCompletedAssignmentFiles(answerFilesIDs, {
    onSuccess: (response: any) => {
      // Cast response to any to safely access .data if available
      const res: any = response;
      const filesArray = res.data || res;
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
  fetchAnswerFiles([complassignment.ID]);
};

// Orientation handling
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
</script>

<template>
  <div v-if="isPortrait">
    <v-container style="max-height: 100vw;">
      <v-card>
        <v-card-title>Kapott feladatok: </v-card-title>
        <v-card-text style="max-height: 80vw; overflow-y: auto;">
          <v-list>
            <v-list-item v-for="feladat in assignmentStudentList" :key="feladat.feladat.ID">
              <strong>Feladó tanár:</strong> {{ feladat.feladat.senderUserName }} <br>
              <strong>Határidő: </strong>{{ formatDate(feladat.feladat.deadline) }}  <br>
              <span :class="getStatusClass(feladat.valasz.status)">{{ feladat.valasz.status }}</span><br>
              <strong>Feladás dátuma: </strong>{{ formatDate(feladat.feladat.uploadDate) }} <br>
              <v-btn color="primary" @click="handleOpenAssignment(feladat.feladat, feladat.valasz)">
                Feladat megtekintése
              </v-btn>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-container>
    <v-dialog v-model="ViewAssignmentDialog" max-width="80vw">
      <v-card max-width="80vw">
        <v-card-title>Feladat részletei</v-card-title>
        <v-card-text>
          <p><strong>Feladás dátuma:</strong> {{ formatDate(selectedAssignment?.uploadDate) }}</p>
          <p><strong>Határidő:</strong> {{ formatDate(selectedAssignment?.deadline) }}</p>
          <p><strong>Leírás:</strong> {{ selectedAssignment?.desc }}</p>
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
          <div v-if="answerFiles[openCompletedAssignment.ID] && answerFiles[openCompletedAssignment.ID].length">
            <p><strong>Beadott fájlok:</strong></p>
            <v-list-item
              v-for="(file, index) in answerFiles[openCompletedAssignment.ID]"
              :key="file.ID"
              style="display: flex; align-items: center;"
            >
              <v-list-item-title>{{ file.filename }}</v-list-item-title>
              <v-btn small color="primary" @click="downloadFile(file)">Letöltés</v-btn>
              <v-btn
                small
                color="error"
                @click="openDeleteAssignmentDialog(file.ID)"
                :disabled="isDeadlinePast || role=='szulo'"
              >
                Törlés
              </v-btn>
            </v-list-item>
          </div>
          <div v-else>
            <p><strong>Beadott fájlok:</strong> Nincsenek beadott fájlok.</p>
          </div>
          <p v-if="role=='szulo'"><strong>A gyereke válasza:</strong></p>
          <p v-else><strong>Az ön válasza:</strong></p>
          <v-textarea placeholder="Ide írhat" v-model="openCompletedAssignment.textAnswer" :disabled="role=='szulo'"></v-textarea>
          <v-file-input :disabled="role=='szulo' || isDeadlinePast"
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
          <v-btn @click="modositasmentese" :disabled="isDeadlinePast || role=='szulo'">Módosítás</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="DeleteAssignmentDialog" max-width="80vw" theme="dark">
      <v-card>
        <v-card-title>Biztos törölni akarod?</v-card-title>
        <v-btn @click="deleteFile">Törlés</v-btn>
        <v-btn @click="DeleteAssignmentDialog = false">Mégse</v-btn>
      </v-card>
    </v-dialog>

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

  <div v-else>
    <v-container>
      <v-card>
        <v-card-title>Házifeladatok:</v-card-title>
        <v-card-text>
          <div v-if="assignmentStudentList && assignmentStudentList.length">
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
                  <td>
                    <v-btn color="primary" @click="handleOpenAssignment(feladat.feladat, feladat.valasz)">
                      Feladat megtekintése
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </div>
          <div v-else>
            Nincs semmilyen adat!
          </div>
        </v-card-text>
      </v-card>
    </v-container>

    <v-dialog v-model="ViewAssignmentDialog" max-width="50vw">
      <v-card max-width="50vw">
        <v-card-title>Feladat részletei</v-card-title>
        <v-card-text>
          <p><strong>Feladás dátuma:</strong> {{ formatDate(selectedAssignment?.uploadDate) }}</p>
          <p><strong>Határidő:</strong> {{ formatDate(selectedAssignment?.deadline) }}</p>
          <p><strong>Leírás:</strong> {{ selectedAssignment?.desc }}</p>
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
          <div v-if="answerFiles[openCompletedAssignment.ID] && answerFiles[openCompletedAssignment.ID].length">
            <p><strong>Beadott fájlok:</strong></p>
            <v-list-item
              v-for="(file, index) in answerFiles[openCompletedAssignment.ID]"
              :key="file.ID"
              style="display: flex; align-items: center;"
            >
              <v-list-item-title>{{ file.filename }}</v-list-item-title>
              <v-btn small color="primary" @click="downloadFile(file)">Letöltés</v-btn>
              <v-btn
                small
                color="error"
                @click="openDeleteAssignmentDialog(file.ID)"
                :disabled="isDeadlinePast || role=='szulo'"
              >
                Törlés
              </v-btn>
            </v-list-item>
          </div>
          <div v-else>
            <p><strong>Beadott fájlok:</strong> Nincsenek beadott fájlok.</p>
          </div>
          <p v-if="role=='szulo'"><strong>A gyereke válasza:</strong></p>
          <p v-else><strong>Az ön válasza:</strong></p>
          <v-textarea :disabled="role=='szulo' || isDeadlinePast" placeholder="Ide írhat" v-model="openCompletedAssignment.textAnswer">
            {{ openCompletedAssignment.textAnswer }}
          </v-textarea>
          <v-file-input :disabled="role=='szulo' || isDeadlinePast"
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
          <v-btn @click="modositasmentese" :disabled="isDeadlinePast || role=='szulo'">Új válasz feltöltése</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="DeleteAssignmentDialog" max-width="50vw" theme="dark">
      <v-card>
        <v-card-title>Biztos törölni akarod?</v-card-title>
        <v-btn @click="deleteFile">Törlés</v-btn>
        <v-btn @click="DeleteAssignmentDialog = false">Mégse</v-btn>
      </v-card>
    </v-dialog>

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

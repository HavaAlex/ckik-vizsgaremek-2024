<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { Assignment, OpenAssignment } from '@/api/hazik/hazik';
import { usegetGroups, useaddAssignment, useUploadFiles, usegetAssignmentsTeacher } from '@/api/hazik/hazikQuery';

const dialog = ref(false); // dialog for sending assignment
const successDialog = ref(false); // shows when submission is successful
const { data } = usegetGroups(); // target groups
const { mutate: addAssignment, isPending } = useaddAssignment();
const { mutate: uploadFiles } = useUploadFiles();
const { data: assignmentTeacherList } = usegetAssignmentsTeacher();

// Store assignment data for adding an assignment
const AssignmentDataRef = ref<Assignment>({
  Groups: [],
  Description: "",
  DeadLine: new Date(0),
  UploadDate: new Date(0),
});

const selectedFiles = ref<File[]>([]);



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
const sendAssignment = async () => {
  await addAssignment(AssignmentDataRef.value, {
    onSuccess: async (assignmentResponse) => {
      const assignmentId = assignmentResponse.ID;
      if (selectedFiles.value.length > 0) {
        await uploadFiles({ files: selectedFiles.value, assignmentId }, {
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

// For viewing assignment details
const selectedAssignment = ref<OpenAssignment | null>(null);
const ViewAssignmentDialog = ref(false);
const openAssignmentViewDialog = (assignment: OpenAssignment) => {
  selectedAssignment.value = assignment;
  ViewAssignmentDialog.value = true;
};

// For viewing answers, we need the full teacher-assignment item (which contains the answers array)
const selectedAssignmentForAnswers = ref<{ anwsers: any[]; feladat: OpenAssignment } | null>(null);
const ViewAssignmentAnwserDialog = ref(false);
const openViewAssignmentAnswerDialog = (assignmentItem: { anwsers: any[]; feladat: OpenAssignment }) => {
  selectedAssignmentForAnswers.value = assignmentItem;
  ViewAssignmentAnwserDialog.value = true;
};
</script>

<template>
  <main>
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
          <td style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 15vw; display: inline-block;">
            {{ feladat.feladat.desc }}
          </td>  
          <td>
            <div style="display: flex; gap: 10px;">
              <v-btn @click="openAssignmentViewDialog(feladat.feladat)">Feladat megtekintése</v-btn>
              <!-- Pass the whole teacher-assignment object to have access to the answers array -->
              <v-btn @click="openViewAssignmentAnswerDialog(feladat)">Válaszok megtekintése</v-btn>
            </div>
          </td>
        </tr>
      </tbody>
    </v-table>

    <!-- Dialog for viewing assignment details -->
    <v-dialog v-model="ViewAssignmentDialog" max-width="50vw" theme="dark">
      <v-card max-width="50vw">
        <v-card-title>Feladat részletei</v-card-title>
        <v-card-text>
          <p><strong>Feladás dátuma:</strong> {{ formatDate(selectedAssignment?.uploadDate) }}</p>
          <p><strong>Dátum:</strong> {{ formatDate(selectedAssignment?.deadline) }}</p>
          <p><strong>Leírás:</strong> {{ selectedAssignment?.desc }}</p>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="ViewAssignmentDialog = false">Bezárás</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog for viewing answers -->
    <v-dialog v-model="ViewAssignmentAnwserDialog" max-width="50vw" theme="dark">
      <v-card max-width="50vw">
        <v-card-title>Válaszok</v-card-title>
        <v-card-text>
          <p><strong>Feladat leírása:</strong> {{ selectedAssignmentForAnswers?.feladat.desc }}</p>
          <!-- Iterate over all answers -->
          <v-list>
            <v-list-item v-for="(answer, index) in selectedAssignmentForAnswers?.anwsers" :key="index">
              <v-list-item-content>
                <v-list-item-title>{{ answer.senderUserName.name}}</v-list-item-title>
                <!-- Display the answer text; adjust properties as needed -->
                <v-list-item-subtitle>Válasz szövege: {{ answer.textAnswer }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="ViewAssignmentAnwserDialog = false">Bezárás</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog for sending assignment -->
    <v-btn theme="dark" @click="dialog = true">Feladat kitűzése</v-btn>
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

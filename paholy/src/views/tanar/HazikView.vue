<script setup lang="ts"> 
import { ref, computed, watch } from 'vue';
import type { Assignment } from '@/api/hazik/hazik';
import { usegetGroups, useaddAssignment, useUploadFiles } from '@/api/hazik/hazikQuery';

const dialog = ref(false);
const successDialog = ref(false);
const { data } = usegetGroups();
const { mutate: addAssignment, isPending } = useaddAssignment();
const { mutate: uploadFiles } = useUploadFiles();

const AssignmentDataRef = ref<Assignment>({
  Groups: [],
  Description: "",
  DeadLine: new Date(0),
  UploadDate: new Date(0),
});

const selectedFiles = ref<File[]>([]);

// Határidő választás:
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

const sendAssignment = async () => {
  await addAssignment(AssignmentDataRef.value, {
    onSuccess:  async (assignmentResponse) => {
      const assignmentId = assignmentResponse.ID; // Extract ID from response

      if (selectedFiles.value.length > 0) {
        console.log("SElected files")
        console.log(selectedFiles)
        console.log(selectedFiles.value)
        console.log("assingmenttt")
        console.log(assignmentId)
        await uploadFiles({ files: selectedFiles.value, assignmentId }, {
          onSuccess: resetForm,
        });
      } 
      else {
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
</script>

<template>
  <main>
    <v-btn theme="dark" @click="dialog = true">Feladat kitűzése</v-btn>
    <v-dialog v-model="dialog">
      <v-card max-width="85vw">
        <p>Címzettek:</p>
        <v-list-item 
          v-for="(cuccli, index) in AssignmentDataRef.Groups" 
          :key="index" 
          @click="AssignmentDataRef.Groups.splice(index, 1)"
        >
          {{ cuccli.name + " (kattintson az eltávolításhoz)" }}
        </v-list-item>

        <v-menu class="appnavbarmenubtn">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" class="appnavbarmenubtn">Osztály kiválasztása</v-btn>
          </template>
          <v-list>
            <v-list class="targetelement" v-for="elem in data" 
              @click="AssignmentDataRef.Groups.push(elem)">
              {{ elem.name }}
            </v-list>
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

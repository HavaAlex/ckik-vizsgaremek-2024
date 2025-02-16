<script setup lang="ts"> 
import { ref, computed, watch } from 'vue'
import type { Assignment } from '@/api/hazik/hazik';
import { usegetGroups } from '@/api/hazik/hazikQuery';

const dialog = ref(false);
const { data } = usegetGroups();

function openDialog() {
  dialog.value = true;
}

const AssignmentDataRef = ref<Assignment>({
  Groups: [],
  Description: "",
  DeadLine: new Date(0), // Initialize properly
});

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

// Watchers to update DeadLine properly
watch([date, hour, minute], ([newDate, newHour, newMinute]) => {
  if (newDate && newHour !== null && newMinute !== null) {
    const deadline = new Date(newDate); // Clone selected date
    deadline.setHours(newHour, newMinute, 0, 0); // Set time
    AssignmentDataRef.value.DeadLine = deadline;
  }
});

const hours = Array.from({ length: 24 }, (_, i) => i);
const minutes = Array.from({ length: 60 }, (_, i) => i);




</script>

<template>
  <main>
    <v-btn theme="dark" @click="openDialog()">Feladat kitűzése</v-btn>
    <v-dialog v-model="dialog">
      <v-card max-width="50vw">
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
            <v-btn v-bind="props" class="appnavbarmenubtn">Osztály kiválasztása: (egy feladatot csak egy csoportnak oszthat ki)</v-btn>
          </template>
          <v-list>
            <v-list class="targetelement" v-for="elem in data" 
              @click="AssignmentDataRef.Groups.push(elem); console.log(AssignmentDataRef)">
              {{ elem.name }}
            </v-list>
          </v-list>
        </v-menu>

        <v-container class="d-flex flex-column align-center">
          <v-date-picker v-model="date" :first-day-of-week="1" />
          
          <v-time-picker
            format="24hr"
          ></v-time-picker>
          <v-row style="width: 25vw;" justify="center">
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

          <v-alert class="mt-4" type="info" variant="outlined">
            Beállított határidő: {{ formattedDate }}
          </v-alert>
        </v-container>

        <v-card-text>
          <v-textarea label="A feladat leírása" v-model="AssignmentDataRef.Description"></v-textarea>
        </v-card-text>

        <v-card-actions>
          <v-btn color="primary" @click="dialog = false">Bezárás</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </main>
</template>

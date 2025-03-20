<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { usegetGroups, usegetGroupAsignments, getGroupAsignments } from '@/api/admin/adminQuery'
import { usegetAssignmentFiles, usegetCompletedAssignmentFiles } from '@/api/hazik/hazikQuery'

// Destructure the mutate functions from the composables
const { mutate: getAssignmentFiles } = usegetAssignmentFiles()
const { mutate: getCompletedAssignmentFiles } = usegetCompletedAssignmentFiles()

// Fetch the list of groups
const { data: Groups } = usegetGroups()

// Reactive variable to store the selected group ID for fetching assignments
const selectedGroupForFetch = ref<number | null>(null)

// Reactive variable to store the fetched group assignments
const groupAssignments = ref([])

// When the selected group changes, run the assignments query
watch(selectedGroupForFetch, async (newGroupId) => {
  if (newGroupId !== null) {
    console.log("KIVÁLASZTVA:  ", newGroupId)
    const result = await getGroupAsignments(newGroupId)
    groupAssignments.value = result
  }
})

// -----------------------------
// New variables and functions for the detail dialog
// -----------------------------
const assignmentDetailsDialog = ref(false)
const selectedAssignmentForDetails = ref<any>(null)
const assignmentFiles = ref<any[]>([])
const answerFiles = ref<Record<number, any[]>>({})
const answerFilesIDs = ref<any[]>([])

const openAssignmentDetails = async (item: any) => {
  selectedAssignmentForDetails.value = item
  assignmentDetailsDialog.value = true

  assignmentFiles.value = []
  answerFiles.value = {}
  answerFilesIDs.value = []

  await fetchAssignmentFiles(item.assignment.ID)

  if (item.answers && item.answers.length) {
    item.answers.forEach((answer: any) => {
      const answerId = answer.id || answer.ID
      if (answerId) {
        answerFilesIDs.value.push(answerId)
      }
    })
    if(answerFilesIDs.value.length){
      await fetchAnswerFiles(answerFilesIDs.value)
    }
  }
}

const fetchAssignmentFiles = async (assignmentId: number) => {
  console.log("Fetching assignment files for:", assignmentId)
  await getAssignmentFiles(assignmentId, {
    onSuccess: (response: any) => {
      assignmentFiles.value = response.data || response
    }
  })
}

const fetchAnswerFiles = async (ids: any[]) => {
  console.log("Fetching answer files for IDs:", ids)
  await getCompletedAssignmentFiles(ids, {
    onSuccess: (response: any) => {
      const filesArray = response.data || response
      const filesByAnswer: Record<number, any[]> = {}
      ids.forEach((id, index) => {
        filesByAnswer[id] = filesArray[index]
      })
      answerFiles.value = filesByAnswer
    }
  })
}

// -----------------------------
// Delete assignment functionality
// -----------------------------
const deleteAssignmentDialog = ref(false)
const assignmentToDelete = ref<any>(null)
const openDeleteAssignment = (item: any) => {
  assignmentToDelete.value = item
  deleteAssignmentDialog.value = true
}

const deleteThisAssignment = async () => {
  console.log("Deleting assignment:", assignmentToDelete.value.assignment.ID)
  groupAssignments.value = groupAssignments.value.filter(
    (item: any) => item.assignment.ID !== assignmentToDelete.value.assignment.ID
  )
  deleteAssignmentDialog.value = false
}

// Download file function
const downloadFile = (file: any) => {
  const byteArray = new Uint8Array(file.buffer.data)
  const blob = new Blob([byteArray], { type: file.mimetype || 'application/octet-stream' })
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = file.filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Helper function to format dates
function formatDate(dateString: Date | string | null) {
  if (!dateString) return "";
  const date = new Date(dateString);
  date.setHours(date.getHours() + 1); // Add one hour
  return date.toISOString().slice(0, 19).replace("T", " ");
}

// -----------------------------
// Helper function for answer status styling
// -----------------------------
const getStatusStyle = (status: string) => {
  if (status === "Nincs leadva") {
    return { backgroundColor: "yellow", color: "black", padding: "4px", borderRadius: "4px", display: "inline-block", marginTop: "4px" };
  } else if (status === "Leadva") {
    return { backgroundColor: "green", color: "white", padding: "4px", borderRadius: "4px", display: "inline-block", marginTop: "4px" };
  } else if (status === "Határidő lejárt") {
    return { backgroundColor: "red", color: "white", padding: "4px", borderRadius: "4px", display: "inline-block", marginTop: "4px" };
  }
  return {};
}

// -----------------------------
// Orientation and card height handling
// -----------------------------
const isPortrait = ref(window.matchMedia("(orientation: portrait)").matches)
// Set the initial state: open the drawer if not portrait
const drawer = ref(isPortrait.value ? false : true)

if (window.matchMedia) {
  const mediaQuery = window.matchMedia("(orientation: portrait)")
  mediaQuery.addEventListener("change", (e) => {
    isPortrait.value = e.matches
  })
}

// Watch for orientation changes to update the drawer state
watch(isPortrait, (newValue) => {
  // Open the drawer in landscape mode, close in portrait mode
  drawer.value = newValue ? false : true
})

const cardHeight = computed(() => isPortrait.value ? '80vw' : '40vw')
</script>

<template>
  <main>
    <!-- Portrait mode: Toggle button for the sidebar -->
    <v-container>
      <v-row>
        <v-col cols="12" v-if="isPortrait">
          <v-btn color="primary" @click="drawer = true">
            Menü megnyitása
          </v-btn>
        </v-col>
      </v-row>
    </v-container>

    <!-- Navigation drawer with radio buttons positioned lower -->
    <v-navigation-drawer
      v-model="drawer"
      class="bg-secondary"
      :temporary="isPortrait"
      app
    >
      <div style="margin-top: 80px;">
        <v-radio-group v-model="selectedGroupForFetch" label="Címzett osztály">
          <v-radio
            v-for="elem in Groups"
            :key="elem.group.ID"
            :label="elem.group.name"
            :value="elem.group.ID"
          ></v-radio>
        </v-radio-group>
      </div>
    </v-navigation-drawer>

    <v-container>
      <v-card :style="{ height: cardHeight }">
        <v-card-title>Kiosztott házi feladatok</v-card-title>
        <v-card-text style="max-height: 80vh; overflow-y: auto;">
          <v-table>
            <thead>
              <tr>
                <th>Feladó tanár</th>
                <th>Feladás dátuma</th>
                <th>Leírás</th>
                <th>Határidő</th>
                <th>Interakció</th>
              </tr>
            </thead>
            <tbody v-if="groupAssignments && (groupAssignments.length || groupAssignments.value.length)">
              <tr v-for="item in groupAssignments" :key="item.assignment.ID">
                <td>{{ item.assignment.senderUserName }}</td>
                <td>{{ formatDate(item.assignment.uploadDate) }}</td>
                <td id="szoveg" style="width: 15vw;">{{ item.assignment.desc }}</td>
                <td>{{ formatDate(item.assignment.deadline) }}</td>
                <td>
                  <v-btn color="primary" @click="openAssignmentDetails(item)">Részletek</v-btn>
                  <v-btn color="error" @click="openDeleteAssignment(item)">Törlés</v-btn>
                </td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="5">Nincs megjeleníthető házi feladat</td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>
      </v-card>
    </v-container>

    <!-- Dialog for viewing assignment details -->
    <v-dialog v-model="assignmentDetailsDialog" max-width="50vw">
      <v-card>
        <v-card-title>Feladat részletei</v-card-title>
        <v-card-text>
          <p><strong>Feladás dátuma:</strong> {{ formatDate(selectedAssignmentForDetails?.assignment.uploadDate) }}</p>
          <p><strong>Határidő:</strong> {{ formatDate(selectedAssignmentForDetails?.assignment.deadline) }}</p>
          <p><strong>Leírás:</strong> {{ selectedAssignmentForDetails?.assignment.desc }}</p>

          <div v-if="assignmentFiles.length">
            <p><strong>Fájlok:</strong></p>
            <v-list>
              <v-list-item 
                v-for="file in assignmentFiles" 
                :key="file.ID" 
                @click="downloadFile(file)" 
                style="cursor: pointer;">
                <v-list-item-title>{{ file.filename }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </div>
          <div v-else>
            <p><strong>Fájlok:</strong> Nincsenek fájlok ehhez a feladathoz.</p>
          </div>

          <v-card-title style="margin-top: 20px;">Válaszok</v-card-title>
          <div v-if="selectedAssignmentForDetails?.answers && selectedAssignmentForDetails.answers.length">
            <v-list>
              <v-list-item
                v-for="(answer, index) in selectedAssignmentForDetails.answers"
                :key="answer.ID">
                <div>
                  <v-list-item-title><strong>{{ answer.senderUserName }}</strong></v-list-item-title>
                  <div :style="getStatusStyle(answer.status)">
                    <strong>Státusz:</strong> {{ answer.status }}
                  </div>
                  <p><strong>Válasz:</strong> {{ answer.textAnswer }}</p>
                  <!-- New status line for each answer -->
                  
                  <div v-if="answerFiles[answer.ID] && answerFiles[answer.ID].length">
                    <p><strong>Fájlok:</strong></p>
                    <v-list dense>
                      <v-list-item
                        v-for="file in answerFiles[answer.ID]"
                        :key="file.ID"
                        @click="downloadFile(file)"
                        style="cursor: pointer;">
                        <v-list-item-title>{{ file.filename }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </div>
                  <div v-else>
                    <p><strong>Fájlok:</strong> Nincsenek fájlok ehhez a válaszhoz.</p>
                  </div>
                </div>
              </v-list-item>
            </v-list>
          </div>
          <div v-else>
            <p>Nincsenek megjeleníthető válaszok.</p>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="assignmentDetailsDialog = false">Bezárás</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete assignment confirmation dialog -->
    <v-dialog v-model="deleteAssignmentDialog" max-width="40vw">
      <v-card>
        <v-card-title>Biztosan törlöd a feladatot?</v-card-title>
        <v-card-actions>
          <v-btn color="error" @click="deleteThisAssignment">Törlés</v-btn>
          <v-btn color="primary" @click="deleteAssignmentDialog = false">Mégse</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </main>
</template>

<style lang="css">
#szoveg {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 15vw;
  display: inline-block;
  text-align: center;
}
</style>

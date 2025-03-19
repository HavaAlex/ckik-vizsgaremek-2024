<script setup lang="ts">
import { ref, watch } from 'vue'
import { usegetGroups, usegetGroupAsignments, getGroupAsignments } from '@/api/admin/adminQuery'
// Import the composables for file fetching from the teacher API.
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
    // Call the query function with the selected group ID.
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
  // Set the selected assignment and open the dialog
  selectedAssignmentForDetails.value = item
  assignmentDetailsDialog.value = true

  // Clear any previous file data
  assignmentFiles.value = []
  answerFiles.value = {}
  answerFilesIDs.value = []

  // Fetch the assignment files only when the dialog is opened
  await fetchAssignmentFiles(item.assignment.ID)

  // If there are answers, gather their IDs and fetch their files
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
      // Map each answer ID to its corresponding file array from the response.
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
  // Add your delete assignment API call here. For example:
  // await deleteAssignment(assignmentToDelete.value.assignment.ID, { onSuccess: () => { ... } })
  console.log("Deleting assignment:", assignmentToDelete.value.assignment.ID)
  // Remove the assignment from groupAssignments list as a visual update.
  groupAssignments.value = groupAssignments.value.filter(
    (item: any) => item.assignment.ID !== assignmentToDelete.value.assignment.ID
  )
  deleteAssignmentDialog.value = false
}

// Download file function (same as before)
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
function formatDate(dateString: Date | string) {
  if (!dateString) return "";
  const dateObj = new Date(dateString);
  return dateObj.toISOString().slice(0, 19).replace("T", " ");
}
</script>

<template>
  <main>
    <v-navigation-drawer class="bg-secondary">
      <!-- Bind the radio group with v-model to the selectedGroupForFetch -->
      <v-radio-group v-model="selectedGroupForFetch" label="Címzett osztály">
        <v-radio
          v-for="elem in Groups"
          :key="elem.group.ID"
          :label="elem.group.name"
          :value="elem.group.ID"
        ></v-radio>
      </v-radio-group>
    </v-navigation-drawer>
    <v-container>
      <v-card style="height: 40vw;">
        <v-card-title>Kiosztott házi feladatok</v-card-title>
        <v-card-text>
          <v-table style="height: 35vw;">
            <thead>
              <tr>
                <th>Feladó tanár</th>
                <th>Feladás dátuma</th>
                <th>Leírás</th>
                <th>Határidő</th>
                <th>Interakció</th>
              </tr>
            </thead>
            <!-- Render assignments if available -->
            <tbody v-if="groupAssignments && (groupAssignments.length || groupAssignments.value.length)">
              <tr v-for="item in groupAssignments" :key="item.assignment.ID">
                <td>{{ item.assignment.senderUserName }}</td>
                <td>{{ item.assignment.uploadDate }}</td>
                <td>{{ item.assignment.desc }}</td>
                <td>{{ item.assignment.deadline }}</td>
                <td>
                  <v-btn color="primary" @click="openAssignmentDetails(item)">Részletek</v-btn>
                  <v-btn color="error" @click="openDeleteAssignment(item)">Törlés</v-btn>
                </td>
              </tr>
            </tbody>
            <!-- Fallback content if no assignments -->
            <tbody v-else>
              <tr>
                <td colspan="5">Nincs megjeleníthető házi feladat</td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="console.log(Groups)">GROUPS CUCCOK</v-btn>
          <v-btn @click="console.log(groupAssignments)">DEBUG ASSIGNMENTS</v-btn>
        </v-card-actions>
      </v-card>
    </v-container>

    <!-- Dialog for viewing assignment details -->
    <v-dialog v-model="assignmentDetailsDialog" max-width="50vw">
      <v-card>
        <v-card-title>Feladat részletei</v-card-title>
        <v-card-text>
          <!-- Assignment attributes -->
          <p><strong>Feladás dátuma:</strong> {{ formatDate(selectedAssignmentForDetails?.assignment.uploadDate) }}</p>
          <p><strong>Határidő:</strong> {{ formatDate(selectedAssignmentForDetails?.assignment.deadline) }}</p>
          <p><strong>Leírás:</strong> {{ selectedAssignmentForDetails?.assignment.desc }}</p>

          <!-- Assignment files -->
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

          <!-- Answers -->
          <v-card-title style="margin-top: 20px;">Válaszok</v-card-title>
          <div v-if="selectedAssignmentForDetails?.answers && selectedAssignmentForDetails.answers.length">
            <v-list>
              <v-list-item
                v-for="(answer, index) in selectedAssignmentForDetails.answers"
                :key="answer.ID">
                <div>
                  <v-list-item-title><strong>{{ answer.senderUserName }}</strong></v-list-item-title>
                  <v-list-item-subtitle>Válasz: {{ answer.textAnswer }}</v-list-item-subtitle>
                  <!-- Files for this answer -->
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

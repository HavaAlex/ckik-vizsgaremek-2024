<script setup lang="ts">
import { ref } from 'vue'
import { usegetGroups, useCreateGroup } from '@/api/admin/adminQuery'
import type { CreatedGroup } from '@/api/admin/admin'
import * as XLSX from 'xlsx' // Ensure you have installed the xlsx package

const { mutate: CreateGroup } = useCreateGroup();

// Reactive group for new group creation
const newGroups = ref<CreatedGroup>({
  name: '',
  StudentOMIDs: []
})

// Fetch existing groups
const { data: Groups } = usegetGroups()

// Track which group is currently open
const openedGroup = ref<number | null>(null)
const toggleGroup = (index: number) => {
  openedGroup.value = openedGroup.value === index ? null : index;
}

// Dialog state for creating a new group
const newGroupDialog = ref(false)

// A temporary input for a new StudentOMID
const newStudentOMID = ref<number | null>(null)

// Add the StudentOMID entered manually to the list
const addStudentOMID = () => {
  if (newStudentOMID.value !== null && !newGroups.value.StudentOMIDs.includes(newStudentOMID.value)) {
    newGroups.value.StudentOMIDs.push(newStudentOMID.value)
    newStudentOMID.value = null
  }
}

// Remove a StudentOMID from the list when its element is clicked
const removeStudentOMID = (omid: number) => {
  newGroups.value.StudentOMIDs = newGroups.value.StudentOMIDs.filter(item => item !== omid)
}

// File input handler to read .txt, .csv, or .xlsx files
const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length) {
    const file = target.files[0]
    const fileName = file.name.toLowerCase()
    if (fileName.endsWith('.txt') || fileName.endsWith('.csv')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result
        if (typeof text === 'string') {
          const lines = text.split('\n')
          lines.forEach(line => {
            const trimmed = line.trim()
            if (trimmed) {
              const num = Number(trimmed)
              if (!isNaN(num) && !newGroups.value.StudentOMIDs.includes(num)) {
                newGroups.value.StudentOMIDs.push(num)
              }
            }
          })
        }
      }
      reader.readAsText(file)
    } else if (fileName.endsWith('.xlsx')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const data = e.target?.result
        if (data) {
          const workbook = XLSX.read(data, { type: 'binary' })
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
          jsonData.forEach((row: any) => {
            if (row && row[0] !== undefined) {
              const num = Number(row[0])
              if (!isNaN(num) && !newGroups.value.StudentOMIDs.includes(num)) {
                newGroups.value.StudentOMIDs.push(num)
              }
            }
          })
        }
      }
      reader.readAsBinaryString(file)
    }
  }
}

// Dummy function for sending the new group (you can implement the query later)
const sendNewGroup = async() => {
  console.log("Sending new group:", newGroups.value)

  await CreateGroup(newGroups.value)
  // Reset the dialog data after sending
  newGroups.value = { name: '', StudentOMIDs: [] }
  newGroupDialog.value = false
}
</script>

<template>
  <v-container>
    <v-card style="height: 30vw!important;">
      <v-card-title>Csoportok</v-card-title>
      <v-card-text>
        <div v-for="(group, index) in Groups" :key="index">
          <div 
            @click="toggleGroup(index)" 
            style="cursor: pointer; font-weight: bold; display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid #ddd;">
            <span>{{ group.group.name }}</span>
            <span>Diákok száma: {{ group.students.length }}</span>
          </div>
          
          <v-expand-transition>
            <v-table 
              v-if="openedGroup === index" 
              style="width: 60vw; max-height: 20vw; overflow-y: auto; margin-top: 10px;">
              <thead>
                <tr>
                  <th>Név</th>
                  <th>OM azonosító</th>
                  <th>E-mail</th>
                  <th>Telefonszám</th>
                  <th>Lakcím</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="student in group.students" :key="student.OMID">
                  <td>{{ student.name }}</td>
                  <td>{{ student.OMID }}</td>
                  <td>{{ student.email }}</td>
                  <td>{{ student.phone }}</td>
                  <td>{{ student.address }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-expand-transition>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="newGroupDialog = true">
          Új csoport létrehozása
        </v-btn>
      </v-card-actions>
    </v-card>

    <!-- New Group Creation Dialog -->
    <v-dialog v-model="newGroupDialog" max-width="600">
      <v-card>
        <v-card-title>Új csoport létrehozása</v-card-title>
        <v-card-text>
          <v-text-field v-model="newGroups.name" label="Csoport neve"></v-text-field>
          <v-text-field 
            v-model.number="newStudentOMID" 
            label="Diák OMID" 
            type="number">
          </v-text-field>
          <v-btn @click="addStudentOMID">Hozzáad</v-btn>
          
          <!-- Display added StudentOMIDs -->
          <v-list>
            <v-list-item 
              v-for="(omid, index) in newGroups.StudentOMIDs" 
              :key="index"
              @click="removeStudentOMID(omid)"
              style="cursor: pointer;"
            >
              <v-list-item-content>{{ omid }}</v-list-item-content>
            </v-list-item>
          </v-list>

          <!-- File input for bulk upload -->
          <v-file-input 
            label="Fájl feltöltése (.txt, .csv, .xlsx)" 
            accept=".txt,.csv,.xlsx"
            @change="onFileChange"
          ></v-file-input>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn  @click="newGroupDialog = false">Mégse</v-btn>
          <v-btn color="primary" @click="sendNewGroup">Küldés</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { usegetGroups, useCreateGroup, useAddUsersToGroup } from '@/api/admin/adminQuery'
import type { CreatedGroup } from '@/api/admin/admin'
import * as XLSX from 'xlsx'

const { mutate: CreateGroup } = useCreateGroup()
const { mutate: AddUsers } = useAddUsersToGroup()
const newGroups = ref<CreatedGroup>({
  name: '',
  StudentOMIDs: []
})
const { data: Groups } = usegetGroups()

const selectedGroup = ref<{ id: number, name: string, students: any[] } | null>(null)
const groupDialog = ref(false)

const editedGroup = ref<{ id: number, StudentOMIDs: number[] }>({ id: 0, StudentOMIDs: [] })

const openGroupDialog = (group: any) => {
  console.log("Opening group dialog with group:", group); // Debugging

  if (!group?.group?.ID) {
    console.error("Group ID is missing!", group);
    return;
  }

  selectedGroup.value = { 
    id: group.group.ID, 
    name: group.group.name, 
    students: group.students 
  };

  editedGroup.value = { 
    id: group.group.ID,  // ✅ Ensure ID is correctly assigned
    StudentOMIDs: [] 
  };

  console.log("Selected group ID:", selectedGroup.value.id);
  console.log("Edited group ID:", editedGroup.value.id); // Debugging

  groupDialog.value = true;
};

//====================================================
const newGroupDialog = ref(false)
const newStudentOMID = ref<number | null>(null)

const addStudentOMID = (targetGroup: 'new' | 'edit') => {
  if (newStudentOMID.value !== null) {
    const targetList = targetGroup === 'new' ? newGroups.value.StudentOMIDs : editedGroup.value.StudentOMIDs
    if (!targetList.includes(newStudentOMID.value)) {
      targetList.push(newStudentOMID.value)
    }
    newStudentOMID.value = null
  }
}

const removeStudentOMID = (omid: number, targetGroup: 'new' | 'edit') => {
  if (targetGroup === 'new') {
    newGroups.value.StudentOMIDs = newGroups.value.StudentOMIDs.filter(item => item !== omid)
  } else {
    editedGroup.value.StudentOMIDs = editedGroup.value.StudentOMIDs.filter(item => item !== omid)
  }
}

const onFileChange = (event: Event, targetGroup: 'new' | 'edit') => {
  const targetList = targetGroup === 'new' ? newGroups.value.StudentOMIDs : editedGroup.value.StudentOMIDs
  const target = event.target as HTMLInputElement

  if (target.files && target.files.length) {
    const file = target.files[0]
    const reader = new FileReader()

    reader.onload = (e) => {
      const text = e.target?.result
      if (typeof text === 'string') {
        const lines = text.split('\n')
        lines.forEach(line => {
          const num = Number(line.trim())
          if (!isNaN(num) && !targetList.includes(num)) {
            targetList.push(num)
          }
        })
      }
    }
    reader.readAsText(file)
  }
}

const sendNewGroup = async () => {
  await CreateGroup(newGroups.value)
  newGroups.value = { name: '', StudentOMIDs: [] }
  newGroupDialog.value = false
}

const sendEditedGroup = async () => {
  if (editedGroup.value.StudentOMIDs.length > 0) {
    await AddUsers({ id: editedGroup.value.id, StudentOMIDs: editedGroup.value.StudentOMIDs })
    editedGroup.value.StudentOMIDs = []
    groupDialog.value = false
  }
}
</script>

<template>
  <v-container>
    <v-card >
      <v-card-title>Csoportok</v-card-title>
      <v-card-text>
        <v-list style="height: 30vw;" >
          <v-list-item v-for="(group, index) in Groups" :key="index" @click="openGroupDialog(group)" style="cursor: pointer;">
            <v-list-item-content>
              <v-list-item-title>{{ group.group.name }}</v-list-item-title>
              <v-list-item-subtitle>Diákok száma: {{ group.students.length }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="newGroupDialog = true">Új csoport létrehozása</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>

  <!-- New Group Creation Dialog -->
  <v-dialog v-model="newGroupDialog" max-width="600">
    <v-card>
      <v-card-title>Új csoport létrehozása</v-card-title>
      <v-card-text>
        <v-text-field v-model="newGroups.name" label="Csoport neve"></v-text-field>
        <v-text-field v-model.number="newStudentOMID" label="Diák OMID" type="number"></v-text-field>
        <v-btn @click="addStudentOMID('new')">Hozzáad</v-btn>

        <v-list>
          <v-list-item v-for="(omid, index) in newGroups.StudentOMIDs" :key="index" @click="removeStudentOMID(omid, 'new')" style="cursor: pointer;">
            <v-list-item-content>{{ omid }}</v-list-item-content>
          </v-list-item>
        </v-list>

        <v-file-input label="Fájl feltöltése (.txt, .csv, .xlsx)" accept=".txt,.csv,.xlsx" @change="onFileChange($event, 'new')"></v-file-input>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="newGroupDialog = false">Mégse</v-btn>
        <v-btn color="primary" @click="sendNewGroup">Küldés</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Group Details Dialog -->
  <v-dialog v-model="groupDialog" max-width="800">
    <v-card v-if="selectedGroup">
      <v-card-title>{{ selectedGroup.name }}</v-card-title>
      <v-card-text>
        <v-table>
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
            <tr v-for="student in selectedGroup.students" :key="student.OMID">
              <td>{{ student.name }}</td>
              <td>{{ student.OMID }}</td>
              <td>{{ student.email }}</td>
              <td>{{ student.phone }}</td>
              <td>{{ student.address }}</td>
            </tr>
          </tbody>
        </v-table>

        <h2>Új tanulók hozzáadása</h2>
        <v-text-field v-model.number="newStudentOMID" label="Diák OMID" type="number"></v-text-field>
        <v-btn @click="addStudentOMID('edit')">Hozzáad</v-btn>

        <v-list>
          <v-list-item v-for="(omid, index) in editedGroup.StudentOMIDs" :key="index" @click="removeStudentOMID(omid, 'edit')" style="cursor: pointer;">
            <v-list-item-content>{{ omid }}</v-list-item-content>
          </v-list-item>
        </v-list>

        <v-file-input label="Fájl feltöltése (.txt, .csv, .xlsx)" accept=".txt,.csv,.xlsx" @change="onFileChange($event, 'edit')"></v-file-input>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="groupDialog = false">Bezárás</v-btn>
        <v-btn color="primary" @click="sendEditedGroup">Hozzáadás</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

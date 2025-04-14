<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import type { Teacher, Student, Guardian,User,SelectedUser,uploadedOMIDdata } from '@/api/admin/admin';
import * as XLSX from 'xlsx';

import { 
  useaaddTeacherUsers,
  useaddStudentUsers,
  useaddGuardianUsers,
  usegetUsers,
  getUser,
  usemodifyUser,
  usedeleteUser,
  useAddStudentsToGuardians
} from '@/api/admin/adminQuery';
import {useRouter} from 'vue-router'
const Router = useRouter()
const { mutate: addTeacherUsers } = useaaddTeacherUsers();
const { mutate: addStudentUsers } = useaddStudentUsers();
const { mutate: addGuardianUsers } = useaddGuardianUsers();
const { mutate: modifyUser } = usemodifyUser();
const { mutate: deleteUser } = usedeleteUser();
const { mutate: AddStudentsToGuardians } = useAddStudentsToGuardians()
const { data: userList } = usegetUsers();

// Rendezése és keresés
const sortKey = ref<string>('username');
const sortOrder = ref<'asc' | 'desc'>('asc');
const searchQuery = ref<string>(''); 

const sortedUsers = computed(() => {
  if (!userList.value) return [];
  let filteredUsers = [...userList.value];
  if (searchQuery.value.trim() !== '') {
    filteredUsers = filteredUsers.filter(user =>
      user.username.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }
  return filteredUsers.sort((a, b) => {
    const key = sortKey.value;
    let valA = a[key];
    let valB = b[key];
    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();
    if (valA < valB) return sortOrder.value === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder.value === 'asc' ? 1 : -1;
    return 0;
  });
});

function changeSort(column: string) {
  if (sortKey.value === column) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = column;
    sortOrder.value = 'asc';
  }
}

//Tanár hozzáadás
const showTeacherDialog = ref(false);
const teachers = ref<Teacher[]>([]);
const newTeacher = ref<Teacher>({
  ID:-1,
  name: '',
  phone: '',
  email: '',
  birth_Date: new Date()
});

function addTeacher() {
  if (!newTeacher.value.name || !newTeacher.value.phone || !newTeacher.value.email) return;
  teachers.value.push({ ...newTeacher.value });
  newTeacher.value = {ID:-1, name: '', phone: '', email: '', birth_Date: new Date() };
}

function removeTeacher(index: number) {
  teachers.value.splice(index, 1);
}

const selectedFiles = ref<File[]>([]);

function processFile(file: File): Promise<Teacher[]> {
  return new Promise((resolve, reject) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    if (extension === 'csv' || extension === 'txt') {
      reader.onload = () => {
        const text = reader.result as string;
        const delimiter = extension === 'txt' ? '\t' : ';';
        const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
        const rows = lines.map(line => line.split(delimiter));
        const validRows = rows.filter(cols => cols.length >= 4);
        const teachersFromFile: Teacher[] = validRows.map(cols => ({
          ID:-1,
          name: cols[0].trim(),
          phone: cols[1].trim(),
          email: cols[2].trim(),
          birth_Date: new Date(cols[3].trim())
        }));
        resolve(teachersFromFile);
      };
      reader.readAsText(file);
    } else if (extension === 'xlsx') {
      reader.onload = () => {
        const data = reader.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const teachersFromFile: Teacher[] = [];
        jsonData.forEach(row => {
          if (row && row.length >= 4) {
            teachersFromFile.push({
              ID:-1,
              name: String(row[0]).trim(),
              phone: String(row[1]).trim(),
              email: String(row[2]).trim(),
              birth_Date: new Date(row[3])
            });
          }
        });
        resolve(teachersFromFile);
      };
      reader.readAsBinaryString(file);
    } else {
      resolve([]);
    }
  });
}

async function sendTeachers() {
  if (selectedFiles.value.length) {
    for (const file of selectedFiles.value) {
      try {
        const teachersFromFile = await processFile(file);
        teachers.value.push(...teachersFromFile);
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
      }
    }
  }
  console.log("Teachers array:", teachers.value);
}

// Diák hozzáadás
const showStudentDialog = ref(false);
const students = ref<Student[]>([]);
const newStudent = ref<Student>({
  ID:-1,
  name: '',
  birth_Date: new Date(),
  address: '',
  phone: '',
  email: '',
  OM_ID: ''
});

function addStudent() {
  if (
    !newStudent.value.name || 
    !newStudent.value.address || 
    !newStudent.value.phone ||
    !newStudent.value.email || 
    !newStudent.value.OM_ID
  ) return;
  students.value.push({ ...newStudent.value });
  newStudent.value = {ID:-1, name: '', birth_Date: new Date(), address: '', phone: '', email: '', OM_ID: '' };
}

function removeStudent(index: number) {
  students.value.splice(index, 1);
}

const selectedStudentFiles = ref<File[]>([]);

function processStudentFile(file: File): Promise<Student[]> {
  return new Promise((resolve, reject) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    if (extension === 'csv' || extension === 'txt') {
      reader.onload = () => {
        const text = reader.result as string;
        const delimiter = extension === 'txt' ? '\t' : ';';
        const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
        const rows = lines.map(line => line.split(delimiter));
        const validRows = rows.filter(cols => cols.length >= 6);
        const studentsFromFile: Student[] = validRows.map(cols => ({
          ID:-1,
          name: cols[0].trim(),
          birth_Date: new Date(cols[1].trim()),
          address: cols[2].trim(),
          phone: cols[3].trim(),
          email: cols[4].trim(),
          OM_ID: cols[5].trim()
        }));
        resolve(studentsFromFile);
      };
      reader.readAsText(file);
    } else if (extension === 'xlsx') {
      reader.onload = () => {
        const data = reader.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const studentsFromFile: Student[] = [];
        jsonData.forEach(row => {
          if (row && row.length >= 6) {
            studentsFromFile.push({
              ID:-1,
              name: String(row[0]).trim(),
              birth_Date: new Date(row[1]),
              address: String(row[2]).trim(),
              phone: String(row[3]).trim(),
              email: String(row[4]).trim(),
              OM_ID: String(row[5]).trim()
            });
          }
        });
        resolve(studentsFromFile);
      };
      reader.readAsBinaryString(file);
    } else {
      resolve([]);
    }
  });
}

async function sendStudents() {
  if (selectedStudentFiles.value.length) {
    for (const file of selectedStudentFiles.value) {
      try {
        const studentsFromFile = await processStudentFile(file);
        students.value.push(...studentsFromFile);
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
      }
    }
  }
  console.log("Students array:", students.value);
}

// Szülő hozzáadás
const showParentDialog = ref(false);
const guardians = ref<Guardian[]>([]);
const newGuardian = ref<Guardian>({
  name: '',
  birth_Date: new Date(),
  address: '',
  phone: '',
  email: '',
  RelatedStudents: [] as unknown as number[]
});

const newGuardianRelatedOMID = ref('');

function addGuardianRelatedOMID() {
  if (!newGuardianRelatedOMID.value.trim()) return;
  const omid = Number(newGuardianRelatedOMID.value.trim());
  if (!isNaN(omid)) {
    (newGuardian.value.RelatedStudents as number[]).push(omid);
    newGuardianRelatedOMID.value = '';
  }
}

function removeGuardianRelatedOMID(index: number) {
  (newGuardian.value.RelatedStudents as number[]).splice(index, 1);
}

function addGuardian() {
  if (
    !newGuardian.value.name ||
    !newGuardian.value.address ||
    !newGuardian.value.phone ||
    !newGuardian.value.email
  ) return;
  guardians.value.push({ ...newGuardian.value });
  newGuardian.value = {
    name: '',
    birth_Date: new Date(),
    address: '',
    phone: '',
    email: '',
    RelatedStudents: [] as unknown as number[]
  };
  newGuardianRelatedOMID.value = '';
}

const selectedGuardianFiles = ref<File[]>([]);

function processGuardianFile(file: File): Promise<Guardian[]> {
  return new Promise((resolve, reject) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    if (extension === 'csv' || extension === 'txt') {
      reader.onload = () => {
        const text = reader.result as string;
        const primaryDelimiter = extension === 'txt' ? '\t' : ';';
        const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
        const guardiansFromFile: Guardian[] = [];
        lines.forEach(line => {
          let cols = line.split(primaryDelimiter);
          if (cols.length < 5) {
            cols = line.split(/\s+/);
          }
          if (cols.length >= 5) {
            const name = cols[0].trim();
            const birth_Date = new Date(cols[1].trim());
            const address = cols[2].trim();
            let phone = "";
            let email = "";
            let relatedStr = "";
            if (cols.length === 5) {
              email = cols[3].trim();
              relatedStr = cols[4].trim();
            } else {
              phone = cols[3].trim();
              email = cols[4].trim();
              relatedStr = cols[5].trim();
            }
            const relatedStudents = relatedStr
              .split(',')
              .map(item => Number(item.trim()))
              .filter(x => !isNaN(x));
            guardiansFromFile.push({
              name,
              birth_Date,
              address,
              phone,
              email,
              RelatedStudents: relatedStudents as unknown as number[]
            });
          }
        });
        resolve(guardiansFromFile);
      };
      reader.readAsText(file);
    } else if (extension === 'xlsx') {
      reader.onload = () => {
        const data = reader.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const guardiansFromFile: Guardian[] = [];
        jsonData.forEach(row => {
          if (row && row.length >= 5) {
            const name = String(row[0]).trim();
            const birth_Date = new Date(row[1]);
            const address = String(row[2]).trim();
            let phone = "";
            let email = "";
            let relatedStr = "";
            if (row.length === 5) {
              email = String(row[3]).trim();
              relatedStr = String(row[4]).trim();
            } else {
              phone = String(row[3]).trim();
              email = String(row[4]).trim();
              relatedStr = String(row[5]).trim();
            }
            const relatedStudents = String(relatedStr)
              .split(',')
              .map(item => Number(item.trim()))
              .filter(x => !isNaN(x));
            guardiansFromFile.push({
              name,
              birth_Date,
              address,
              phone,
              email,
              RelatedStudents: relatedStudents as unknown as number[]
            });
          }
        });
        resolve(guardiansFromFile);
      };
      reader.readAsBinaryString(file);
    } else {
      resolve([]);
    }
  });
}

async function sendGuardians() {
  if (selectedGuardianFiles.value.length) {
    for (const file of selectedGuardianFiles.value) {
      try {
        const guardiansFromFile = await processGuardianFile(file);
        guardians.value.push(...guardiansFromFile);
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
      }
    }
  }
  console.log("Guardians array:", guardians.value);
}

// ----------------- Új user feltöltés -----------------

function submitTeachers() {
  if (!teachers.value.length) return;
  addTeacherUsers(teachers.value, {
    onSuccess: (response) => {
      console.log("addTeacherUsers response:", response);
      const textContent = JSON.stringify(response, null, 2);
      const blob = new Blob([textContent], { type: 'text/plain' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'addTeacherUsersResponse.txt';
      link.click();
      URL.revokeObjectURL(link.href);
      teachers.value = [];
      showTeacherDialog.value = false;
    },
    onError: (error) => {
      console.error("Error uploading teachers:", error);
    }
  });
}

function submitStudents() {
  if (!students.value.length) return;
  addStudentUsers(students.value, {
    onSuccess: (response) => {
      console.log("addStudentUsers response:", response);
      const textContent = JSON.stringify(response, null, 2);
      const blob = new Blob([textContent], { type: 'text/plain' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'addStudentUsersResponse.txt';
      link.click();
      URL.revokeObjectURL(link.href);
      students.value = [];
      showStudentDialog.value = false;
    },
    onError: (error) => {
      console.error("Error uploading students:", error);
    }
  });
}

function submitGuardians() {
  if (!guardians.value.length) return;
  addGuardianUsers(guardians.value, {
    onSuccess: (response) => {
      console.log("addGuardianUsers response:", response);
      const textContent = JSON.stringify(response, null, 2);
      const blob = new Blob([textContent], { type: 'text/plain' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'addGuardianUsersResponse.txt';
      link.click();
      URL.revokeObjectURL(link.href);
      guardians.value = [];
      showParentDialog.value = false;
    },
    onError: (error) => {
      console.error("Error uploading guardians:", error);
    }
  });
}

const viewUserDialog = ref(false);
const DeleteUserDialog = ref(false);
const selectedUserForView = ref(null);
const SelectedUserData = ref<SelectedUser>({
  roleSide: null,
  userRole: 'asd',
  userSide: -1
});
console.log("MMMMMMMMMMM")
console.log(SelectedUserData)
console.log("MMMMMMMMMMM")
async function openSelectedUserDialog(user: any) {
  try {
    const data = await getUser(user.ID);
    console.log("ő az : ", data)
    SelectedUserData.value = { ...data };
    viewUserDialog.value = true;
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}

async function fastdelete(user: any) {
  try {
    const data = await getUser(user.ID);
    SelectedUserData.value = { ...data };
    
    DeleteUserDialog.value = true;
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}

function closeSelectedUserDialog() {
  SelectedUserData.value = {
    roleSide: null,
    userRole: 'asd',
    userSide: -1
  };
  viewUserDialog.value = false;
}



async function deleteUserfunction() {
  await deleteUser(SelectedUserData.value.userSide, {
    onSuccess: (response) => {
      console.log("Deletion result:", response);
      if(userList.value){
        userList.value = userList.value.filter(user => user.ID !== SelectedUserData.value.userSide);
      }
      DeleteUserDialog.value = false;
      viewUserDialog.value = false;
    }
  });
}

function formatDate(dateString: Date | string) {
  if (!dateString) return "";
  const dateObj = new Date(dateString);
  return dateObj.toISOString().slice(0, 19).replace("T", " ");
}




const newBelongingOMID = ref<string>('');


function addBelongingOMID() {
  const omid = newBelongingOMID.value.trim();
  if (!omid) return;
  if(SelectedUserData.value.belongingStudents){
    SelectedUserData.value.belongingStudents.push({
      ID:-1,
      name: '',
      birth_Date: new Date(),
      address: '',
      phone: '',
      email: '',
      OM_ID: omid
    });
    newBelongingOMID.value = '';
  }

}


function removeBelongingStudent(index: number) {
  if(SelectedUserData.value.belongingStudents){
    SelectedUserData.value.belongingStudents.splice(index, 1);
  }

}

const uploadedOMiddata = ref<uploadedOMIDdata>({
  szuloID:"-1",
  newOMIDs: [-1]
})
async function updateSzuloOMIDs() {
  const szuloID = SelectedUserData.value.roleSide.ID;
  console.log("Ő A SZERENCSÉTLEN: ", SelectedUserData.value)
  if(SelectedUserData.value.belongingStudents){
    const newOMIDs = SelectedUserData.value.belongingStudents
      .map(student => Number(student.OM_ID));
    console.log("Updating Szulo OMIDs:", { szuloID, newOMIDs });
    uploadedOMiddata.value.szuloID = szuloID
    uploadedOMiddata.value.newOMIDs = newOMIDs
    await AddStudentsToGuardians(uploadedOMiddata)
  }

}


async function uploadChangedUser() {
  console.log("Modifying user:", SelectedUserData.value);
  await modifyUser(SelectedUserData.value);
    if(SelectedUserData.value.belongingStudents){
    updateSzuloOMIDs()
  }
  SelectedUserData.value = {
    roleSide: null,
    userRole: 'asd',
    userSide: -1
  };;
  viewUserDialog.value = false;

}



//itt kezdődik a forgatásnak a figyelése
const isPortrait = ref(window.matchMedia("(orientation: portrait)").matches);
const updateOrientation = () => {
  isPortrait.value = window.matchMedia("(orientation: portrait)").matches;
};
onMounted(() => {
  window.matchMedia("(orientation: portrait)").addEventListener("change", updateOrientation);
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
          <v-card-title>Felhasználók kezelése:</v-card-title>
          <!-- Kereső -->
          <v-card-text>
            <div v-if="userList?.length">
              <p> Felhasználók száma: {{ userList.length }}</p>
            </div>
            
            <v-text-field
              v-model="searchQuery"
              label="Keresés felhasználónév alapján"
              clearable
            ></v-text-field>
          </v-card-text>
          <v-card-text style="height: 80vw !important; overflow-y: auto;">
            <v-card-text>
              <v-select
                v-model="sortKey"
                :items="['username', 'ID', 'role']"
                label="Rendezés"
                @change="changeSort(sortKey)"
                clearable
              ></v-select>
            </v-card-text>
              <v-list>
                <v-list-item v-for="user in sortedUsers" :key="user.ID" style="width: 80vw;">
                  <strong>Felhasználónév: </strong>{{ user.username }}<br>
                  <strong>Azonosító: </strong>{{ user.ID }}<br>
                  <strong>Szerepkör: </strong>{{ user.role }}<br>
                  <v-btn  color="primary" @click="console.log(user); openSelectedUserDialog(user)">Felhasználó módosítása</v-btn><br>
                  <v-btn color="error" @click="fastdelete(user)">Felhasználó törlése</v-btn>
                </v-list-item>
              </v-list>
            
          </v-card-text>
        </v-card>
          
        
        <v-card>
          <v-card-title>Új felhasználók hozzáadása</v-card-title>
          <v-card-text>
            <v-btn color="primary" @click="showStudentDialog = true">Diákok hozzáadása</v-btn>
            <v-btn color="primary" @click="showTeacherDialog = true">Tanárok hozzáadása</v-btn>
            <v-btn color="primary" @click="showParentDialog = true">Gondviselők hozzáadása</v-btn>
          </v-card-text>
        </v-card>
      </v-container>
      <v-dialog v-model="DeleteUserDialog" max-width="80vw" theme="dark">
        <v-card>
          <v-card-title>Biztos törölni akarja?</v-card-title>
          <v-card-text>A felhasználó törlésével minden vele kapcsolatos adat eltűnik és nem lehet visszaállítani</v-card-text>
          <v-card-actions>
            <v-btn @click="deleteUserfunction">Törlés</v-btn>
            <v-btn @click="DeleteUserDialog = false">Mégse</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

    </div>
    <div v-else>
      <v-container>
        <v-card>
          <v-card-title>Felhasználók kezelése:</v-card-title>
          <!-- Kereső -->
          <v-card-text>
            <div v-if="userList?.length">
              <p> Felhasználók száma: {{ userList.length }}</p>
            </div>
            <v-text-field
              v-model="searchQuery"
              label="Keresés felhasználónév alapján"
              clearable
            ></v-text-field>
          </v-card-text>
          <v-card-text style="height: 25vw !important; overflow-y: auto;">
            <v-table>
              <thead>
                <tr>
                  <th @click="changeSort('username')">
                    Név 
                    <span v-if="sortKey==='username'">
                      {{ sortOrder==='asc' ? '▲' : '▼' }}
                    </span>
                  </th>
                  <th @click="changeSort('ID')">
                    Azonosító 
                    <span v-if="sortKey==='ID'">
                      {{ sortOrder==='asc' ? '▲' : '▼' }}
                    </span>
                  </th>
                  <th @click="changeSort('role')">
                    Szerepkör 
                    <span v-if="sortKey==='role'">
                      {{ sortOrder==='asc' ? '▲' : '▼' }}
                    </span>
                  </th>
                  <th>Interakció</th>
                </tr>
              </thead>
              <tbody style="height: 23vw !important; overflow-y: auto;">
                <tr v-for="user in sortedUsers" :key="user.ID">
                  <td>{{ user.username }}</td>
                  <td>{{ user.ID }}</td>
                  <td>{{ user.role }}</td>
                  <td>
                    <v-btn color="primary" @click="console.log(user); openSelectedUserDialog(user)">Felhasználó módosítása</v-btn>
                    <v-btn color="error" @click="fastdelete(user)">Felhasználó törlése</v-btn>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
          
        
        <v-card>
          <v-card-title>Új felhasználók hozzáadása</v-card-title>
          <v-card-text>
            <v-btn color="primary" @click="showStudentDialog = true">Diákok hozzáadása</v-btn>
            <v-btn color="primary" @click="showTeacherDialog = true">Tanárok hozzáadása</v-btn>
            <v-btn color="primary" @click="showParentDialog = true">Gondviselők hozzáadása</v-btn>
          </v-card-text>
        </v-card>
      </v-container>
      <v-dialog v-model="DeleteUserDialog" max-width="50vw" theme="dark">
        <v-card>
          <v-card-title>Biztos törölni akarja?</v-card-title>
          <v-card-text>A felhasználó törlésével minden vele kapcsolatos adat eltűnik és nem lehet visszaállítani</v-card-text>
          <v-card-actions>
            <v-btn @click="deleteUserfunction">Törlés</v-btn>
            <v-btn @click="DeleteUserDialog = false">Mégse</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

    </div>
    
      <!-- Tanárok dialog -->
      <v-dialog v-model="showTeacherDialog" max-width="600">
        <v-card>
          <v-card-title>Tanárok hozzáadása</v-card-title>
          <v-card-text>
            <h1>Tanárok manuális hozzáadása:</h1>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="newTeacher.name" label="Név" required></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="newTeacher.phone" label="Telefon" required></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="newTeacher.email" label="Email" required></v-text-field>
                </v-col>
                <v-text-field v-model="newTeacher.birth_Date" label="Születési dátum" type="date" required></v-text-field>
                <v-col cols="12">
                  <v-btn color="primary" @click="addTeacher">Tanár hozzáadása</v-btn>
                </v-col>
              </v-row>
            </v-container>
            
            <h1>Tanárok fájlból történő feltöltése</h1>
            <h3>Kizárólag txt, csv és xlsx fájlok tölthetők fel!</h3>
            <h6>(A txt fájlban az adattagokat tabulátorral elválasztva kell megadni)</h6>
            <v-file-input 
              label="Fájlok feltöltése (egyszerre)"
              multiple
              v-model="selectedFiles"
              accept=".txt, .csv, .xlsx"
              show-size
              counter
            ></v-file-input>
            <v-btn color="primary" :disabled="teachers.length === 0 && selectedFiles.length === 0" @click="sendTeachers">Fájlok beolvasása</v-btn>
          </v-card-text>
          
          <v-card-text>
            <h1>Bekerülő tanárok listája:</h1>
            <v-list>
              <v-list-item v-for="(teacher, index) in teachers" :key="index" @click="removeTeacher(index)">
                <v-list-item-title>{{ teacher.name }} - {{ teacher.email }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-actions>
            <v-btn color="secondary" @click="showTeacherDialog = false">Bezárás</v-btn>
            <v-btn color="primary" @click="submitTeachers">Feltöltés az adatbázisba</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Diákok dialog -->
      <v-dialog v-model="showStudentDialog" max-width="600">
        <v-card>
          <v-card-title>Diákok hozzáadása</v-card-title>
          <v-card-text>
            <h1>Diákok manuális hozzáadása:</h1>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="newStudent.name" label="Név" required></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="newStudent.birth_Date" label="Születési dátum" type="date" required></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="newStudent.address" label="Cím" required></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="newStudent.phone" label="Telefon" required></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="newStudent.email" label="Email" required></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="newStudent.OM_ID" label="OM azonosító" required></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-btn color="primary" @click="addStudent">Diák hozzáadása</v-btn>
                </v-col>
              </v-row>
            </v-container>
            
            <h1>Diákok fájlból történő feltöltése</h1>
            <h3>Kizárólag txt, csv és xlsx fájlok tölthetők fel!</h3>
            <h6>(A txt fájlban az adattagokat tabulátorral elválasztva kell megadni)</h6>
            <v-file-input 
              label="Fájlok feltöltése (egyszerre)"
              multiple
              v-model="selectedStudentFiles"
              accept=".txt, .csv, .xlsx"
              show-size
              counter
            ></v-file-input>
            <v-btn color="primary" :disabled="students.length === 0 && selectedStudentFiles.length === 0" @click="sendStudents">Fájlok beolvasása</v-btn>
          </v-card-text>
          
          <v-card-text>
            <h1>Bekerülő diákok listája:</h1>
            <v-list>
              <v-list-item v-for="(student, index) in students" :key="index" @click="removeStudent(index)">
                <v-list-item-title>{{ student.name }} - {{ student.email }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-actions>
            <v-btn color="secondary" @click="showStudentDialog = false">Bezárás</v-btn>
            <v-btn color="primary" @click="submitStudents">Feltöltés az adatbázisba</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Szülők dialog -->
      <v-dialog v-model="showParentDialog" max-width="600">
        <v-card>
          <v-card-title>Gondviselők hozzáadása</v-card-title>
          <v-card-text>
            <h1>Gondviselők manuális hozzáadása:</h1>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="newGuardian.name" label="Név" required></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="newGuardian.birth_Date" label="Születési dátum" type="date" required></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="newGuardian.address" label="Cím" required></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="newGuardian.phone" label="Telefon" required></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="newGuardian.email" label="Email" required></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="newGuardianRelatedOMID"
                    label="Diák OM azonosító"
                    hint="Adja meg a diák OM azonosítót"
                    required
                  ></v-text-field>
                  <v-btn color="primary" @click="addGuardianRelatedOMID">OM azonosító hozzáadása</v-btn>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <h3>Hozzáadott diák OM azonosítók:</h3>
                  <v-list>
                    <v-list-item 
                      v-for="(omid, index) in newGuardian.RelatedStudents" 
                      :key="index" 
                      @click="removeGuardianRelatedOMID(index)"
                    >
                      <v-list-item-title>{{ omid }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-col>
              </v-row>
              <v-btn color="primary" @click="addGuardian">Gondviselők hozzáadása</v-btn>
            </v-container>
          </v-card-text>
          
          <v-card-text>
            <h1>Gondviselők fájlból történő feltöltése</h1>
            <h3>Kizárólag txt, csv és xlsx fájlok tölthetők fel!</h3>
            <h6>
              (A txt fájlban az adattagokat tabulátorral elválasztva kell megadni. 
               Az utolsó oszlopban a diák OM azonosítókat vesszővel elválasztva add meg.)
            </h6>
            <v-file-input 
              label="Fájlok feltöltése (egyszerre)"
              multiple
              v-model="selectedGuardianFiles"
              accept=".txt, .csv, .xlsx"
              show-size
              counter
            ></v-file-input>
            <v-btn color="primary" :disabled="guardians.length === 0 && selectedGuardianFiles.length === 0" @click="sendGuardians">Fájlok beolvasása</v-btn>
          </v-card-text>
          
          <v-card-text>
            <h1>Bekerülő gondviselők listája:</h1>
            <v-list>
              <v-list-item 
                v-for="(guardian, index) in guardians" 
                :key="index" 
                @click="guardians.splice(index, 1)"
              >
                <v-list-item-title>{{ guardian.name }} - {{ guardian.email }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-actions>
            <v-btn color="secondary" @click="showParentDialog = false">Bezárás</v-btn>
            <v-btn color="primary" @click="submitGuardians">Feltöltés az adatbázisba</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Felhasználó megtekintése -->
      <v-dialog v-model="viewUserDialog">
        <v-card>
          <v-card-title>Kiválasztott felhasználó adatai</v-card-title>
           
          <div v-if="SelectedUserData.userRole==='tanar'">
            <v-card-text>
              <h3>Felhasználó típusa : {{ SelectedUserData.userRole }}</h3>
              <v-text-field label="Felhasználónév: " v-model="SelectedUserData.roleSide.name"></v-text-field>
              <v-text-field label="Email cím: " v-model="SelectedUserData.roleSide.email"></v-text-field>
              <v-text-field label="Mobiltelefonszám: " v-model="SelectedUserData.roleSide.phone"></v-text-field>
            </v-card-text>
          </div>

          <div v-else-if="SelectedUserData.userRole==='szulo'">
            <v-card-text>
              <h3>Felhasználó típusa : {{ SelectedUserData.userRole }}</h3>
              <v-text-field label="Felhasználónév: " v-model="SelectedUserData.roleSide.name"></v-text-field>
              <v-text-field label="Email cím: " v-model="SelectedUserData.roleSide.email"></v-text-field>
              <v-text-field label="Mobiltelefonszám: " v-model="SelectedUserData.roleSide.phone"></v-text-field>
              <p>Ehhez a gondviselőhöz tartozó diákok OM azonosítói:</p>
              <v-list>
                <v-list-item
                  v-for="(student, index) in SelectedUserData.belongingStudents"
                  :key="index"
                  @click="removeBelongingStudent(index)"
                >
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ student.OM_ID }} <span v-if="student.name"> - {{ student.name }}  </span> (kattintson az eltávolításhoz)
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>

              <v-text-field 
                v-model="newBelongingOMID" 
                label="Új OMID hozzáadása" 
                type="number"
              ></v-text-field>
              <v-btn color="primary" @click="addBelongingOMID">Hozzáadás</v-btn>
            </v-card-text>
          </div>

          <div v-else-if="SelectedUserData.userRole==='diak'">
            <v-card-text>
              <h3>Felhasználó típusa : {{ SelectedUserData.userRole }}</h3>
              <v-text-field label="Felhasználónév: " v-model="SelectedUserData.roleSide.name"></v-text-field>
              <v-text-field label="Születési dátum" v-model="SelectedUserData.roleSide.DoB" required></v-text-field>
              <v-text-field label="Email cím: " v-model="SelectedUserData.roleSide.email"></v-text-field>
              <v-text-field label="Mobiltelefonszám: " v-model="SelectedUserData.roleSide.phone"></v-text-field>
              <v-text-field label="OM azonosító: " v-model="SelectedUserData.roleSide.OMID"></v-text-field>
              <v-text-field label="Lakcím : " v-model="SelectedUserData.roleSide.address"></v-text-field>
            </v-card-text>
          </div>
          <div v-else-if="SelectedUserData.userRole==='admin'">
            <v-card-text>
              <h3>Felhasználó típusa : {{ SelectedUserData.userRole }}</h3>
              <v-text-field label="Felhasználónév: " v-model="SelectedUserData.roleSide.name"></v-text-field>
              <v-text-field label="Email cím: " v-model="SelectedUserData.roleSide.email"></v-text-field>
              <v-text-field label="Mobiltelefonszám: " v-model="SelectedUserData.roleSide.phone"></v-text-field>
            </v-card-text>
          </div>
          <v-card-actions>
            <v-btn @click="closeSelectedUserDialog">Bezárás</v-btn>
            <v-btn color="primary" @click="uploadChangedUser">Módosítás</v-btn>
            <v-btn color="error" @click="DeleteUserDialog = true">Törlés</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>


    
  </main>
</template>
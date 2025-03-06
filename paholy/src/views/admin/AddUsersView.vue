<script setup lang="ts">
import { ref } from 'vue';
import type { Teacher } from '@/api/admin/admin';
import * as XLSX from 'xlsx'; // Ensure you have installed the xlsx package

import { 
  useaaddTeacherUsers
} from '@/api/admin/adminQuery';

const {mutate: addTeacherUsers} = useaaddTeacherUsers()

const selectedFiles = ref<File[]>([]);

// Dialog state
const showStudentDialog = ref(false);
const showTeacherDialog = ref(false);
const showParentDialog = ref(false);

// Teachers array
const teachers = ref<Teacher[]>([]);

// New teacher form data
const newTeacher = ref<Teacher>({
  name: '',
  phone: '',
  email: '',
  birth_Date: new Date()
});

// Function to add teacher manually
const addTeacher = () => {
  if (!newTeacher.value.name || !newTeacher.value.phone || !newTeacher.value.email) return;
  teachers.value.push({ ...newTeacher.value });
  newTeacher.value = { name: '', phone: '', email: '', birth_Date: new Date() }; // Reset form
};

// Function to remove teacher
const removeTeacher = (index: number) => {
  teachers.value.splice(index, 1);
};

// Process a single file and return an array of teachers
const processFile = (file: File): Promise<Teacher[]> => {
  return new Promise((resolve, reject) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);

    if (extension === 'csv' || extension === 'txt') {
      reader.onload = () => {
        const text = reader.result as string;
        const delimiter = extension === 'txt' ? '\t' : ';';
        const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
        // First, split each line into columns
        const rows = lines.map(line => line.split(delimiter));
        // Filter out rows that do not have at least 4 columns
        const validRows = rows.filter(cols => cols.length >= 4);
        const teachersFromFile: Teacher[] = validRows.map(cols => ({
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
        // Iterate over every row (each row represents a teacher)
        jsonData.forEach(row => {
          if (row && row.length >= 4) {
            teachersFromFile.push({
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
      // Unsupported file type; return an empty array.
      resolve([]);
    }
  });
};

// Function to process all files and log the teachers array
const sendTeachers = async () => {
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
};
</script>

<template>
  <main>
    <v-container>
      <v-card>
        <v-card-title>Új felhasználók hozzáadása</v-card-title>
        <v-card-actions>
          <v-btn @click="showStudentDialog = true">Diákok hozzáadása</v-btn>
          <v-btn @click="showTeacherDialog = true">Tanárok hozzáadása</v-btn>
          <v-btn @click="showParentDialog = true">Szülők hozzáadása</v-btn>
        </v-card-actions>
      </v-card>

      <!-- Tanárok dialog -->
      <v-dialog v-model="showTeacherDialog" max-width="600">
        <v-card>
          <v-card-title>Tanárok hozzáadása</v-card-title>
          <v-card-text>
            <h1>Tanárok hozzáadása manuálisan:</h1>
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
              <!-- Teachers list -->
              
            </v-container>
            
            <h1>Tanárok hozzáadása fájlból</h1>
            <h3>Kizárólag txt, csv és xlsx fájlokat tölthet fel!</h3>
            <h6>(A txt fájlban az adattagokat tabulátorral elválasztva töltse fel)</h6>
            <v-file-input 
              label="Fájlok feltöltése (egyszerre töltse fel)"
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
            <!-- On click, process the files, add teachers, and log the array -->
            <v-btn color="secondary" @click="showTeacherDialog = false">Bezárás</v-btn>
            <v-btn color="primary" @click="addTeacherUsers(teachers); showTeacherDialog= false ">Feltöltés az adatbázisba</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </main>
</template>

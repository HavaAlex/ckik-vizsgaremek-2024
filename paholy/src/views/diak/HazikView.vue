<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { Assignment, OpenAssignment } from '@/api/hazik/hazik';
import { useUploadFiles, usegetAssignmentsStudent } from '@/api/hazik/hazikQuery';

const dialog = ref(false); // dialog for sending assignment
const successDialog = ref(false); // shows when submission is successful
const { mutate: uploadFiles } = useUploadFiles();
const { data: assignmentStudentList } = usegetAssignmentsStudent();
</script>

<template>
  <main>
  </main>
</template>
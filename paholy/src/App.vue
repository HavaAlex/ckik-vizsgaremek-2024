<script lang="ts" setup>
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
import { useErrorHandler } from './stores/errorHandler';
import { storeToRefs } from 'pinia';
import { useStatusHandler } from './stores/statusHandler';
import type { AxiosError } from 'axios';

const errorHandler = useErrorHandler();
const { showError, currentErrorStatus } = storeToRefs(errorHandler);
const statusHandler = useStatusHandler();
const { showStatus } = storeToRefs(statusHandler);
</script>

<template>
    <RouterView></RouterView>

    <v-snackbar v-model="showError" color="yellow">
      {{ (currentErrorStatus as AxiosError)?.response?.data || "Egy ismeretlen hiba előlépett" }}

      <template v-slot:actions>
        <v-btn color="black" variant="text" @click="showError = false">X</v-btn>
      </template>
    </v-snackbar>

    <v-snackbar v-model="showStatus" color="green">
      {{ statusHandler.currentStatus }}

      <template v-slot:actions>
        <v-btn color="black" variant="text" @click="showStatus = false">X</v-btn>
      </template>
    </v-snackbar>

    <VueQueryDevtools />
</template>

<script lang="ts" setup>
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
import { useErrorHandler } from './stores/errorHandler';
import { storeToRefs } from 'pinia';

const errorHandler = useErrorHandler()
const {showError} = storeToRefs(errorHandler)
</script>
<template>
    <RouterView></RouterView>
    <v-snackbar
        v-model="showError"
        color="yellow"
      >
      {{ errorHandler.currentErrorStatus?.message }}

      <template v-slot:actions>
        <v-btn
          color="black"
          variant="text"
          @click="showError = false"
        >
          X
        </v-btn>
      </template>
    </v-snackbar>
  <VueQueryDevtools />
</template>
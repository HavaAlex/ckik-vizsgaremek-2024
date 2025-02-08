<script setup lang="ts">
  import { ref } from 'vue'
  import type {Message } from '@/api/uzenetek/uzenetek';
  import {useGetUzenetek} from '@/api/uzenetek/uzenetekQuery';
const dialog = ref(false)


const {data} = useGetUzenetek()
</script>

<template>
  <main>

        <v-dialog max-width="500">
      <template v-slot:activator="{ props: activatorProps }">
        <v-btn
          v-bind="activatorProps"
          color="surface-variant"
          text="Üzenet írása"
          variant="flat"
        ></v-btn>
      </template>

      <template v-slot:default="{ isActive }">
        <v-card title="Üzenet">
          <v-card-text>
            <v-textarea label="Label"></v-textarea>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              text="Mégse"
              @click="isActive.value = false"
            ></v-btn>
            <v-btn
              text="Űzenet elküldése"
              @click="isActive.value = false"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>

  </main>
</template>
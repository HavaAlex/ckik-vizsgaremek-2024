<script lang="ts" setup>
import { useLogin, useChangePassword } from '@/api/auth/authQuery';
import type { changePasswordData } from "@/api/auth/auth";
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
const Router = useRouter();

const passwordData = ref<changePasswordData>({
  username: '',
  currentPassword: '',
  currentPasswordAgain: '',
  newPassword: ''
});

const showCurrentPassword = ref(false);
const showCurrentPasswordAgain = ref(false);
const showNewPassword = ref(false);
</script>

<template>
  <v-container>
    <v-card>
      <v-card-title>Jelszó megváltoztsatása</v-card-title>
      <v-card-text>
        <v-text-field v-model="passwordData.username" label="Felhasználónév"></v-text-field>
        <v-text-field
          v-model="passwordData.currentPassword"
          label="Jelenlegi jelszó"
          :type="showCurrentPassword ? 'text' : 'password'"
          :append-icon="showCurrentPassword ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append="showCurrentPassword = !showCurrentPassword"
        ></v-text-field>
        <v-text-field
          v-model="passwordData.currentPasswordAgain"
          label="Jelenlegi jelszó újra"
          :type="showCurrentPasswordAgain ? 'text' : 'password'"
          :append-icon="showCurrentPasswordAgain ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append="showCurrentPasswordAgain = !showCurrentPasswordAgain"
        ></v-text-field>
        <v-text-field
          v-model="passwordData.newPassword"
          label="Új jelszó"
          :type="showNewPassword ? 'text' : 'password'"
          :append-icon="showNewPassword ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append="showNewPassword = !showNewPassword"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="Router.push({name:'login'})">Mégse</v-btn>
        <v-btn @click="useChangePassword(passwordData)" >Új jelszó feltöltése</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

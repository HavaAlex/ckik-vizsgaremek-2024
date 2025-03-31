<script lang="ts" setup>
import { useLogin, useChangePassword} from '@/api/auth/authQuery';
import type { LoginData, ResetPasswordData, SetPasswordData, SetPasswordResponse,changePasswordData } from "@/api/auth/auth"
import { ref ,onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
const Router = useRouter()

const passwordData = ref<changePasswordData>({
    username: '',
    currentPassword: '',
    currentPasswordAgain: '',
    newPassword: ''
})

</script>

<template>
    <v-container>
        <v-card>
            <v-card-title>Jelszó megváltoztsatása</v-card-title>
            <v-card-text>
                <v-text-field v-model="passwordData.username" label="Felhasználónév"></v-text-field>
                <v-text-field v-model="passwordData.currentPassword" label="Jelenlegi jelszó"></v-text-field>
                <v-text-field v-model="passwordData.currentPasswordAgain" label="Jelenlegi jelszó újra"></v-text-field>
                <v-text-field v-model="passwordData.newPassword" label="Új jelszó"></v-text-field>
            </v-card-text>
            <v-card-actions>
                <v-btn @click="Router.push({name:'login'})">Mégse</v-btn>
                <v-btn @click="useChangePassword(passwordData)">Új jelszó feltöltése</v-btn>
            </v-card-actions>
        </v-card>
    </v-container>
</template>
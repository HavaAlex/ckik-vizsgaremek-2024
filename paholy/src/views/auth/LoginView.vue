<script lang="ts" setup>
import type { LoginData } from '@/api/auth/auth';
import { useLogin } from '@/api/auth/authQuery';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
 
const LoginDataRef = ref<LoginData>({
    username: '',
    password:''
})

const { push } = useRouter()
const { mutate: login, isPending} = useLogin()
const {back} = useRouter()
</script>
<template>
    <v-card>
        <v-card-title>Login</v-card-title>
        <v-card-text>
            <v-text-field v-model="LoginDataRef.username" label="Username" variant="outlined"></v-text-field>
            <v-text-field v-model="LoginDataRef.password" label="Password" type="password" variant="outlined"></v-text-field>
        </v-card-text>
        <v-card-actions>
            <v-btn @click="() => {
                login(LoginDataRef)
            }" :loading="isPending"> 
                Login
            </v-btn>
            <v-btn @click="push({name:'password-reset-email'})">
                Forgot password
            </v-btn>
            <v-btn @click="back()">Mégse</v-btn>
        </v-card-actions>
    </v-card>
</template>
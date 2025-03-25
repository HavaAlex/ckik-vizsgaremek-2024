<script lang="ts" setup>
import { useLogin, useChangePassword} from '@/api/auth/authQuery';
import { ref ,onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const {push} = useRouter()
const {mutate: ChangePassword} = useChangePassword()
const passwordData = ref({
    username:'',
    currentpassword: '',
    currentpasswordagain:'',
    newpassword:''
})

</script>

<template>
    <v-container>
        <v-card>
            <v-card-title>Jelszó megváltoztsatása</v-card-title>
            <v-card-text>
                <v-text-field v-model="passwordData.username" label="Felhasználónév"></v-text-field>
                <v-text-field v-model="passwordData.currentpassword" label="Jelenlegi jelszó"></v-text-field>
                <v-text-field v-model="passwordData.currentpasswordagain" label="Jelenlegi jelszó újra"></v-text-field>
                <v-text-field v-model="passwordData.newpassword" label="Új jelszó"></v-text-field>
            </v-card-text>
            <v-card-actions>
                <v-btn @click="push({name:'login'})">Mégse</v-btn>
                <v-btn @click="ChangePassword(passwordData)">Új jelszó feltöltése</v-btn>
            </v-card-actions>
        </v-card>
    </v-container>
</template>
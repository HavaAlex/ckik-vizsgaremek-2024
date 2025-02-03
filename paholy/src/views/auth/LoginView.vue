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
    <v-card class="logincard">
        <v-card-title>Bejelentkezés a Páholy rendszerbe</v-card-title>
        <v-card-text>
            <v-text-field v-model="LoginDataRef.username" label="Felhasználónév" variant="outlined"></v-text-field>
            <v-text-field v-model="LoginDataRef.password" label="Jelszó" type="password" variant="outlined"></v-text-field>
        </v-card-text>
        <v-card-actions>
            <v-btn @click="() => {
                login(LoginDataRef)
            }" :loading="isPending"> 
                Bejelentkezés
            </v-btn>
        </v-card-actions>
    </v-card>
</template>
<style lang="css">
html, body {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}



@media (orientation: portrait) {
  main {
    width: 95vw;
  }
  .logincard {
  
   width: 95vw;
   height: 40vw;
}
}

/* Landscape mode */
@media (orientation: landscape) {
  main {
  width: 80vw;
  }
  .logincard {
   width: 40vw;
}
}
</style>
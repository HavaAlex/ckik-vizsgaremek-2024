<script lang="ts" setup>
import type { LoginData } from '@/api/auth/auth';
import { useLogin } from '@/api/auth/authQuery';
import { ref ,onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { jwtDecode } from 'jwt-decode';
import { useCookieHandler } from '@/stores/cookieHandler';
 
const LoginDataRef = ref<LoginData>({
    username: '',
    password:''
})

const { push,back } = useRouter()
const { mutate: login, isPending} = useLogin()
const {getCookie} = useCookieHandler()

//itt kezdődik a forgatásnak a figyelése
const isPortrait = ref(window.matchMedia("(orientation: portrait)").matches);
const updateOrientation = () => {
  isPortrait.value = window.matchMedia("(orientation: portrait)").matches;
};
onMounted(() => {
  window.matchMedia("(orientation: portrait)").addEventListener("change", updateOrientation);
  if(document.cookie != ''){
    const decoded = jwtDecode(getCookie("alap"))
    push({name:decoded.userData.role+'orarend'})
  }
});
onUnmounted(() => {
  window.matchMedia("(orientation: portrait)").removeEventListener("change", updateOrientation);
});//itt ér véget
</script>
<template>

    <div v-if="isPortrait">
        <v-card class="logincard">
        <v-card-title class ="telefonosnagyitas" >Bejelentkezés a Páholy rendszerbe</v-card-title>
        <v-card-text>
            <v-text-field class ="telefonosnagyitas2" v-model="LoginDataRef.username" placeholder="Felhasználónév" variant="outlined"></v-text-field>
            <v-text-field class ="telefonosnagyitas2" v-model="LoginDataRef.password" placeholder="Jelszó" type="password" variant="outlined"></v-text-field>
        </v-card-text>
        <v-card-actions class="buttoncontainer">
            <v-btn class="loginbtn" @click="() => {
                login(LoginDataRef)
            }" :loading="isPending"> 
                Bejelentkezés
            </v-btn>
        </v-card-actions>
    </v-card>
    </div>
    <div v-else>
        <v-card class="logincard">
        <v-card-title >Bejelentkezés a Páholy rendszerbe</v-card-title>
        <v-card-text>
            <v-text-field v-model="LoginDataRef.username" label="Felhasználónév" variant="outlined" ></v-text-field>
            <v-text-field v-model="LoginDataRef.password" label="Jelszó" type="password" variant="outlined"></v-text-field>
        </v-card-text>
        <v-card-actions class="buttoncontainer">
            <v-btn class="loginbtn" @click="() => {
                login(LoginDataRef)
            }" :loading="isPending"> 
                Bejelentkezés
            </v-btn>

          

        </v-card-actions>
    </v-card>
    </div>

</template>
<style lang="css" scoped>
@media (orientation: portrait) {
  .telefonosnagyitas2 :deep(.v-field__input) {
  font-size: 5vw !important; /* Adjusts text size based on viewport width */
 /* height: 5vw;  Adjusts input height */
}

}

</style>
<style lang="css">
html, body {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.loginbtn{
    background-color:#9c0913 !important;
    color: white !important;
}
.buttoncontainer{
    display: flex !important;
    justify-content: center !important;
    width: 100%;
}



@media (orientation: portrait) {
  main {
    width: 95vw;
    
  }

  .logincard {
   width: 95vw !important;
   height: 70vw !important;
   align-items: center !important;
} 
  .loginbtn{
    height:10vw !important;
    width:50vw !important;
    font-size: 5vw !important;
}
  .telefonosnagyitas{
    height:15vw !important;
    width:90vw !important;
    font-size: 5vw !important;
    
  }
  .telefonosnagyitas2{
    height:15vw !important;
    width:90vw !important;
    font-size: 5vw !important;
  }
  .telefonosnagyitas2 ::placeholder{
    padding-top: 0.5vw;
    height: 5vw;
    font-size: 5vw !important;
  }
  .buttoncontainer{
    display: flex !important;
    justify-content: center !important;
    width: 100%;
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
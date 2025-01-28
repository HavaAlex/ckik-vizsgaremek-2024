<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';
import { getUserStatusFromLocalStorage, deleteUserStatusFromLocalStorage} from '@/localstorage/localStorageManagment.ts';
import Jogosultsagok from '@/views/admin/Jogosultsagok.vue';
import { useCookieHandler } from '@/stores/cookieHandler';
import { jwtDecode } from 'jwt-decode';
const { push } = useRouter()

const {hasValidCookie} = useCookieHandler()

const cookieStatus = hasValidCookie()
const role: string = ''
if (cookieStatus == true){
  const decoded = jwtDecode(document.cookie)
  role = decoded.userData.role
  push({name:decoded.userData.role+'orarend'})
}
else{
  push({name:"login"})
}

</script>

<template>
    <v-layout class="rounded rounded-md">
      <v-system-bar color="grey-darken-3"></v-system-bar>
      <v-app-bar
        color="grey"
        height="48"
        flat
      >
  
      <v-btn @click="push({name:role+'orarend'})">
                Órarend
      </v-btn>
      <v-btn @click="push({name:role+'hazik'})">
                Házifeladatok/beadandók
      </v-btn>
      <v-btn @click="push({name:role+'jegyek'})">
                Osztályzatok
      </v-btn>
      <v-btn @click="push({name:role+'hianyzasok'})">
                Mulasztások/Hiányzások
      </v-btn>
      <v-btn @click="push({name:role+'uzenetek'})">
                Üzenetek
      </v-btn>
      
      <v-btn @click="push({name:'jogosultsagok'})" v-if="role=='admin'">
                Jogosultsagok kezelése
      </v-btn>

      <v-spacer></v-spacer>
      <v-btn @click="deleteUserStatusFromLocalStorage() ; push({name:'login'})">
                Kilépés
      </v-btn>
    </v-app-bar>
  

  
    <v-app-bar
      color="grey-lighten-2"
      height="48"
      location="bottom"
      flat
    >


      <v-col class="text-center mt-4" cols="12">
        {{ new Date().getFullYear() }} - <strong>Páholy</strong>
      </v-col>
    </v-app-bar>
  
      <v-main class="d-flex align-center justify-center fill-height">
        <RouterView></RouterView>
      </v-main>
    </v-layout>
  </template>
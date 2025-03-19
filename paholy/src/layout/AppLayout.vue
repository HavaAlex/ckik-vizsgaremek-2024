<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';
import { getUserStatusFromLocalStorage, deleteUserStatusFromLocalStorage} from '@/localstorage/localStorageManagment.ts';
import Jogosultsagok from '@/views/admin/Jogosultsagok.vue';
import { useCookieHandler } from '@/stores/cookieHandler';
import { jwtDecode } from 'jwt-decode';
import { ref ,onMounted, onUnmounted,onUpdated } from 'vue';
import { storeToRefs } from 'pinia';
import { useErrorHandler } from '@/stores/errorHandler';
import { AxiosError } from 'axios';
import { useGyerekStore } from '@/stores/gyerekStore';
import { useGetChildren } from '@/api/szulo/szuloQuery';
const { push } = useRouter()

const cookieHandler = useCookieHandler()
const { time } = storeToRefs(cookieHandler);

const gyerekStore = useGyerekStore()

const cookieStatus = cookieHandler.hasValidCookie()
let role: string = ''
if (cookieStatus == true){
  const decoded = jwtDecode(document.cookie)
  role = decoded.userData.role
  if(role == "szulo"){
    const { mutate:getChildren } = useGetChildren()
    getChildren()
  }
  console.log(decoded)
  console.log(role)
  push({name:role+'orarend'})
}
else{
  push({name:"login"})
}

//itt kezdődik a forgatásnak a figyelése
const isPortrait = ref(window.matchMedia("(orientation: portrait)").matches);
const updateOrientation = () => {
  isPortrait.value = window.matchMedia("(orientation: portrait)").matches;
};
onMounted(() => {
  window.matchMedia("(orientation: portrait)").addEventListener("change", updateOrientation);
  if(cookieStatus == true){
    cookieHandler.startTimer();
  }
});
onUnmounted(() => {
  window.matchMedia("(orientation: portrait)").removeEventListener("change", updateOrientation);
  cookieHandler.resetTimer();
});//itt ér véget

onUpdated(()=>{
  const cookieStatus =  cookieHandler.hasValidCookie()
  if (cookieStatus == false){
    push({name:"login"})
    useErrorHandler().setError(new Error("Süti lejárt!"))
    cookieHandler.resetTimer()
  }
})


</script>

<template>
  <div v-if="isPortrait">
    <v-layout>
      <v-app-bar height="48" flat class="appnavbar bg-secondary">
        <v-container class="d-flex align-center justify-space-between">
          <!-- Left Side -->
          <v-menu class="appnavbarmenubtn">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" class="appnavbarmenubtn">
                Oldalak
              </v-btn>
            </template>
            <v-list>
              <v-list-item class="appnavbarmenu">
                <v-btn @click="push({name:role+'orarend'})" class="appnavbarmenu">Órarend</v-btn>
              </v-list-item>
              <v-list-item v>
                <v-btn @click="push({name:role+'hazik'})" class="appnavbarmenu">Házifeladatok/beadandók</v-btn>
              </v-list-item>
              <v-list-item class="appnavbarmenu">
                <v-btn @click="push({name:role+'jegyek'})" class="appnavbarmenu">Osztályzatok</v-btn>
              </v-list-item>
              <v-list-item class="appnavbarmenu">
                <v-btn @click="push({name:role+'hianyzasok'})" class="appnavbarmenu">Mulasztások/Hiányzások</v-btn>
              </v-list-item>
              <v-list-item class="appnavbarmenu">
                <v-btn @click="push({name:role+'uzenetek'})" class="appnavbarmenu">Üzenetek</v-btn>
              </v-list-item>
            </v-list>
          </v-menu>

      

          <!-- Right Side -->
          <v-btn class="appnavbarbtn" @click="deleteUserStatusFromLocalStorage() ; push({name:'login'})">
            Kilépés
          </v-btn>
        </v-container>
      </v-app-bar>

      <div>
      
      <v-app-bar
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
  
      </div>
    </v-layout>
  </div>
  <div v-else>
    <v-layout class="rounded rounded-md">
      <v-app-bar class="appnavbar bg-secondary"
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
      <v-btn @click="push({name:'UserManagementView'})" v-if="role=='admin'">
                Felhasználók kezelése
      </v-btn>
      <v-btn @click="push({name:'GroupManagementView'})" v-if="role=='admin'">
                Csoportok kezelése
      </v-btn>

      <v-select v-if="role=='szulo'"
        label="Választott gyermek"
        :items="gyerekStore.children.map((c)=>c.name)"
      ></v-select>
      <v-spacer></v-spacer>
      <v-tooltip text="Ennyi idő múlva automatikusan kijelentkezel">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props">{{ time }}</v-btn>
        </template>
      </v-tooltip>
      <v-btn @click="cookieHandler.deleteCookie('alap') ; push({name:'login'})">
                Kilépés
      </v-btn>
    </v-app-bar>
    <v-app-bar
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
  </div>


  </template>
<style lang="css">
  
  /* Dark Mode */
  @media (prefers-color-scheme: dark) {
    body {
      background-color: rgb(52, 37, 37);
      color: rgb(255, 255, 255);
    }
  }


  @media (orientation: portrait) {
    .appnavbar{
      height: 20vw;
      width: 100vw;
      border-bottom: 50vw !important;
    }
    .appnavbarmenubtn{
      height: 25vw !important;
      width: 50vw !important;
      font-size: 5vw !important;
      color: white;
    }
    .appnavbarmenu{
      height: 30vw !important;
      font-size: 5vw !important;
      width: 90vw;
    }
    .appnavbarmenu::content{
      border-top: 25vw !important;
    }
    .appnavbarbtn{
      height: 30vw !important;
      width: 50vw !important;
      font-size: 5vw !important;
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
<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';
import { getUserStatusFromLocalStorage, deleteUserStatusFromLocalStorage} from '@/localstorage/localStorageManagment.ts';
const { push } = useRouter()

</script>

<template>
    <v-layout class="rounded rounded-md">
      <v-system-bar color="grey-darken-3"></v-system-bar>
      <v-app-bar
        color="grey"
        height="48"
        flat
      >
  
      <v-btn @click="push({name:getUserStatusFromLocalStorage()+'orarend'})">
                Órarend
      </v-btn>
      <v-btn @click="push({name:getUserStatusFromLocalStorage()+'hazik'})">
                Házifeladatok/beadandók
      </v-btn>
      <v-btn @click="push({name:getUserStatusFromLocalStorage()+'jegyek'})">
                Osztályzatok
      </v-btn>
      <v-btn @click="push({name:getUserStatusFromLocalStorage()+'hianyzasok'})">
                Mulasztások/Hiányzások
      </v-btn>
      <v-btn @click="push({name:getUserStatusFromLocalStorage()+'uzenetek'})">
                Üzenetek
      </v-btn>

      <v-spacer></v-spacer>
      <v-btn @click="deleteUserStatusFromLocalStorage() ; push({name:'home'})">
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
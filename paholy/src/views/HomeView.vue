<script setup lang="ts">
//import TheWelcome from '../components/TheWelcome.vue'
import { useRoute, useRouter } from 'vue-router';
import {setUserStatusToLocalStorage, getUserStatusFromLocalStorage} from '@/localstorage/localStorageManagment.ts';
const { push } = useRouter()
const {back} = useRouter()






</script>

<template>
  <main>
    <h1>A páholy megérkezett</h1>
    <v-btn @click="push({name:'applayout'});setUserStatusToLocalStorage('tanar')">
                Tanár
      </v-btn>
      <v-btn @click="push({name:'applayout'});setUserStatusToLocalStorage('diak')">
                Diák
      </v-btn>
      <v-btn @click="push({name:'applayout'});setUserStatusToLocalStorage('szulo')">
                Szülő
      </v-btn>
      <v-btn @click="push({name:'applayout'});setUserStatusToLocalStorage('admin')">
                Admin
      </v-btn>
  </main>
</template>

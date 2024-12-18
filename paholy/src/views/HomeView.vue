<script setup lang="ts">
//import TheWelcome from '../components/TheWelcome.vue'
import {useRouter } from 'vue-router';
import {setUserStatusToLocalStorage} from '@/localstorage/localStorageManagment.ts';
const { push } = useRouter()
</script>

<template>
  <main>
    <h1>A páholy megérkezett</h1>
    <v-btn @click="push({name:'tanarorarend'});setUserStatusToLocalStorage('tanar')">
                Tanár
      </v-btn>
      <v-btn @click="push({name:'tanuloorarend'});setUserStatusToLocalStorage('tanulo')">
                Diák
      </v-btn>
      <v-btn @click="push({name:'szuloorarend'});setUserStatusToLocalStorage('szulo')">
                Szülő
      </v-btn>
      <v-btn @click="push({name:'applayout'});setUserStatusToLocalStorage('admin')">
                Admin
      </v-btn>
  </main>
</template>

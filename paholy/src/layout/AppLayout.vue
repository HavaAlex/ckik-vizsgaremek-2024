<script lang="ts" setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
 


const { push } = useRouter()
const {back} = useRouter()
</script>

<template>
    <v-layout class="rounded rounded-md">
      <v-system-bar color="grey-darken-3"></v-system-bar>
      <v-app-bar
        color="grey"
        height="48"
        flat
      >
  
      <v-btn @click="push({name:'password-reset-email'})">
                Órarend
      </v-btn>
      <v-btn @click="push({name:'password-reset-email'})">
                Házifeladatok/beadandók
      </v-btn>
      <v-btn @click="push({name:'password-reset-email'})">
                Osztályzatok
      </v-btn>
      <v-btn @click="push({name:'password-reset-email'})">
                Mulasztások/Hiányzások
      </v-btn>
      <v-btn @click="push({name:'password-reset-email'})">
                Üzenetek
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn @click="push({name:'home'})">
                Kilépés
      </v-btn>
    </v-app-bar>
  

  
    <v-app-bar
      color="grey-lighten-2"
      height="48"
      location="bottom"
      flat
    ></v-app-bar>
  
      <v-main class="d-flex align-center justify-center fill-height">
        <RouterView></RouterView>
      </v-main>
    </v-layout>
  </template>
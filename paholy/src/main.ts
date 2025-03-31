import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import vuetify from './lib/vuetify'

import { VueQueryPlugin } from '@tanstack/vue-query'
import queryClient from './lib/queryClient'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)
app.use(VueQueryPlugin, {queryClient: queryClient})

declare module "jwt-decode" {
  export interface JwtPayload {
      userData: any;
  }
}

app.config.errorHandler = (err, vm, info) => {
  console.error("Error:", err);
  console.error("Vue component:", vm);
  console.error("Additional info:", info);
};



app.mount('#app')
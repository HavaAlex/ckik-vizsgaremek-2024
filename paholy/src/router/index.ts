import { createRouter, createWebHistory } from 'vue-router'
import AdminView from '../views/AdminView.vue'
import HomeView from '../views/HomeView.vue'
import Jogosultsagok from '../views/Jogosultsagok.vue'
import OsztalyokView from '../views/OsztalyokView.vue'
import SzuloView from '../views/SzuloView.vue'
import TanarView from '../views/TanarView.vue'
import TanuloView from '../views/TanuloView.vue'


import HazikView from '../views/HazikView.vue'
import HianyzasokView from '../views/HianyzasokView.vue'
import JegyekView from '../views/JegyekView.vue'
import OrarendView from '../views/OrarendView.vue'
import UzenetekView from '../views/UzenetekView.vue'

// Gyerek komponens importálása
import HazikLayoutGyerek from '../layout/gyerek/HazikLayout.vue'
import HianyzasokLayoutGyerek from '../layout/gyerek/HianyzasokLayout.vue'
import JegyekLayoutGyerek from '../layout/gyerek/JegyekLayout.vue'
import OrarendLayoutGyerek from '../layout/gyerek/OrarendLayout.vue'
import UzenetekLayoutGyerek from '../layout/gyerek/UzenetekLayout.vue'

// Szulo komponens importálása
import HazikLayoutSzulo from '../layout/szulo/HazikLayout.vue'
import HianyzasokLayoutSzulo from '../layout/szulo/HianyzasokLayout.vue'
import JegyekLayoutSzulo from '../layout/szulo/JegyekLayout.vue'
import OrarendLayoutSzulo from '../layout/szulo/OrarendLayout.vue'
import UzenetekLayoutSzulo from '../layout/szulo/UzenetekLayout.vue'

// Tanar komponens importálása
import HazikLayoutTanar from '../layout/tanar/HazikLayout.vue'
import HianyzasokLayoutTanar from '../layout/tanar/HianyzasokLayout.vue'
import JegyekLayoutTanar from '../layout/tanar/JegyekLayout.vue'
import OrarendLayoutTanar from '../layout/tanar/OrarendLayout.vue'
import UzenetekLayoutTanar from '../layout/tanar/UzenetekLayout.vue'
import AppLayout from '@/layout/AppLayout.vue'




const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'applayout',
      component: AppLayout,
      children: [
        {
          path: '/hazik',
          name: 'hazik',
          component: HazikView, 
          children: [
              { 
                  path: 'gyerekhazik',
                  name: 'gyerekhazik',
                  component: HazikLayoutGyerek
              },
              { 
                  path: 'szulohazik',
                  name: 'szulohazik',
                  component: HazikLayoutSzulo
              },
              { 
                  path: 'tanarhazik',
                  name: 'tanarhazik',
                  component: HazikLayoutTanar
              },
          ]
        },
      
        {
            path: '/hianyzasok',
            name: 'hianyzasok',
            component: HianyzasokView,children:[
              {path: 'gyerekhianyzasok',
                name: 'gyerekhianyzasok',
                component: HianyzasokLayoutGyerek
              },
              {path: 'szulohianyzasok',
                name: 'szulohianyzasok',
                component: HianyzasokLayoutSzulo
              },
              {path: 'tanarhianyzasok',
                name: 'tanarhianyzasok',
                component: HianyzasokLayoutTanar
              },
            ]
        },
        {
          path: '/jegyek',
          name: 'jegyek',
          component: JegyekView, 
          children: [
              { 
                  path: 'gyerekjegyek',
                  name: 'gyerekjegyek',
                  component: JegyekLayoutGyerek
              },
              { 
                  path: 'szulojegyek',
                  name: 'szulojegyek',
                  component: JegyekLayoutSzulo
              },
              { 
                  path: 'tanarjegyek',
                  name: 'tanarjegyek',
                  component: JegyekLayoutTanar
              },
          ]
        },
        {
          path: '/orarend',
          name: 'orarend',
          component: OrarendView, 
          children: [
              { 
                  path: 'gyerekorarend',
                  name: 'gyerekorarend',
                  component: OrarendLayoutGyerek
              },
              { 
                  path: 'szuloorarend',
                  name: 'szuloorarend',
                  component: OrarendLayoutSzulo
              },
              { 
                  path: 'tanarorarend',
                  name: 'tanarorarend',
                  component: OrarendLayoutTanar
              },
          ]
        } ,
        {
          path: '/uzenetek',
          name: 'uzenetek',
          component: UzenetekView, 
          children: [
              { 
                  path: 'gyerekuzenetek',
                  name: 'gyerekuzenetek',
                  component: UzenetekLayoutGyerek
              },
              { 
                  path: 'szulouzenetek',
                  name: 'szulouzenetek',
                  component: UzenetekLayoutSzulo
              },
              { 
                  path: 'tanaruzenetek',
                  name: 'tanaruzenetek',
                  component: UzenetekLayoutTanar
              },
          ]
        }, 
      ]
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
    },
    {
        path: '/jogosultsagok',
        name: 'jogosultsagok',
        component: Jogosultsagok,
    },


    {
        path: '/osztalyok',
        name: 'osztalyok',
        component: OsztalyokView,
    },
    {
        path: '/szulo',
        name: 'szulo',
        component: SzuloView,
    },
    {
        path: '/tanar',
        name: 'tanar',
        component: TanarView,
    },
    {
        path: '/tanulo',
        name: 'tanulo',
        component: TanuloView,
    },

    {    
      path: '/admin',
      name: 'admin',
      component: AdminView,

    },
  ],
})

export default router

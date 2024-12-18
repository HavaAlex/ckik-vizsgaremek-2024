import { createRouter, createWebHistory } from 'vue-router'
import AdminView from '../views/AdminView.vue'
import HomeView from '../views/HomeView.vue'
import Jogosultsagok from '../views/Jogosultsagok.vue'
import OsztalyokView from '../views/OsztalyokView.vue'
import SzuloView from '../views/SzuloView.vue'
import TanarView from '../views/TanarView.vue'
import TanuloView from '../views/TanuloView.vue'

// Gyerek komponens importálása
import HazikViewTanulo from '../views/tanulo/HazikView.vue'
import HianyzasokViewTanulo from '../views/tanulo/HianyzasokView.vue'
import JegyekViewTanulo from '../views/tanulo/HazikView.vue'
import OrarendViewTanulo from '../views/tanulo/OrarendView.vue'
import UzenetekViewTanulo from '../views/tanulo/UzenetekView.vue'

// Szulo komponens importálása
import HazikViewSzulo from '../views/szulo/HazikView.vue'
import HianyzasokViewSzulo from '../views/szulo/HianyzasokView.vue'
import JegyekViewSzulo from '../views/szulo/JegyekView.vue'
import OrarendViewSzulo from '../views/szulo/OrarendView.vue'
import UzenetekViewSzulo from '../views/szulo/UzenetekView.vue'

// Tanar komponens importálása
import HazikViewTanar from '../views/tanar/HazikView.vue'
import HianyzasokViewTanar from '../views/tanar/HianyzasokView.vue'
import JegyekViewTanar from '../views/tanar/JegyekView.vue'
import OrarendViewTanar from '../views/tanar/OrarendView.vue'
import UzenetekViewTanar from '../views/tanar/UzenetekView.vue'


import UzenetekLayout from '../layout/UzenetekLayout.vue'
import HazikLayout from '../layout/HazikLayout.vue'
import OrarendLayout from '../layout/OrarendLayout.vue'
import JegyekLayout from '../layout/JegyekLayout.vue'
import HianyzasokLayout from '../layout/HianyzasokLayout.vue' 

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
          component: HazikLayout, 
          children: [
              { 
                  path: 'tanulohazik',
                  name: 'tanulohazik',
                  component: HazikViewTanulo
              },
              { 
                  path: 'szulohazik',
                  name: 'szulohazik',
                  component: HazikViewSzulo
              },
              { 
                  path: 'tanarhazik',
                  name: 'tanarhazik',
                  component: HazikViewTanar
              },
          ]
        },
      
        {
            path: '/hianyzasok',
            name: 'hianyzasok',
            component: HianyzasokLayout,children:[
              {path: 'tanulohianyzasok',
                name: 'tanulohianyzasok',
                component: HianyzasokViewTanulo
              },
              {path: 'szulohianyzasok',
                name: 'szulohianyzasok',
                component: HianyzasokViewSzulo
              },
              {path: 'tanarhianyzasok',
                name: 'tanarhianyzasok',
                component: HianyzasokViewTanar
              },
            ]
        },
        {
          path: '/jegyek',
          name: 'jegyek',
          component: JegyekLayout, 
          children: [
              { 
                  path: 'tanulojegyek',
                  name: 'tanulojegyek',
                  component: JegyekViewTanulo
              },
              { 
                  path: 'szulojegyek',
                  name: 'szulojegyek',
                  component: JegyekViewSzulo
              },
              { 
                  path: 'tanarjegyek',
                  name: 'tanarjegyek',
                  component: JegyekViewTanar
              },
          ]
        },
        {
          path: '/orarend',
          name: 'orarend',
          component: OrarendLayout, 
          children: [
              { 
                  path: 'tanuloorarend',
                  name: 'tanuloorarend',
                  component: OrarendViewTanulo
              },
              { 
                  path: 'szuloorarend',
                  name: 'szuloorarend',
                  component: OrarendViewSzulo
              },
              { 
                  path: 'tanarorarend',
                  name: 'tanarorarend',
                  component: OrarendViewTanar
              },
          ]
        } ,
        {
          path: '/uzenetek',
          name: 'uzenetek',
          component: UzenetekLayout, 
          children: [
              { 
                  path: 'tanulouzenetek',
                  name: 'tanulouzenetek',
                  component: UzenetekViewTanulo
              },
              { 
                  path: 'szulouzenetek',
                  name: 'szulouzenetek',
                  component: UzenetekViewSzulo
              },
              { 
                  path: 'tanaruzenetek',
                  name: 'tanaruzenetek',
                  component: UzenetekViewTanar
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

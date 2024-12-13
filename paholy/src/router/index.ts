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

import HeaderFooterLayout from '@/layout/HeaderFooterLayout.vue'

// Gyerek komponens importálása
import HazikViewGyerek from '../views/tanulo/HazikLayout.vue'
import HianyzasokViewGyerek from '../views/tanulo/HianyzasokLayout.vue'
import JegyekViewGyerek from '../views/tanulo/JegyekLayout.vue'
import OrarendViewGyerek from '../views/tanulo/OrarendLayout.vue'
import UzenetekViewGyerek from '../views/tanulo/UzenetekLayout.vue'

// Szulo komponens importálása
import HazikViewSzulo from '../views/szulo/HazikLayout.vue'
import HianyzasokViewSzulo from '../views/szulo/HianyzasokLayout.vue'
import JegyekViewSzulo from '../views/szulo/JegyekLayout.vue'
import OrarendViewSzulo from '../views/szulo/OrarendLayout.vue'
import UzenetekViewSzulo from '../views/szulo/UzenetekLayout.vue'

// Tanar komponens importálása
import HazikViewTanar from '../views/tanar/HazikLayout.vue'
import HianyzasokViewTanar from '../views/tanar/HianyzasokLayout.vue'
import JegyekViewTanar from '../views/tanar/JegyekLayout.vue'
import OrarendViewTanar from '../views/tanar/OrarendLayout.vue'
import UzenetekViewTanar from '../views/tanar/UzenetekLayout.vue'




const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/teszt',
      name: 'teszt',
      component: HeaderFooterLayout,
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
    },

    {
      path: '/hazik',
      name: 'hazik',
      component: HazikView, 
      children: [
          { 
              path: 'tanulo',
              name: 'tanulohazik',
              component: HazikViewGyerek
          },
          { 
              path: 'szulo',
              name: 'szulohazik',
              component: HazikViewSzulo
          },
          { 
              path: 'tanar',
              name: 'tanarhazik',
              component: HazikViewTanar
          },
      ]
    },
  
    {
        path: '/hianyzasok',
        name: 'hianyzasok',
        component: HianyzasokView,children:[
          {path: 'tanulo',
            name: 'tanulohianyzasok',
            component: HianyzasokViewGyerek
          },
          {path: 'szulo',
            name: 'szulohianyzasok',
            component: HianyzasokViewSzulo
          },
          {path: 'tanar',
            name: 'tanarhianyzasok',
            component: HianyzasokViewTanar
          },
        ]
    },
    {
      path: '/jegyek',
      name: 'jegyek',
      component: JegyekView, 
      children: [
          { 
              path: 'tanulo',
              name: 'tanulojegyek',
              component: JegyekViewGyerek
          },
          { 
              path: 'szulo',
              name: 'szulojegyek',
              component: JegyekViewSzulo
          },
          { 
              path: 'tanar',
              name: 'tanarjegyek',
              component: JegyekViewTanar
          },
      ]
    },
    {
      path: '/orarend',
      name: 'orarend',
      component: OrarendView, 
      children: [
          { 
              path: 'tanulo',
              name: 'tanuloorarend',
              component: OrarendViewGyerek
          },
          { 
              path: 'szulo',
              name: 'szuloorarend',
              component: OrarendViewSzulo
          },
          { 
              path: 'tanar',
              name: 'tanarorarend',
              component: OrarendViewTanar
          },
      ]
    } , 
    {
      path: '/uzenetek',
      name: 'uzenetek',
      component: UzenetekView, 
      children: [
          { 
              path: 'tanulo',
              name: 'tanulouzenetek',
              component: UzenetekViewGyerek
          },
          { 
              path: 'szulo',
              name: 'szulouzenetek',
              component: UzenetekViewSzulo
          },
          { 
              path: 'tanar',
              name: 'tanaruzenetek',
              component: UzenetekViewTanar
          },
      ]
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
  ],
})

export default router

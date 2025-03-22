import { createRouter, createWebHistory } from 'vue-router'

// Admin komponens importálása
import HazikViewAdmin from '../views/admin/HazikView.vue'
import HianyzasokViewAdmin from '../views/admin/HianyzasokView.vue'
import JegyekViewAdmin from '../views/admin/HazikView.vue'
import OrarendViewAdmin from '../views/admin/OrarendView.vue'
import UzenetekViewAdmin from '../views/admin/UzenetekView.vue'
import UserManagementView from '@/views/admin/UserManagementView.vue'
import GroupManagementView from '@/views/admin/GroupManagementView.vue'

// Gyerek komponens importálása
import HazikViewTanulo from '../views/diak/HazikView.vue'
import HianyzasokViewTanulo from '../views/diak/HianyzasokView.vue'
import JegyekViewTanulo from '../views/diak/JegyekView.vue'
import OrarendViewTanulo from '../views/diak/OrarendView.vue'
import UzenetekViewTanulo from '../views/diak/UzenetekView.vue'

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

//layoutok
import UzenetekLayout from '../layout/UzenetekLayout.vue'
import HazikLayout from '../layout/HazikLayout.vue'
import OrarendLayout from '../layout/OrarendLayout.vue'
import JegyekLayout from '../layout/JegyekLayout.vue'
import HianyzasokLayout from '../layout/HianyzasokLayout.vue' 

import AppLayout from '@/layout/AppLayout.vue'
import Jogosultsagok from '../views/admin/Jogosultsagok.vue'

import LoginView from '../views/auth/LoginView.vue'




const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'applayout',
      component: AppLayout,
      children: [
        {
          path: '/UserManagmentView',
          name: 'UserManagementView',
          component: UserManagementView,
        },
        {
          path: '/GroupManagementView',
          name: 'GroupManagementView',
          component: GroupManagementView
        },
        {
          path: '/hazik',
          name: 'hazik',
          component: HazikLayout, 
          children: [
              { 
                  path: 'diakhazik',
                  name: 'diakhazik',
                  component: HazikViewTanulo
              },
              { 
                  path: 'szulohazik/:id',
                  name: 'szulohazik',
                  component: HazikViewSzulo,
                  props:true
              },
              { 
                  path: 'tanarhazik',
                  name: 'tanarhazik',
                  component: HazikViewTanar
              },
              { 
                path: 'adminhazik',
                name: 'adminhazik',
                component: HazikViewAdmin
              },
          ]
        },
      
        {
            path: '/hianyzasok',
            name: 'hianyzasok',
            component: HianyzasokLayout,children:[
              {path: 'diakhianyzasok',
                name: 'diakhianyzasok',
                component: HianyzasokViewTanulo
              },
              {path: 'szulohianyzasok/:id',
                name: 'szulohianyzasok',
                component: HianyzasokViewSzulo
              },
              {path: 'tanarhianyzasok',
                name: 'tanarhianyzasok',
                component: HianyzasokViewTanar
              },
              { 
                path: 'adminhianyzasok',
                name: 'adminhianyzasok',
                component: HianyzasokViewAdmin
              },
            ]
        },
        {
          path: '/jegyek',
          name: 'jegyek',
          component: JegyekLayout, 
          children: [
              { 
                  path: 'diakjegyek',
                  name: 'diakjegyek',
                  component: JegyekViewTanulo
              },
              { 
                  path: 'szulojegyek/:id',
                  name: 'szulojegyek',
                  component: JegyekViewSzulo
              },
              { 
                  path: 'tanarjegyek',
                  name: 'tanarjegyek',
                  component: JegyekViewTanar
              },
              { 
                path: 'adminjegyek',
                name: 'adminjegyek',
                component: JegyekViewAdmin
              },
          ]
        },
        {
          path: '/orarend',
          name: 'orarend',
          component: OrarendLayout, 
          children: [
              { 
                  path: 'diakorarend',
                  name: 'diakorarend',
                  component: OrarendViewTanulo
              },
              { 
                  path: 'szuloorarend/:id',
                  name: 'szuloorarend',
                  component: OrarendViewSzulo
              },
              { 
                  path: 'tanarorarend',
                  name: 'tanarorarend',
                  component: OrarendViewTanar
              },
              { 
                path: 'adminorarend',
                name: 'adminorarend',
                component: OrarendViewAdmin
              },
          ]
        } ,
        {
          path: '/uzenetek',
          name: 'uzenetek',
          component: UzenetekLayout, 
          children: [
              { 
                  path: 'diakuzenetek',
                  name: 'diakuzenetek',
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
              { 
                path: 'adminuzenetek',
                name: 'adminuzenetek',
                component: UzenetekViewAdmin
            },
          ]
        }, 
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },


  ],
})

export default router

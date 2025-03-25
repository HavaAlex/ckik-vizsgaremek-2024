import { createRouter, createWebHistory } from 'vue-router'

// Admin komponens importálása
import HazikViewAdmin from '../views/admin/HazikView.vue'
import HianyzasokViewAdmin from '../views/admin/HianyzasokView.vue'
import JegyekViewAdmin from '../views/admin/HazikView.vue'
import OrarendViewAdmin from '../views/admin/OrarendView.vue'
import UzenetekViewAdmin from '../views/admin/UzenetekView.vue'
import UserManagementView from '@/views/admin/UserManagementView.vue'
import GroupManagementView from '@/views/admin/GroupManagementView.vue'

//layoutok
import UzenetekLayout from '../layout/UzenetekLayout.vue'
import HazikLayout from '../layout/HazikLayout.vue'
import OrarendLayout from '../layout/OrarendLayout.vue'
import JegyekLayout from '../layout/JegyekLayout.vue'
import HianyzasokLayout from '../layout/HianyzasokLayout.vue' 

import AppLayout from '@/layout/AppLayout.vue'
import Jogosultsagok from '../views/admin/Jogosultsagok.vue'

import LoginView from '../views/auth/LoginView.vue'
import OrarendView from '@/views/orarend/DiakOrarendView.vue'
import ChangePassword from '@/views/auth/ChangePassword.vue'
import DiakFeladatView from '@/views/feladat/DiakFeladatView.vue'
import TanarFeladatView from '@/views/feladat/TanarFeladatView.vue'
import DiakHianyzasView from '@/views/hianyzas/DiakHianyzasView.vue'
import DiakJegyView from '@/views/jegy/DiakJegyView.vue'
import TanarJegyView from '@/views/jegy/TanarJegyView.vue'
import UzenetView from '@/views/uzenet/UzenetView.vue'




const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'applayout',
      component: AppLayout,
      children: [
        {
          path: 'UserManagmentView',
          name: 'UserManagementView',
          component: UserManagementView,
        },
        {
          path: 'GroupManagementView',
          name: 'GroupManagementView',
          component: GroupManagementView
        },
        {
          path: 'feladat',
          name: 'feladat',
          component: HazikLayout, 
          children: [
              { 
                  path: 'diak',
                  name: 'diakfeladatok',
                  component: DiakFeladatView
              },
              { 
                  path: 'szulo/:id',
                  name: 'szulofeladatok',
                  component: DiakFeladatView,
                  props:true
              },
              { 
                  path: 'tanar',
                  name: 'tanarfeladatok',
                  component: TanarFeladatView
              },
              { 
                path: 'adminfeladatok',
                name: 'adminfeladatok',
                component: HazikViewAdmin
              },
          ]
        },
      
        {
            path: 'hianyzas',
            name: 'hianyzas',
            component: HianyzasokLayout,children:[
              {path: 'diak',
                name: 'diakhianyzasok',
                component: DiakHianyzasView
              },
              {path: 'szulo/:id',
                name: 'szulohianyzasok',
                component: DiakHianyzasView
              },
              {path: 'tanar',
                name: 'tanarhianyzasok',
                component: DiakHianyzasView //Ide kéne majd a tanári
              },
              { 
                path: 'admin',
                name: 'adminhianyzasok',
                component: HianyzasokViewAdmin
              },
            ]
        },
        {
          path: '/jegy',
          name: 'jegy',
          component: JegyekLayout, 
          children: [
              { 
                  path: 'diak',
                  name: 'diakjegyek',
                  component: DiakJegyView
              },
              { 
                  path: 'szulo/:id',
                  name: 'szulojegyek',
                  component: DiakJegyView
              },
              { 
                  path: 'tanar',
                  name: 'tanarjegyek',
                  component: TanarJegyView
              },
              { 
                path: 'admin',
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
                  path: 'diak',
                  name: 'diakorarend',
                  component: OrarendView
              },
              { 
                  path: 'szulo/:id',
                  name: 'szuloorarend',
                  component: OrarendView
              },
              { 
                  path: 'tanar',
                  name: 'tanarorarend',
                  component: OrarendView
              },
              { 
                path: 'admin',
                name: 'adminorarend',
                component: OrarendView
              },
          ]
        } ,
        {
          path: '/uzenet',
          name: 'uzenet',
          component: UzenetekLayout, 
          children: [
              { 
                  path: 'diak',
                  name: 'diakuzenetek',
                  component: UzenetView
              },
              { 
                  path: 'szulo',
                  name: 'szulouzenetek',
                  component: UzenetView
              },
              { 
                  path: 'tanar',
                  name: 'tanaruzenetek',
                  component: UzenetView
              },
              { 
                path: 'admin',
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
    {
      path: '/changePassword',
      name: 'changePassword',
      component: ChangePassword,
    },


  ],
})

export default router

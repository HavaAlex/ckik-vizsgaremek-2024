import { createRouter, createWebHistory } from 'vue-router'
import AdminView from '../views/AdminView.vue'
import HazikView from '../views/HazikView.vue'
import HianyzasokView from '../views/HianyzasokView.vue'
import HianyzasokLayout from '../layout/HianyzasokLayout.vue'
import HomeView from '../views/HomeView.vue'
import JegyekView from '../views/JegyekView.vue'
import Jogosultsagok from '../views/Jogosultsagok.vue'
import OrarendView from '../views/OrarendView.vue'
import OsztalyokView from '../views/OsztalyokView.vue'
import SzuloView from '../views/SzuloView.vue'
import TanarView from '../views/TanarView.vue'
import TanuloView from '../views/TanuloView.vue'
import UzenetekView from '../views/UzenetekView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
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
    },
    {
        path: '/hianyzasok',
        name: 'hianyzasok',
        component: HianyzasokLayout,children:[
          {path: 'tanulo',
            name: 'tanulo',
            component: HianyzasokView
          },
          {path: 'kaki',
            name: 'kaki',
            component: JegyekView
          },
        ]
    },
    {
        path: '/jegyek',
        name: 'jegyek',
        component: JegyekView,
    },
    {
        path: '/jogosultsagok',
        name: 'jogosultsagok',
        component: Jogosultsagok,
    },
    {
        path: '/orarend',
        name: 'orarend',
        component: OrarendView,
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
        path: '/uzenetek',
        name: 'uzenetek',
        component: UzenetekView
    },
  ],
})

export default router

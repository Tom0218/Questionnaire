import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      // children:[
      //   {
      //     path:'FinsidePage',
      //     component: ()=>import('../components/FinsidePage.vue')
      //   },
      //   {
      //     path:'FmakeSurePage',
      //     component:()=>import('../components/FmakeSurePage.vue')
      //   },
      //   {
      //     path:'FstatisticsPage',
      //     component:()=>import('../components/FstatisticsPage.vue')
      //   },
      // ]
    },
    {
      path:'/BackView',
      name: 'BackView',
      component: () => import('../views/BackView.vue')
    },
    {
      path:'/BackstageStaticView',
      name: 'BackstageStaticView',
      component: () => import('../views/BackstageStaticView.vue')
    },
    {
      path:'/BackstageStaticView',
      name: 'BackstageStaticView',
      component: () => import('../views/BackstageStaticView.vue')
    },
    {
      path:'/BackstageStaticView',
      name: 'BackstageStaticView',
      component: () => import('../views/BackstageStaticView.vue')
    },
  
  ]
})

export default router

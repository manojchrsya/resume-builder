import { createRouter, createWebHistory } from 'vue-router'
// @ts-ignore - Vue SFC module declaration is missing in this setup
import HomeView from '../views/HomeView.vue'
// @ts-ignore - Vue SFC module declaration is missing in this setup
import AboutView from '../views/AboutView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
    },
  ],
})

export default router

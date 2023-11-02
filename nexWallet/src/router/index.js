import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/transfer',
      name: 'transfer',
      component: () => import('../views/TransferView.vue')
    },
    {
      path: '/exchange',
      name: 'exchange',
      component: () => import('../views/ExchangeView.vue')
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/SignupView.vue'),
      children: [
        {
          path: 'basic',
          name: 'basic',
          component: () => import('../components/signup1_basic.vue')
        },
        {
          path: 'wallet',
          name: 'wallet',
          component: () => import('../components/signup2_wallet.vue')
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue')
    },
    {
      path: '/savings',
      name: 'savings',
      component: () => import('../views/InvestView.vue')
    }
  ]
})

export default router

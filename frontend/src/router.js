import { createRouter, createWebHistory } from 'vue-router'
import { session } from './data/session'
import { userResource } from '@/data/user'
import MainLayout from '@/layouts/MainLayout.vue'

const routes = [
    {
        path: '/',
        component: MainLayout,
        children: [
            {
                name: 'Home',
                path: '',
                component: () => import('@/pages/Home.vue'),
            },

            {
                name: 'CounterpartyContracts',
                path: 'counterpartycontracts',
                component: () => import('@/pages/CounterpartyContracts.vue'),
            },

            {
                name: 'ContractDetails',
                path: 'contract/:name',
                component: () => import('@/pages/ContractDetails.vue'),
                props: true,
            },
            
            {
                name: 'RequestContract',
                path: 'request-contract',
                component: () => import('@/pages/RequestContract.vue'),
            }
        ]
    },

    {
        name: 'Login',
        path: '/account/login',
        component: () => import('@/pages/Login.vue'),
    },
]

let router = createRouter({
    history: createWebHistory('/frontend'),
    routes,
})

router.beforeEach(async (to, from, next) => {
    let isLoggedIn = session.isLoggedIn
    
    try {
        await userResource.promise
    }
    
    catch (error) {
    isLoggedIn = false
  }

  if (to.name === 'Login' && isLoggedIn) {
    next({ name: 'Home' })
  } else if (to.name !== 'Login' && !isLoggedIn) {
    next({ name: 'Login' })
  } else {
    next()
  }
})

export default router

import { createRouter, createWebHistory } from 'vue-router'


import Home from './views/demoView.vue'
import login from './views/loginView.vue'

const routes = [{
        path: '/home',
        name: 'Home',
        component: Home
    },
    {
        path: '/',
        name: 'login',
        component: login
    }
]


const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
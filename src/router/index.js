import { createRouter, createWebHashHistory } from 'vue-router'
import SignupPage from '@/views/SignupPage.vue'
import LoginPage from '@/views/LoginPage.vue'
import TodoList from '@/views/TodoList.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/login' }, // 設定預設路徑
    {
      path: '/signup',
      component: SignupPage,
    },
    {
      path: '/login',
      component: LoginPage,
    },
    {
      path: '/todolist',
      component: TodoList,
    },
  ],
})

export default router

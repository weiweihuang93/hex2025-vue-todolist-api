<script setup>
import axios from 'axios'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const BASE_URL = import.meta.env.VITE_BASE_URL

const router = useRouter()

const todoToken = ref('')
const nickname = ref('')

// 驗證登入
onMounted(async () => {
  const cookieToken = document.cookie.replace(
    /(?:(?:^|.*;\s*)todoToken\s*\=\s*([^;]*).*$)|^.*$/,
    '$1',
  )
  if (!cookieToken) return router.push('/login')
  todoToken.value = cookieToken

  try {
    const res = await axios.get(`${BASE_URL}/users/checkout`, {
      headers: { Authorization: todoToken.value },
    })
    nickname.value = res.data.nickname
    await getTodos()
  } catch (error) {
    console.log('驗證失敗', error)
    router.push('/login')
  }
})

// 登出
const signOut = async () => {
  try {
    const res = await axios.post(`${BASE_URL}/users/sign_out`, null, {
      headers: { Authorization: todoToken.value },
    })
    todoToken.value = ''
    document.cookie = 'todoToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/'
    router.push('/login')
  } catch (error) {
    console.log('登出失敗', error)
  }
}

// 代辦事項
const todos = ref([])

const getTodos = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/todos/`, {
      headers: { Authorization: todoToken.value },
    })
    todos.value = res.data.data
  } catch (error) {
    console.log('代辦事項載入失敗', error)
  }
}

const newTodo = ref({
  content: '',
})

// 新增代辦事項
const addTodo = async () => {
  if (!newTodo.value.content.trim()) {
    console.log('欄位未填寫')
    return
  }
  try {
    const res = await axios.post(`${BASE_URL}/todos/`, newTodo.value, {
      headers: { Authorization: todoToken.value },
    })
    await getTodos()
    newTodo.value.content = ''
  } catch (error) {
    console.log('新增失敗', error)
  }
}

// 刪除代辦事項
const removeTodo = async (todo_id) => {
  try {
    const res = await axios.delete(`${BASE_URL}/todos/${todo_id}`, {
      headers: { Authorization: todoToken.value },
    })
    await getTodos()
  } catch (error) {
    console.log('刪除失敗', error)
  }
}

// 切換完成狀態
const toggleStatus = async (todo_id) => {
  try {
    const res = await axios.patch(`${BASE_URL}/todos/${todo_id}/toggle`, null, {
      headers: { Authorization: todoToken.value },
    })
    await getTodos()
  } catch (error) {
    console.log('更新失敗', error)
  }
}

const totalUndoneTodo = computed(() => {
  return todos.value.filter((todo) => !todo.status).length
})

// 狀態切換與篩選功能
const currentFilter = ref('all')

const filteredTodos = computed(() => {
  switch (currentFilter.value) {
    case 'undone':
      return todos.value.filter((t) => !t.status)
    case 'done':
      return todos.value.filter((t) => t.status)
    default:
      return todos.value
  }
})
</script>

<template>
  <div id="todoListPage" class="bg-half">
    <nav>
      <h1><a href="#">ONLINE TODO LIST</a></h1>
      <ul>
        <li class="todo_sm">
          <a href="#">
            <span>{{ nickname || '○○○' }} 的代辦</span>
          </a>
        </li>
        <li>
          <a @click.prevent="signOut">登出</a>
        </li>
      </ul>
    </nav>
    <div class="container todoListPage vhContainer">
      <div class="todoList_Content">
        <div class="inputBox">
          <input v-model="newTodo.content" type="text" placeholder="請輸入待辦事項" />
          <a @click.prevent="addTodo">
            <i class="fa fa-plus"></i>
          </a>
        </div>
        <div v-if="todos.length > 0" class="todoList_list">
          <ul class="todoList_tab">
            <li>
              <a @click.prevent="currentFilter = 'all'" :class="{ active: currentFilter === 'all' }"
                >全部</a
              >
            </li>
            <li>
              <a
                @click.prevent="currentFilter = 'undone'"
                :class="{ active: currentFilter === 'undone' }"
                >待完成</a
              >
            </li>
            <li>
              <a
                @click.prevent="currentFilter = 'done'"
                :class="{ active: currentFilter === 'done' }"
                >已完成</a
              >
            </li>
          </ul>
          <div class="todoList_items">
            <ul class="todoList_item">
              <li v-for="todo in filteredTodos" :key="todo.id">
                <label class="todoList_label">
                  <input
                    type="checkbox"
                    class="todoList_input"
                    :checked="todo.status"
                    @change="toggleStatus(todo.id)"
                  />
                  <span>{{ todo.content }}</span>
                </label>
                <a @click.prevent="removeTodo(todo.id)">
                  <i class="fa fa-times"></i>
                </a>
              </li>
            </ul>
            <div class="todoList_statistics">
              <p>{{ totalUndoneTodo }} 個待完成項目</p>
            </div>
          </div>
        </div>
        <div v-else class="empty">
          <p class="">目前尚無待辦事項</p>
          <img
            class="emptyImg"
            src="https://github.com/hexschool/2022-web-layout-training/blob/main/todolist/empty%201.png?raw=true"
            alt="emptyImg"
          />
        </div>
      </div>
    </div>
  </div>
</template>

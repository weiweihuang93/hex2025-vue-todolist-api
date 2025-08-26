<script setup>
import axios from 'axios'
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

const BASE_URL = import.meta.env.VITE_BASE_URL

const router = useRouter()

// 登入用資料
const loginForm = ref({
  email: '',
  password: '',
})

// 錯誤狀態
const errors = ref({
  email: '',
  password: '',
  nickname: '',
  confirmPassword: '',
})

const todoToken = ref('')

const signIn = async () => {
  // 重置錯誤訊息
  errors.value = { email: '', password: '' }

  // 空值檢查
  if (!loginForm.value.email.trim()) {
    errors.value.email = '此欄位不可留空'
  }
  if (!loginForm.value.password.trim()) {
    errors.value.password = '此欄位不可留空'
  }

  // 如果有任何錯誤就直接 return
  if (errors.value.email || errors.value.password) return

  try {
    const res = await axios.post(`${BASE_URL}/users/sign_in`, loginForm.value)

    todoToken.value = res.data.token
    const expireDate = new Date(res.data.exp * 1000)
    document.cookie = `todoToken=${todoToken.value}; expires=${expireDate.toUTCString()}; path=/`

    loginForm.value = {}
    console.log(`您好，${res.data.nickname} 登入成功！`)

    router.push('/todolist')
  } catch (error) {
    console.log('註冊失敗', error)
  }
}
</script>

<template>
  <div id="loginPage" class="bg-yellow">
    <div class="conatiner loginPage vhContainer">
      <div class="side">
        <a href="#"
          ><img
            class="logoImg"
            src="https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/todolist/logo.png"
            alt=""
        /></a>
        <img
          class="d-m-n"
          src="https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/todolist/img.png"
          alt="workImg"
        />
      </div>
      <div>
        <form @submit.prevent="signIn" class="formControls">
          <h2 class="formControls_txt">最實用的線上代辦事項服務</h2>
          <label class="formControls_label" for="email">Email</label>
          <input
            v-model="loginForm.email"
            class="formControls_input"
            type="text"
            id="email"
            name="email"
            placeholder="請輸入 email"
          />
          <span v-if="errors.email" class="errorMsg">{{ errors.email }}</span>

          <label class="formControls_label" for="pwd">密碼</label>
          <input
            v-model="loginForm.password"
            class="formControls_input"
            type="password"
            name="pwd"
            id="pwd"
            placeholder="請輸入密碼"
          />
          <span v-if="errors.password" class="errorMsg">{{ errors.password }}</span>

          <input class="formControls_btnSubmit" type="submit" value="登入" />
          <RouterLink to="signup" class="formControls_btnLink">註冊帳號</RouterLink>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import { computed, ref, watch } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import Swal from 'sweetalert2'

const BASE_URL = import.meta.env.VITE_BASE_URL

const router = useRouter()

// 註冊用資料
const registerForm = ref({
  email: '',
  password: '',
  nickname: '',
})

const confirmPassword = ref('')

// 錯誤狀態
const errors = ref({
  email: '',
  password: '',
  nickname: '',
  confirmPassword: '',
})

// 監聽 registerForm 所有欄位
watch(
  registerForm,
  (newVal) => {
    errors.value.email = newVal.email.trim() ? '' : '此欄位不可留空'
    errors.value.password = newVal.password ? '' : '此欄位不可留空'
    errors.value.nickname = newVal.nickname.trim() ? '' : '此欄位不可留空'
  },
  { deep: true },
)

watch(confirmPassword, (val) => {
  errors.value.confirmPassword = val ? '' : '此欄位不可留空'
})

// 判斷密碼不一致
const validateConfirmPassword = computed(() => {
  // 如果任一個還沒輸入，就不需要判斷一致性
  if (!registerForm.value.password || !confirmPassword.value) {
    return ''
  }
  // 兩者都輸入了，再判斷是否一致
  if (registerForm.value.password !== confirmPassword.value) {
    return '密碼不一致'
  }
  return ''
})

watch(validateConfirmPassword, (val) => {
  errors.value.confirmPassword = val
})

const signUp = async () => {
  // 同步檢查空值與 confirm 密碼
  errors.value.email = registerForm.value.email.trim() ? '' : '此欄位不可留空'
  errors.value.password = registerForm.value.password ? '' : '此欄位不可留空'
  errors.value.nickname = registerForm.value.nickname.trim() ? '' : '此欄位不可留空'
  errors.value.confirmPassword = confirmPassword.value
    ? registerForm.value.password !== confirmPassword.value
      ? '密碼不一致'
      : ''
    : '此欄位不可留空'

  // 如果有任何錯誤就直接 return
  if (
    errors.value.email ||
    errors.value.password ||
    errors.value.nickname ||
    errors.value.confirmPassword
  )
    return

  try {
    await axios.post(`${BASE_URL}/users/sign_up`, registerForm.value)
    resetForm()

    await Swal.fire({
      icon: 'success',
      title: '註冊成功',
      text: '歡迎加入，將為你導向登入頁面',
      confirmButtonText: '前往登入',
    })

    router.push('/login')
  } catch (error) {
    const msg = error.response?.data?.message || '發生未知錯誤'
    Swal.fire({
      icon: 'error',
      title: '註冊失敗',
      text: msg,
      confirmButtonText: '請重新註冊',
    })

    resetForm()
  }
}

const resetForm = () => {
  registerForm.value = { email: '', password: '', nickname: '' }
  confirmPassword.value = ''
  errors.value = { email: '', password: '', nickname: '', confirmPassword: '' }
}
</script>

<template>
  <div id="signUpPage" class="bg-yellow">
    <div class="conatiner signUpPage vhContainer">
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
        <form @submit.prevent="signUp" class="formControls">
          <h2 class="formControls_txt">註冊帳號</h2>
          <label class="formControls_label" for="email">Email</label>
          <input
            v-model="registerForm.email"
            class="formControls_input"
            type="text"
            id="email"
            name="email"
            placeholder="請輸入 email"
          />
          <span v-if="errors.email" class="errorMsg">{{ errors.email }}</span>

          <label class="formControls_label" for="name">您的暱稱</label>
          <input
            v-model="registerForm.nickname"
            class="formControls_input"
            type="text"
            name="name"
            id="name"
            placeholder="請輸入您的暱稱"
          />
          <span v-if="errors.nickname" class="errorMsg">{{ errors.nickname }}</span>

          <label class="formControls_label" for="pwd">密碼</label>
          <input
            v-model="registerForm.password"
            class="formControls_input"
            type="password"
            name="pwd"
            id="pwd"
            placeholder="請輸入密碼"
          />
          <span v-if="errors.password" class="errorMsg">{{ errors.password }}</span>

          <label class="formControls_label" for="confirmpwd">再次輸入密碼</label>
          <input
            v-model="confirmPassword"
            class="formControls_input"
            type="password"
            name="confirmpwd"
            id="confirmpwd"
            placeholder="請再次輸入密碼"
          />
          <span v-if="errors.confirmPassword" class="errorMsg">{{ errors.confirmPassword }}</span>

          <input class="formControls_btnSubmit" type="submit" value="註冊帳號" />
          <RouterLink to="login" class="formControls_btnLink">登入</RouterLink>
        </form>
      </div>
    </div>
  </div>
</template>

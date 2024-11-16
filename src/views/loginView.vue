<template>
  <div class="conten">
    <div class="container" id="container">

      <div class="form-container sign-up-container">
        <form @submit.prevent="registerUser">
          <h1>创建账户</h1>
          <div class="social-container">
          </div>
          <span>使用您的电子邮件注册</span>
          <input type="text" v-model="name" placeholder="姓名" required />
          <input type="email" v-model="email" placeholder="电子邮箱" required />
          <input type="password" v-model="password" placeholder="密码" required />
          <button type="submit">注册</button>
        </form>
      </div>

      <div class="form-container sign-in-container">
        <form @submit.prevent="loginUser">
          <h1>登录</h1>
          <div style="height: 20px;"></div>
          <input type="email" v-model="loginEmail" placeholder="电子邮箱" required />
          <input type="password" v-model="loginPassword" placeholder="密码" required />
          <span id="errorMessage" style="color: red;">{{ errorMessage }}</span>
          <a href="#" @click.prevent="togglePanel('forgotPassword')">忘记密码?</a>
          <button type="submit">登录</button>
        </form>
      </div>

      <div class="form-container forgot-password-container">
        <form @submit.prevent="sendResetLink">
          <h1>找回密码</h1>
          <input type="email" v-model="resetEmail" placeholder="电子邮箱" required />
          <button type="submit">发送重置密码链接</button>
          <span v-if="resetMessage" style="color: green;">{{ resetMessage }}</span>
          <span v-if="resetError" style="color: red;">{{ resetError }}</span>
          <a href="#" @click.prevent="togglePanel('signIn')">返回登录</a>
        </form>
      </div>

      <div class="overlay-container">
        <div class="overlay">
          <div class="overlay-panel overlay-left">
            <h1>欢迎回来!</h1>
            <p>使用现有账号登陆VIS</p>
            <button class="ghost" @click="togglePanel('signIn')">登录</button>
          </div>
          <div class="overlay-panel overlay-right">
            <h1>欢迎来到VIS</h1>
            <p>没有账号？点击这里注册一个账号吧</p>
            <button class="ghost" @click="togglePanel('signUp')">注册</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userlogn.js';

const router = useRouter();
const userStore = useUserStore();

const name = ref('');
const email = ref('');
const password = ref('');
const loginEmail = ref('');
const loginPassword = ref('');
const resetEmail = ref('');
const errorMessage = ref('');
const resetMessage = ref('');
const resetError = ref('');

onMounted(() => {
    userStore.initializeTestUser(); // 确保测试用户被初始化
});

const registerUser = () => {
    const newUser = { name: name.value, email: email.value, password: password.value };
    userStore.registerUser(newUser);
    togglePanel('signIn');
};

const loginUser = () => {
    try {
        userStore.loginUser({ email: loginEmail.value, password: loginPassword.value });
        errorMessage.value = '';
        router.push('/home'); // 确保成功登录后跳转
    } catch (error) {
        errorMessage.value = '账号或密码错误，请重新输入';
        console.error(error); // 输出错误信息
    }
};


const togglePanel = (panel) => {
    const container = document.getElementById('container');
    if (panel === 'signUp') {
        container.classList.add('right-panel-active');
        container.classList.remove('forgot-password-active');
    } else if (panel === 'forgotPassword') {
        container.classList.add('forgot-password-active');
        container.classList.remove('right-panel-active');
    } else {
        container.classList.remove('right-panel-active');
        container.classList.remove('forgot-password-active');
    }
};
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css?family=Montserrat:400,800');

* {
  box-sizing: border-box;
}

body {
  background: linear-gradient(to right, #2AF598, #009EFD);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-family: 'Montserrat', sans-serif;
  height: 100vh;
  margin: -20px 0 50px;
}

h1 {
  font-weight: bold;
  margin: 0;
}

h2 {
  text-align: center;
}

p {
  font-size: 14px;
  font-weight: 100;
  line-height: 20px;
  letter-spacing: 0.5px;
  margin: 20px 0 30px;
}

span {
  font-size: 12px;
}

a {
  color: #333;
  font-size: 14px;
  text-decoration: none;
  margin: 15px 0;
}

button {
  border-radius: 20px;
  border: 1px solid white;
  background-color: #009EFD;
  color: #FFFFFF;
  font-size: 12px;
  font-weight: bold;
  padding: 12px 45px;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: transform 80ms ease-in;
}

button:active {
  transform: scale(0.95);
}

button:focus {
  outline: none;
}

button.ghost {
  background-color: transparent;
  border-color: #FFFFFF;
}

form {
  background-color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 50px;
  height: 100%;
  text-align: center;
}

input {
  background-color: #eee;
  border: none;
  padding: 12px 15px;
  margin: 8px 0;
  width: 100%;
}

.container {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
  position: relative;
  overflow: hidden;
  width: 768px;
  max-width: 100%;
  min-height: 480px;
}

.form-container {
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
}

.sign-in-container {
  left: 0;
  width: 50%;
  z-index: 2;
}

.container.right-panel-active .sign-in-container {
  transform: translateX(100%);
}

.sign-up-container {
  left: 0;
  width: 50%;
  opacity: 0;
  z-index: 1;
}

.container.right-panel-active .sign-up-container {
  transform: translateX(100%);
  opacity: 1;
  z-index: 5;
  animation: show 0.6s;
}

@keyframes show {
  0%, 49.99% {
    opacity: 0;
    z-index: 1;
  }
  
  50%, 100% {
    opacity: 1;
    z-index: 5;
  }
}

.overlay-container {
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: transform 0.6s ease-in-out;
  z-index: 100;
}

.container.right-panel-active .overlay-container {
  transform: translateX(-100%);
}

.overlay {
  background: -webkit-linear-gradient(to right, #2AF598, #009EFD);
  background: linear-gradient(to right, #2AF598, #009EFD);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 0 0;
  color: #FFFFFF;
  position: relative;
  left: -100%;
  height: 100%;
  width: 200%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
}

.container.right-panel-active .overlay {
  transform: translateX(50%);
}

.overlay-panel {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 40px;
  text-align: center;
  top: 0;
  height: 100%;
  width: 50%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
}

.overlay-left {
  transform: translateX(-20%);
}

.container.right-panel-active .overlay-left {
  transform: translateX(0);
}

.overlay-right {
  right: 0;
  transform: translateX(0);
}

.container.right-panel-active .overlay-right {
  transform: translateX(20%);
}

.social-container {
  margin: 20px 0;
}

.social-container a {
  border: 1px solid #DDDDDD;
  border-radius: 50%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin: 0 5px;
  height: 40px;
  width: 40px;
}

footer {
  background-color: #222;
  color: #fff;
  font-size: 14px;
  bottom: 0;
  position: fixed;
  left: 0;
  right: 0;
  text-align: center;
  z-index: 999;
}

footer p {
  margin: 10px 0;
}

footer i {
  color: linear-gradient(to right, #2AF598, #009EFD);
}

footer a {
  color: #3c97bf;
  text-decoration: none;
}

.form-container.forgot-password-container {
  left: 0;
  width: 50%;
  opacity: 0;
  z-index: 1;
}

.container.forgot-password-active .form-container.forgot-password-container {
  transform: translateX(100%);
  opacity: 1;
  z-index: 5;
  animation: show 0.6s;
}

.conten {
  margin-top: 10%;
  display: flex;
  justify-content: center;
}
</style>
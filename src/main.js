import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import router from './router';

// 创建Pinia实例
const pinia = createPinia();

const app = createApp(App);
// 挂载Pinia实例到应用
app.use(pinia);
app.use(router);
app.mount('#app');
document.title = '欢迎来到VIS！';
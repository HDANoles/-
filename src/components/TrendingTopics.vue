<template>
  <div class="card">
    <p class="time-text">
      <span>{{ currentTime.split(' ')[0] }}</span>
      <span class="time-sub-text">{{ currentTime.split(' ')[1] }}</span>
    </p>
    <p class="day-text">{{ currentDay }}</p>
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16" stroke-width="0" fill="currentColor" stroke="currentColor" class="moon">
      <path d="M6.278a.768.768 0 0 1.08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1.81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6.278z"></path>
      <path d="M10.794 3.148a.217.217 0 0 1.412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0.412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.3.387-1.162zM13.863.099a.145.145 0 0 1.274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0.274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a.145.145 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z"></path>
    </svg>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 创建响应式数据用于存储当前时间
const currentTime = ref('');
// 创建响应式数据用于存储当前日期
const currentDay = ref('');

// 在组件挂载时获取当前时间和日期
onMounted(() => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const amPm = hours >= 12? 'PM' : 'AM';
  const formattedHours = hours % 12 === 0? 12 : hours % 12;
  const formattedMinutes = minutes < 10? `0${minutes}` : minutes;

  currentTime.value = `${formattedHours}:${formattedMinutes} ${amPm}`;

  const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
  const dayIndex = now.getDay();
  const monthIndex = now.getMonth();
  const day = now.getDate();

  currentDay.value = `${days[dayIndex]}, ${months[monthIndex]}${day}`;
});
</script>

<style>
.card {
  margin-top: 20px;
  width: 100%;
  height: 150px;
  border-radius: 15px;

  display: flex;
  color: white;
  justify-content: center;
  position: relative;
  flex-direction: column;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  overflow: hidden;
}

.card:hover {
  box-shadow:  linear-gradient(90deg, #2AF598 0%, #009EFD 100%);
}

.time-text {
  font-size: 50px;
  margin-top: 0px;
  margin-left: 15px;
  font-weight: 600;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}

.time-sub-text {
  font-size: 15px;
  margin-left: 5px;
}

.day-text {
  font-size: 18px;
  margin-top: 0px;
  margin-left: 15px;
  font-weight: 500;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}

.moon {
  font-size: 20px;
  position: absolute;
  right: 15px;
  top: 15px;
  transition: all 0.3s ease-in-out;
}

.card:hover >.moon {
  font-size: 23px;
}
</style>
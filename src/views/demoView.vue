<template>
  <div class="app-container">
    <!-- 左侧导航栏 -->
    <nav class="sidebar-left">
      <div class="brand">
        <h1>- VIS -</h1>
      </div>

      <!-- 主菜单 -->
      <div class="menu-section">
        <h3>welcome！</h3>
        <ul>
          <li @click="setActiveComponent('compass')">
            <Compass class="icon" /> 探索
          </li>
          <li @click="setActiveComponent('add')">
            <SquarePlus class="icon" /> 发布
          </li>
          <li @click="setActiveComponent('message')">
            <MessageCircle class="icon" /> 私信
          </li>
          <li @click="setActiveComponent('collection')">
            <Star class="icon" /> 收藏
          </li>
          <li @click="setActiveComponent('dynamic')">
            <Image class="icon" /> 图片
          </li>
          <li @click="setActiveComponent('shortVideo')">
            <SquarePlay class="icon" /> 短视频
          </li>
          <li @click="setActiveComponent('topic')">
            <TreePineIcon class="icon" /> 好友动态
          </li>
          <li @click="setActiveComponent('person')">
            <CalendarIcon class="icon" /> 个人资料
          </li>
        </ul>
      </div>
      <ul class="exit">
        <li>
          <LogOutIcon class="icon" /> 登出
        </li>
      </ul>
    </nav>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <TopicPage v-if="activeComponent === 'topic'" />
      <picturePage v-else-if="activeComponent === 'dynamic'" />
      <Person v-else-if="activeComponent === 'person'" />
      <vidoPage v-else-if="activeComponent === 'shortVideo'" />
      <compassPage v-else-if="activeComponent === 'compass'" @changeView="handleChangeView" />
      <messages v-else-if="activeComponent === 'message'" />
      <addpage v-else-if="activeComponent === 'add'" />
      <collectionPage v-else-if="activeComponent === 'collection'" />
      <UserProfile v-else-if="activeComponent === 'userProfile'" :username="selectedUsername" @goBack="setActiveComponent('compass')" />
    </div>

    <!-- 右侧边栏 -->
    <aside class="sidebar-right" :class="{ 'hidden': isRightSidebarHidden }">
      <!-- 搜索框 -->
      <div class="search-bar">
        <input class="searchInput" type="text" placeholder="搜索你感兴趣的内容" />
        <button class="searchButton">
          <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 29 29" fill="none">
            <g clip-path="url(#clip0_2_17)">
              <g filter="url(#filter0_d_2_17)">
                <path d="M23.7953 23.9182L19.0585 19.1814M19.0585 19.1814C19.8188 18.4211 20.4219 17.5185 20.8333 16.5251C21.2448 15.5318 21.4566 14.4671 21.4566 13.3919C21.4566 12.3167 21.2448 11.252 20.8333 10.2587C20.4219 9.2653 19.8188 8.36271 19.0585 7.60242C18.2982 6.84214 17.3956 6.23905 16.4022 5.82759C15.4089 5.41612 14.3442 5.20435 13.269 5.20435C12.1938 5.20435 11.1291 5.41612 10.1358 5.82759C9.1424 6.23905 8.23981 6.84214 7.47953 7.60242C5.94407 9.13789 5.08145 11.2204 5.08145 13.3919C5.08145 15.5634 5.94407 17.6459 7.47953 19.1814C9.01499 20.7168 11.0975 21.5794 13.269 21.5794C15.4405 21.5794 17.523 20.7168 19.0585 19.1814Z" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" shape-rendering="crispEdges"></path>
              </g>
            </g>
            <defs>
              <filter id="filter0_d_2_17" x="-0.418549" y="3.70435" width="29.7139" height="29.7139" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
                <feOffset dy="4"></feOffset>
                <feGaussianBlur stdDeviation="2"></feGaussianBlur>
                <feComposite in2="hardAlpha" operator="out"></feComposite>
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"></feColorMatrix>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2_17"></feBlend>
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2_17" result="shape"></feBlend>
              </filter>
              <clipPath id="clip0_2_17">
                <rect width="28.0702" height="28.0702" fill="white" transform="translate(0.403503 0.526367)"></rect>
              </clipPath>
            </defs>
          </svg>
        </button>
      </div>

      <!-- 热点 -->
      <TrendingTopics />
      <!-- 联系人区域 -->
      <div class="contacts-section">
        <h3>好友</h3>
        <div class="contact-list">
          <div v-for="contact in contacts" :key="contact.id" class="contact-item">
            <div>
              <button class="avter" href="#">
                <img :src="contact.avatar" class="avter" style="margin-left: -6px;margin-top: -2px;" />
              </button>
            </div>
            <span class="name">{{ contact.name }}</span>
            <span class="status" :class="{ online: contact.online }"></span>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import TopicPage from "../components/TopicPage.vue";
import TrendingTopics from "@/components/TrendingTopics.vue";
import picturePage from "@/components/picturePage.vue";
import Person from "@/components/personPage.vue";
import vidoPage from "@/components/vidoPage.vue";
import compassPage from "@/components/compassPage.vue";
import messages from "@/components/messagesPage.vue";
import addpage from "@/components/addPage.vue";
import collectionPage from "@/components/collectionPage.vue";
import UserProfile from "@/components/otherPage.vue";

import {
  Compass,
  SquarePlus,
  MessageCircle,
  Star,
  CalendarIcon,
  TreePineIcon,
  Image,
  LogOutIcon,
  SquarePlay,
} from 'lucide-vue-next';

const contacts = ref([
  { id: 1, name: '小🐟恋佳', online: true, avatar: '/imgs/avter/avter1.jpg' },
  { id: 2, name: '狸花', online: true, avatar: '/imgs/avter/avter3.jpg' },
  { id: 3, name: 'Bryan', online: true, avatar: '/imgs/avter/avter4.jpg' },
  { id: 4, name: '风止何安', online: false, avatar: '/imgs/avter/avter5.png' },
  { id: 5, name: '半糖主义', online: false, avatar: '/imgs/avter/12.png' },
]);

const activeComponent = ref('compass');
const selectedUsername = ref('');
const isRightSidebarHidden = ref(false);

const setActiveComponent = (component) => {
  activeComponent.value = component;
};

const handleChangeView = ({ component, username }) => {
  activeComponent.value = component;
  selectedUsername.value = username;
};
</script>

<style scoped>
.app-container {
  background-color: #1a1b26;
  color: #ffffff;
  height: auto;
}

.sidebar-left {
  position: fixed;
  top: 0;
  left: 0;
  width: 13%;
  height: 100vh;
  overflow-y: auto;
  padding: 20px;
  background-color: #13141f;
  border-right: 1px solid #2a2b36;
}

.brand h1 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 2rem;
}

.menu-section {
  margin-bottom: 2rem;
}

.menu-section h3 {
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 1rem;
}

.menu-section ul {
  list-style: none;
  padding: 0;
}

.menu-section li {
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
  cursor: pointer;
  transition: color 0.3s;
}

.menu-section li:hover {
  color: #7c3aed;
}

.icon {
  width: 18px;
  height: 18px;
  margin-right: 10px;
}

.main-content {
  max-width: calc(100% - 38%);
  flex-grow: 1;
  padding: 20px;
  background-color: #1a1b26;
  overflow-y: auto;
  margin-left: 318px;
  height: auto;
}

.sidebar-right {
  position: fixed;
  top: 0;
  right: 0;
  width: 17%;
  height: 100vh;
  overflow-y: auto;
  padding: 20px;
  background-color: #13141f;
  border-left: 1px solid #2a2b36;
}

.search-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  background: #2f3640;
  border-radius: 50px;
  position: relative;
}

.searchButton {
  color: white;
  position: absolute;
  right: 8px;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: linear-gradient(90deg, #2AF598 0%, #009EFD 100%);
  border: 0;
  display: inline-block;
  transition: all 300ms cubic-bezier(.23, 1, 0.32, 1);
}

button:hover, .avter {
  color: #fff;
  background-color: #1A1A1A;
  box-shadow: rgba(0, 0, 0, 0.5) 0 10px 20px;
  transform: translateY(-3px);
}

button:active, .avter {
  box-shadow: none;
  transform: translateY(0);
}

.searchInput {
  border: none;
  background: none;
  outline: none;
  color: white;
  font-size: 15px;
  padding: 15px 20px;
}

.avatar {
  border-radius: 50%;
  width: 50px;
  height: 50px;
  object-fit: cover;
}

.avter {
  display: flex;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: solid 1px #10b981;
  display: inline-block;
  transition: all 300ms cubic-bezier(.23, 1, 0.32, 1);
}

.contacts-section {
  margin-bottom: 2rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: 20px;
  padding: 10px 0;
}

.name {
  color: white;
}

.status {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #666;
  margin-left: auto;
}

.status.online {
  background-color: #10b981;
}

.exit li {
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
  cursor: pointer;
  transition: color 0.3s;
  position: absolute;
  left: 20px;
  bottom: 5%;
}

.exit li:hover {
  color: #7c3aed;
}
</style>
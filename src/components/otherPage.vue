<template>
  <div class="user-profile">
    <!-- 用户资料页面的整体容器 -->
    <div class="profile-header">
      <!-- 返回按钮，点击可返回上一页 -->
      <button class="return-button" @click="goBack">
        <!-- 返回箭头图标组件 -->
        <ArrowLeft class="icon" />
        返回
      </button>
      <!-- 显示当前用户的用户名及主页标识 -->
      <h1>{{ user.username }}的主页</h1>
      <!-- 关注/取消关注按钮，根据是否已关注状态显示不同文本 -->
      <button class="follow-button" @click="toggleFollow">
        {{ isFollowing? '取消关注' : '关注' }}
      </button>
    </div>

    <!-- 加载中的提示信息，当数据正在加载时显示 -->
    <div v-if="isLoading" class="loading">加载中...</div>

    <!-- 当数据加载完成后显示以下内容 -->
    <template v-else>
      <div class="profile-info">
        <!-- 封面照片容器 -->
        <div class="cover-photo">
          <!-- 封面照片图片元素，绑定了用户的封面照片路径作为src属性 -->
          <img :src="user.coverPhoto" alt="Cover Photo" />
        </div>
        <div class="user-details">
          <!-- 用户头像图片元素，绑定了用户头像路径作为src属性，并设置了替代文本 -->
          <img :src="user.avatar" :alt="user.username" class="avatar" />
          <!-- 显示用户的用户名 -->
          <h2>{{ user.username }}</h2>
          <!-- 显示用户的个人简介 -->
          <p class="bio">{{ user.bio }}</p>
          <!-- 用户统计信息容器，包括帖子数量、粉丝数量和关注数量 -->
          <div class="stats">
            <span><strong>{{ user.posts?.length || 0 }}</strong> 帖子</span>
            <span><strong>{{ user.followers }}</strong> 粉丝</span>
            <span><strong>{{ user.following }}</strong> 关注</span>
          </div>
        </div>
      </div>

      <div class="user-posts">
        <!-- 循环遍历用户的帖子数据，为每个帖子生成对应的展示组件 -->
        <div v-for="post in user.posts" :key="post.id" class="post">
          <div class="post-image-container">
            <!-- 帖子图片元素，绑定了帖子的图片路径作为src属性，并设置了替代文本 -->
            <img :src="post.image" :alt="post.title" class="post-image" />
            <div class="post-overlay">
              <div class="post-info">
                <span class="likes">
                  <!-- 点赞图标组件，根据是否已点赞设置不同样式，点击可触发点赞操作 -->
                  <HeartIcon class="icon" :class="{ 'liked': post.hasLiked }" @click.stop="likePost(post)" />
                  {{ post.likes }}
                </span>
                <span class="comments">
                  <!-- 评论图标组件 -->
                  <MessageCircleIcon class="icon" />
                  {{ post.comments }}
                </span>
              </div>
            </div>
          </div>
          <div class="post-details">
            <!-- 帖子标题 -->
            <h3 class="post-title">{{ post.title }}</h3>
            <!-- 帖子内容 -->
            <p class="post-content">{{ post.content }}</p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, defineEmits, defineProps } from 'vue';
import { ArrowLeft, HeartIcon, MessageCircleIcon } from 'lucide-vue-next';
import { useUserStore } from '@/stores/userStore';

// 定义组件接收的属性，这里要求传入一个字符串类型的用户名，且是必需的
const props = defineProps({
  username: {
    type: String,
    required: true
  }
});

// 定义组件向外发出的事件，这里定义了一个名为'goBack'的事件
const emit = defineEmits(['goBack']);

// 获取用户数据存储实例
const userStore = useUserStore();

// 使用ref创建响应式数据，用于存储用户信息对象，初始为空对象
const user = ref({});
// 使用ref创建响应式数据，用于存储是否关注当前用户的状态，初始为false
const isFollowing = ref(false);
// 使用ref创建响应式数据，用于存储数据是否正在加载的状态，初始为true
const isLoading = ref(true);

// 异步函数，用于获取用户数据
const fetchUserData = async () => {
  // 设置数据加载状态为正在加载
  isLoading.value = true;
  try {
    // 模拟API调用获取用户数据，这里通过设置一个定时器延迟1秒来模拟异步获取数据的过程
    await new Promise(resolve => setTimeout(resolve, 1000));

    user.value = {
      username: props.username,
      avatar: `https://picsum.photos/seed/${props.username}/150/150`,
      coverPhoto: `https://picsum.photos/seed/${props.username}/1000/300`,
      bio: '热爱摄影和旅行的设计师',
      followers: Math.floor(Math.random() * 10000),
      following: Math.floor(Math.random() * 1000),
      posts: userStore.posts.slice(0, 9).map(post => ({
       ...post,
        hasLiked: false
      }))
    };
  } catch (error) {
    // 如果获取数据过程中出现错误，在控制台打印错误信息
    console.error('Error fetching user data:', error);
  } finally {
    // 无论获取数据是否成功，最终都设置数据加载状态为加载完成
    isLoading.value = false;
  }
};

// 返回上一页的函数，通过触发定义好的'goBack'事件来实现
const goBack = () => {
  emit('goBack');
};

// 切换关注状态的函数，点击按钮时切换是否关注的状态，并相应地更新用户的粉丝数量
const toggleFollow = () => {
  isFollowing.value =!isFollowing.value;
  if (isFollowing.value) {
    user.value.followers++;
  } else {
    user.value.followers--;
  }
};

// 点赞帖子的函数，点击点赞图标时，如果帖子未点赞则增加点赞数并设置已点赞状态
const likePost = (post) => {
  if (!post.hasLiked) {
    post.likes++;
    post.hasLiked = true;
  }
};

// 在组件挂载后调用获取用户数据的函数
onMounted(() => {
  fetchUserData();
});

// 当传入的用户名属性发生变化时，重新调用获取用户数据的函数
watch(() => props.username, fetchUserData);
</script>

<style scoped>
.user-profile {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  color: #ffffff;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.return-button,.follow-button {
  padding: 10px 20px;
  border: None;
  border-radius: 20px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  transition: background-color 0.3s;
}

.return-button {
  background-color: transparent;
  color: #ffffff;
}

.follow-button {
  background-color: #7c3aed;
  color: #ffffff;
}

.return-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.follow-button:hover {
  background-color: #6d28d9;
}

.icon {
  width: 20px;
  height: 20px;
  margin-right: 5px;
}

.profile-info {
  position: relative;
  margin-bottom: 30px;
}

.cover-photo {
  height: 200px;
  overflow: hidden;
  border-radius: 10px;
}

.cover-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-details {
  position: relative;
  margin-top: -60px;
  padding: 20px;
  text-align: center;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid #1a1b26;
  margin-bottom: 10px;
}

.bio {
  margin: 10px 0;
  color: #a0aec0;
}

.stats {
  display: flex;
  justify-content: center;
  gap: 20px;
  marginTop: 10px;
}

.user-posts {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.post {
  background-color: 2d3748;
  border-radius: 10px;
  overflow: hidden;
  transition: transform 0.3s;
}

.post:hover {
  transform: translateY(-5px);
}

.post-image-container {
  position: relative;
  aspect-ratio: 1 / 1;
}

.post-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justifyContent: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.post-image-container:hover.post-overlay {
  opacity: 1;
}

.post-info {
  display: flex;
  gap: 20px;
  color: #ffffff;
}

.post-details {
  padding: 15px;
}

.post-title {
  font-size: 18px;
  margin-bottom: 5px;
}

.post-content {
  font-size: 14px;
  color: a0aec0;
}

.liked {
  color: #e53e3e;
}

.loading {
  text-align: center;
  font-size: 18px;
  marginTop: 50px;
}
</style>
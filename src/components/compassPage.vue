<template>
  <div class="background" @scroll="handleScroll">
    <div class="container">
      <div
        v-for="(post, index) in userStore.posts"
        :key="index"
        class="post"
        @click="openPost(post)"
      >
        <div class="post-image-container">
          <img :src="post.image" :alt="`Post by ${post.username}`" class="post-image" />
          <div class="post-overlay">
            <div class="post-info">
              <span class="likes">
                <HeartIcon 
                  class="icon" 
                  :class="{ 'liked': post.hasLiked }" 
                  @click.stop="likePost(post)" 
                />
                {{ post.likes }}
              </span>
              <span class="comments">
                <MessageCircleIcon class="icon" />
                {{ post.comments }}
              </span>
            </div>
          </div>
        </div>
        <div class="user-info">
          <img :src="post.userAvatar" :alt="post.username" class="user-avatar" @click.stop="viewUserProfile(post.username)" />
          <span class="username">{{ post.username }}</span>
        </div>
        <div class="post-details">
          <h2 class="post-title">{{ post.title }}</h2>
          <p class="post-content">{{ post.content }}</p>
        </div>
      </div>
    </div>
    <div v-if="loading" class="loading">加载中...</div>

    <!-- 模态框显示选中的帖子 -->
    <div v-if="selectedPost" class="modal" @click="closePost">
      <div class="modal-content" @click.stop>
        <img :src="selectedPost.image" :alt="`Post by ${selectedPost.username}`" class="modal-image" />
        <div class="modal-info">
          <div class="modal-user-info">
            <img :src="selectedPost.userAvatar" :alt="selectedPost.username" class="modal-user-avatar" />
            <span class="modal-username">{{ selectedPost.username }}</span>
            <button class="follow-button" @click.stop="followUser(selectedPost.username)">关注</button>
          </div>
          <div class="action-buttons">
            <span class="like-button" @click.stop="likePost(selectedPost)">
              <HeartIcon 
                class="icon" 
                :class="{ 'liked': selectedPost.hasLiked }" 
              />
              {{ selectedPost.likes }}
            </span>
            <span class="comment-button">
              <MessageCircleIcon class="icon" />
              {{ selectedPost.comments }}
            </span>
            <span class="bookmark-button" @click.stop="bookmarkPost(selectedPost)">
              <Star :class="{ 'text-yellow-500': userStore.isBookmarked(selectedPost.id) }" class="icon" /> 
              {{ userStore.isBookmarked(selectedPost.id) ? '已收藏' : '收藏' }}
            </span>
          </div>
          <h2 class="modal-title">{{ selectedPost.title }}</h2>
          <p class="modal-text">{{ selectedPost.content }}</p>
        </div>
        <button @click="closePost" class="close-button">X</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { HeartIcon, MessageCircleIcon, Star } from 'lucide-vue-next';
import { defineEmits } from 'vue';

const emit = defineEmits(['changeView']);

const userStore = useUserStore();
const loading = ref(false);
const selectedPost = ref(null);

// 模拟加载更多帖子
const loadMorePosts = () => {
    if (userStore.loadedPosts < userStore.totalPosts) {
        loading.value = true;
        userStore.fetchPosts(20);
        loading.value = false;
    }
};

// 模拟滚动加载更多帖子
const handleScroll = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollTop + windowHeight >= documentHeight - 100) {
        loadMorePosts();
    }
};

// 模拟打开帖子
const openPost = (post) => {
    selectedPost.value = post; 
};

// 模拟关闭帖子
const closePost = () => {
    selectedPost.value = null; 
};

// 模拟关注用户
const followUser = (username) => {
    console.log(`关注用户: ${username}`);
};

// 模拟点赞帖子
const likePost = (post) => {
    if (!post.hasLiked) {
        post.likes += 1; // 点赞数量 +1
        post.hasLiked = true; // 设置为已点赞
        console.log(`点赞数量: ${post.likes}`);
    } else {
        console.log("您已经点赞过此帖子。");
    }
};

// 模拟收藏帖子
const bookmarkPost = (post) => {
  if (post && !userStore.isBookmarked(post.id)) {
    userStore.toggleBookmark(post.id);
  }
};

//查看用户资料
const viewUserProfile = (username) => {
  emit('changeView', { component: 'userProfile', username });
};

// 在组件挂载后，立即获取用户的帖子列表
onMounted(async () => {
    try {
        await userStore.fetchPosts();
    } catch (error) {
        console.error("Error fetching posts:", error);
    }
    // 监听窗口的滚动事件，在滚动时加载更多帖子
    window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.loading {
  text-align: center;
  margin: 20px 0;
  font-size: 16px;
}
.background {
  min-height: 100vh;
  padding: 20px;
  box-sizing: border-box;
}

.container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 28px;
  max-width: 1200px;
  margin: 0 auto;
}

.post {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.post-image-container {
  position: relative;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  cursor: pointer;
}

.post-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.post-image-container:hover .post-image {
  transform: scale(1.05);
}

.post-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.post-image-container:hover .post-overlay {
  opacity: 1;
}

.post-info {
  color: white;
  font-size: 16px;
  font-weight: bold;
  display: flex;
  gap: 20px;
}

.icon {
  vertical-align: middle;
  margin-right: 5px;
  transition: color 0.3s ease;
}

.liked {
  color: red;
}

.user-info {
  text-align: center;
  display: flex;
  padding: 12px;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 10px;
}

.username {
  margin-top: 6px;
  font-weight: 600;
  color: #262626;
}

.post-details {
  padding: 12px;
}

.post-title {
  font-size: 14px;
  font-weight: bold;
  color: #262626;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left; 
}

.post-content {
  text-align: left;
  font-size: 14px;
  color: #666;
  margin: 5px 0 0 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  color: #666;
  background: white;
  padding: 20px;
  border-radius: 10px;
  max-width: 600px;
  width: 90%;
  position: relative;
  text-align: left;
}

.modal-image {
  width: 100%;
  height: auto;
  border-radius: 5px;
}

.modal-info {
  margin-top: 15px;
}

.modal-title {
  font-size: 18px;
  font-weight: bold;
  color: #262626;
  margin: 10px 0 5px 0;
  text-align: left; 
}

.modal-user-info {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.modal-user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.modal-username {
  font-weight: 600;
  color: #262626;
}

.follow-button {
  margin-left: auto;
  padding: 5px 10px;
  background: linear-gradient(90deg, #2AF598 0%, #009EFD 100%);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.follow-button:hover {
  background-color: #0056b3;
}

.action-buttons {
  display: flex;
  gap: 20px;
  margin-top: 10px;
}

.like-button,
.comment-button {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.bookmark-button {
  font-size: 14px;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.modal-text {
  font-size: 14px;
  color: #666;
  text-align: left;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: #333;
  cursor: pointer;
  font-size: 24px;
}
</style>
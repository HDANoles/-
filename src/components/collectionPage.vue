<template>
  <div class="bookmarks-page">
    <h1 class="page-title">我的收藏</h1>
    <div class="bookmarks-list">
      <div v-for="bookmark in userStore.bookmarkedPosts" :key="bookmark.id" class="post" @click="openPost(bookmark)">
        <div class="post-image-container">
          <img :src="bookmark.image" :alt="bookmark.title" class="post-image">
          <div class="post-overlay">
            <div class="post-info">
              <span class="likes">
                <HeartIcon class="icon" />
                {{ bookmark.likes || 0 }}
              </span>
              <span class="comments">
                <MessageCircleIcon class="icon" />
                {{ bookmark.comments || 0 }}
              </span>
            </div>
          </div>
        </div>
        <div class="user-info">
          <img :src="bookmark.userAvatar" :alt="bookmark.username" class="user-avatar" />
          <span class="username">{{ bookmark.username }}</span>
        </div>
        <div class="post-details">
          <h2 class="post-title">{{ bookmark.title }}</h2>
          <p class="post-content">{{ bookmark.description }}</p>
          <button @click.stop="removeBookmark(bookmark.id)" class="remove-button">删除</button>
        </div>
      </div>
    </div>

    <!-- 模态框显示选中的收藏 -->
    <div v-if="selectedPost" class="modal" @click="closePost">
      <div class="modal-content" @click.stop>
        <img :src="selectedPost.image" :alt="`Post by ${selectedPost.username}`" class="modal-image" />
        <div class="modal-info">
          <div class="modal-user-info">
            <img :src="selectedPost.userAvatar" :alt="selectedPost.username" class="modal-user-avatar" />
            <span class="modal-username">{{ selectedPost.username }}</span>
          </div>
          <h2 class="modal-title">{{ selectedPost.title }}</h2>
          <p class="modal-text">{{ selectedPost.description }}</p>
          <div class="action-buttons">
            <span class="like-button" @click.stop="likePost(selectedPost)">
              <HeartIcon class="icon" />
              {{ selectedPost.likes }}
            </span>
            <span class="comment-button">
              <MessageCircleIcon class="icon" />
              {{ selectedPost.comments }}
            </span>
          </div>
        </div>
        <button @click="closePost" class="close-button">X</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { HeartIcon, MessageCircleIcon } from 'lucide-vue-next';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();
const selectedPost = ref(null);

const openPost = (post) => {
  selectedPost.value = post; 
};

const closePost = () => {
  selectedPost.value = null; 
};

const removeBookmark = (id) => {
  userStore.toggleBookmark(id);
};

const likePost = (post) => {
  if (!post.hasLiked) {
    post.likes += 1;
    post.hasLiked = true;
  }
};
</script>

<style scoped>
.bookmarks-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.page-title {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.bookmarks-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 28px;
}

.post {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
  cursor: pointer;
}

.post:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.post-image-container {
  position: relative;
  aspect-ratio: 1 / 1;
  overflow: hidden;
}

.post-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
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

.user-info {
  text-align: left;
  display: flex;
  align-items: center;
  padding: 12px;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 10px;
}

.username {
  font-weight: 600;
  color: #262626;
}

.post-details {
  padding: 12px;
}

.post-title {
  font-size: 16px;
  font-weight: bold;
  color: #262626;
  margin: 0;
}

.post-content {
  font-size: 14px;
  color: #666;
  margin: 5px 0 0 0;
}

.remove-button {
  background-color: #ff4757;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.remove-button:hover {
  background-color: #ff6b81;
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

.action-buttons {
  display: flex;
  gap: 20px;
  margin-top: 10px;
}

.like-button,
.comment-button {
  display: flex;
  align-items: center;
}

.modal-text {
  font-size: 14px;
  color: #666;
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

@media (max-width: 600px) {
  .bookmarks-list {
    grid-template-columns: 1fr;
  }
}
</style>
<template>
  <div class="profile-container">
    <!-- 背景图片 -->
    <div class="cover-photo">
      <img :src="coverPhoto" alt="Cover" />
    </div>

    <!-- 简介 -->
    <div class="profile-info">
      <div class="avatar">
        <img :src="avatar" alt="@username" />
      </div>
      <div class="user-details">
        <h1>{{ userTitle }}</h1>
        <p class="bio">{{ userBio }}</p>
        <div class="follow-info">
          <span><strong>1.2k</strong> 关注者</span>
          <span><strong>567</strong> 正在关注</span>
        </div>
      </div>
    </div>

    <!-- 标签 -->
    <div class="tabs">
      <button class="tab-btn" @click="showPosts">帖子</button>
      <button class="tab-btn" @click="showBookmarks">收藏</button>
      <button class="tab-btn" @click="showSettings">设置</button>
    </div>

    <!-- 内容区域 -->
    <div v-if="currentView === 'posts'">
      <div class="photo-grid">
        <div v-for="post in customPosts" :key="post.id" class="post" @click="openPost(post)">
          <div class="post-image-container">
            <img v-if="post.images && post.images.length > 0" :src="post.images[0]" :alt="post.title" class="post-image" />
            <div class="post-overlay">
              <div class="post-info">
                <span class="likes">
                  <HeartIcon class="icon" :class="{ 'liked': post.hasLiked }" @click.stop="likePost(post)" />
                  {{ post.likes || 0 }}
                </span>
                <span class="comments">
                  <MessageCircleIcon class="icon" />
                  {{ post.comments || 0 }}
                </span>
              </div>
            </div>
          </div>
          <div class="post-details">
            <h2 class="post-title">{{ post.title }}</h2>
            <p class="post-content">{{ post.content }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="currentView === 'bookmarks'">
      <div class="photo-grid">
        <div v-for="bookmark in bookmarks" :key="bookmark.id" class="post" @click="openBookmark(bookmark)">
          <div class="post-image-container">
            <img :src="bookmark.image" :alt="bookmark.title" class="post-image" />
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
          <div class="post-details">
            <h2 class="post-title">{{ bookmark.title }}</h2>
            <p class="post-content">{{ bookmark.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="currentView === 'settings'">
      <div class="settings-form">
        <div class="form-group">
          <label for="cover-photo">更改背景图片</label>
          <input type="file" id="cover-photo" @change="updateCoverPhoto" accept="image/*" />
        </div>
        <div class="form-group">
          <label for="avatar">更改头像</label>
          <input type="file" id="avatar" @change="updateAvatar" accept="image/*" />
        </div>
        <div class="form-group">
          <label for="user-title">更改昵称</label>
          <input type="text" id="user-title" v-model="userTitle" />
        </div>
        <div class="form-group">
          <label for="user-bio">更改简介</label>
          <textarea id="user-bio" v-model="userBio" rows="3"></textarea>
        </div>
      </div>
    </div>

    <!-- 添加模态框 -->
    <div v-if="selectedPost" class="modal" @click="closePost">
      <div class="modal-content" @click.stop>
        <div class="modal-image-container">
          <img :src="selectedPost.images ? selectedPost.images[0] : selectedPost.image" :alt="selectedPost.title" class="modal-image" />
        </div>
        <div class="modal-info">
          <div class="action-buttons">
          </div>
          <h2 class="modal-title">{{ selectedPost.title }}</h2>
          <p class="modal-text">{{ selectedPost.content || selectedPost.description }}</p>
          <button v-if="currentView === 'bookmarks'" @click="removeBookmark(selectedPost.id)" class="remove-button">删除收藏</button>
        </div>
        <button @click="closePost" class="close-button">X</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { usePostStore } from '../stores/addpost-person.js';
import { HeartIcon, MessageCircleIcon } from 'lucide-vue-next';

const postStore = usePostStore();

// 使用 computed 属性来获取最新的帖子
const customPosts = computed(() => postStore.posts);

// 收藏数据
const bookmarks = ref([
  { id: 1, title: '美丽的风景', description: '这是一张令人惊叹的自然风光照片', image: 'https://picsum.photos/600/600?1', likes: 120, comments: 15 },
  // 其他收藏...
]);

const currentView = ref('posts');
const selectedPost = ref(null);
const coverPhoto = ref('http://hbimg.huaban.com/41397c971e2dbfec5bc623bb0f634c4fa428051f202c31-OYCrEm');
const avatar = ref('http://hbimg.huaban.com/41397c971e2dbfec5bc623bb0f634c4fa428051f202c31-OYCrEm');

// 新增用户标题和简介
const userTitle = ref('HDAN oles');
const userBio = ref('数字艺术家|旅行爱好者');

const showPosts = () => {
  currentView.value = 'posts';
};

const showBookmarks = () => {
  currentView.value = 'bookmarks';
};

const showSettings = () => {
  currentView.value = 'settings';
};
// 删除收藏
const removeBookmark = (id) => {
  bookmarks.value = bookmarks.value.filter(bookmark => bookmark.id !== id);
  closePost();
};

const openPost = (post) => {
  selectedPost.value = post;
};

const openBookmark = (bookmark) => {
  selectedPost.value = bookmark;
};

const closePost = () => {
  selectedPost.value = null;
};
// 处理点赞操作
const likePost = (post) => {
  if (!post.hasLiked) {
    post.likes = (post.likes || 0) + 1;
    post.hasLiked = true;
  }
};

// 处理更新头像和背景图片操作
const updateCoverPhoto = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      coverPhoto.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

// 处理更新头像操作
const updateAvatar = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      avatar.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};
</script>

<style scoped>
.profile-container {
  max-width: auto;
  margin: 0 auto;
  font-family: Arial, sans-serif;
}

.cover-photo {
  height: 12rem;
  overflow: hidden;
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
}

.cover-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-info {
  position: relative;
  padding: 0rem 2rem 0rem 2rem;
}

.avatar {
  width: 8rem;
  height: 8rem;
  border: 4px solid white;
  border-radius: 50%;
  overflow: hidden;
  position: absolute;
  margin-top: -33px;  
  left: 1rem;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-details {
  text-align: left;
  margin-left: 10rem;
  margin-top: -8rem;
  margin-bottom: 2rem;
}

.user-details h1 {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.bio {
  color: #666;
  margin-bottom: 0.5rem;
}

.follow-info {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
}

.tabs {
  margin-top: 20px;
  display: flex;
  justify-content: space-around;
  border-top: 1px solid #e5e5e5;
  border-bottom: 1px solid #e5e5e5;
  padding: 0.5rem 0;
  margin-bottom: 1rem;
}

.tab-btn {
  color: white;
  background: none;
  border: none;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.post {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
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
}

.post-content {
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
  background: white;
  border-radius: 10px;
  max-width: 90%;
  max-height: 90vh;
  width: 600px;
  height: auto;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.modal-image-container {
  width: 100%;
  height: 0;
  padding-bottom: 100%;
  position: relative;
  overflow: hidden;
}

.modal-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-info {
  padding: 20px;
  overflow-y: auto;
  flex-grow: 1;
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

.like-button span {
  color: #333;
  margin-left: 5px;
}

.modal-title {
  font-size: 18px;
  font-weight: bold;
  color: #262626;
  margin: 10px 0 5px 0;
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
  z-index: 1;
}

.page-title {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.remove-button {
  background-color: #ff4757;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 10px;
}

.remove-button:hover {
  background-color: #ff6b81;
}

.settings-form {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.cover-photo input{
  background-color: white;
}

.form-group label,.cover-photo label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input[type="file"],
.form-group input[type="text"],
.form-group textarea {
  display: block;
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  transition: border-color 0.3s;
}

.form-group input[type="text"]:focus,
.form-group textarea:focus {
  border-color: #007bff;
  outline: none;
}

.form-group textarea {
  resize: none;
}

@media (max-width: 600px) {
  .photo-grid {
    grid-template-columns: 1fr;
  }
}
</style>
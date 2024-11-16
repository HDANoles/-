<template>
  <div class="container">
    <!-- 页面标题，显示为“好友动态” -->
    <h1>好友动态</h1>
    <div class="post-list">
      <!-- 使用v-for指令循环遍历posts数组中的每个帖子，为每个帖子生成对应的展示组件，并根据帖子的id作为唯一标识 -->
      <div v-for="post in posts" :key="post.id" class="post">
        <div class="post-header">
          <!-- 显示帖子作者的头像图片，绑定了作者对象中的头像路径作为src属性，并设置了替代文本 -->
          <img :src="post.author.avatar" :alt="post.author.name" class="avatar" />
          <div class="post-info">
            <!-- 显示帖子作者的名字 -->
            <h2 class="author-name">{{ post.author.name }}</h2>
            <!-- 显示帖子的创建时间 -->
            <p class="timestamp">{{ post.createdAt }}</p>
          </div>
        </div>
        <!-- 显示帖子的内容文本 -->
        <p class="post-content">{{ post.content }}</p>
        <!-- 如果帖子有图片，则显示该图片，绑定了帖子对象中的图片路径作为src属性，并设置了替代文本 -->
        <img v-if="post.image" :src="post.image" :alt="post.content" class="post-image" />
        <div class="post-actions">
          <!-- 点赞按钮，点击可切换点赞状态，根据是否已点赞设置不同样式 -->
          <button @click="toggleLike(post)" class="action-button" :class="{ 'liked': post.liked }">
            <!-- 点赞图标组件 -->
            <HeartIcon class="icon" />
            {{ post.likes }}
          </button>
          <!-- 评论按钮，点击可切换显示或隐藏评论区 -->
          <button @click="toggleComments(post)" class="action-button">
            <!-- 评论图标组件 -->
            <MessageCircle class="icon" />
            {{ post.comments.length }}
          </button>
        </div>
        <!-- 如果帖子的showComments属性为true，则显示评论区 -->
        <div v-if="post.showComments" class="comments-section">
          <!-- 使用v-for指令循环遍历帖子的评论数组中的每个评论，为每个评论生成对应的展示组件，并根据评论的id作为唯一标识 -->
          <div v-for="comment in post.comments" :key="comment.id" class="comment">
            <!-- 显示评论作者和评论内容，用冒号分隔 -->
            <strong>{{ comment.author }}:</strong> {{ comment.content }}
          </div>
          <!-- 输入框，用于用户输入新评论，绑定了帖子对象中的newComment属性，按下回车键可触发添加评论操作 -->
          <input
            v-model="post.newComment"
            @keyup.enter="addComment(post)"
            type="text"
            placeholder="评论一下吧..."
            class="comment-input"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { MessageCircle, HeartIcon } from 'lucide-vue-next';

// 使用ref创建一个响应式数据，用于模拟存储一系列的帖子数据，这里包含了多个帖子对象，每个帖子对象包含了作者信息、内容、图片、点赞数、评论等相关属性
const posts = ref([
  {
    id: 1,
    author: {
      name: '小🐟恋佳',
      avatar: './/public/imgs/avter/avter1.jpg'
    },
    content: '用户帖子标题 🏖️',
    image: 'https://picsum.photos/600/600?0',
    createdAt: '2h ago',
    likes: 24,
    liked: false,
    comments: [
      { id: 1, author: '狸花', content: '评论1' },
      { id: 2, author: 'Bryan', content: '评论2' }
    ],
    showComments: false,
    newComment: ''
  },
  {
    id: 1,
    author: {
      name: '小🐟恋佳',
      avatar: './/public/imgs/avter/avter1.jpg'
    },
    content: '用户帖子标题 🏖️',
    image: 'https://picsum.photos/600/600?1',
    createdAt: '2h ago',
    likes: 24,
    liked: false,
    comments: [
      { id: 1, author: '狸花', content: '评论1' },
      { id: 2, author: 'Bryan', content: '评论2' }
    ],
    showComments: false,
    newComment: ''
  },
  {
    id: 1,
    author: {
      name: '小🐟恋佳',
      avatar: './/public/imgs/avter/avter1.jpg'
    },
    content: '用户帖子标题 🏖️',
    image: 'https://picsum.photos/600/600?2',
    createdAt: '2h ago',
    likes: 24,
    liked: false,
    comments: [
      { id: 1, author: '狸花', content: '评论1' },
      { id: 2, author: 'Bryan', content: '评论2' }
    ],
    showComments: false,
    newComment: ''
  },
  {
    id: 1,
    author: {
      name: '小🐟恋佳',
      avatar: './/public/imgs/avter/avter1.jpg'
    },
    content: '用户帖子标题 🏖️',
    image: 'https://picsum.photos/600/600?3',
    createdAt: '2h ago',
    likes: 24,
    liked: false,
    comments: [
      { id: 1, author: '狸花', content: '评论1' },
      { id: 2, author: 'Bryan', content: '评论2' }
    ],
    showComments: false,
    newComment: ''
  },
  // 其他帖子数据对象的结构类似，这里省略部分重复注释

]);

// 处理点赞操作的函数，点击点赞按钮时切换帖子的点赞状态，并根据点赞或取消点赞相应地增加或减少点赞数
const toggleLike = (post) => {
  post.liked =!post.liked;
  post.likes += post.liked? 1 : -1;
};

// 处理切换评论显示状态的函数，点击评论按钮时切换帖子的showComments属性，以显示或隐藏评论区
const toggleComments = (post) => {
  post.showComments =!post.showComments;
};

// 处理添加评论的函数，当用户在输入框中输入评论并按下回车键时，如果输入内容不为空字符串，则将新评论添加到帖子的评论数组中，并清空输入框
const addComment = (post) => {
  if (post.newComment.trim()) {
    post.comments.push({
      id: post.comments.length + 1,
      author: 'Me',
      content: post.newComment.trim()
    });
    post.newComment = '';
  }
};
</script>

<style scoped>
.container {

  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

h1 {

  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #ffffff;
}

.post-list {

  display: flex;
  flex-direction: column;
  gap: 20px;
}

.post {

  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.post-header {

  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.avatar {

  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 15px;
}

.post-info h2 {

  font-size: 16px;
  font-weight: bold;
  margin: 0;
  color: black;
}

.timestamp {

  font-size: 14px;
  color: #a9adc1;
  margin: 0;
}

.post-content {

  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 15px;
  color: black;
}

.post-image {

  width: 100%;
  border-radius: 8px;
  margin-bottom: 15px;
}

.post-actions {

  display: flex;
  gap: 15px;
}

.action-button {

  display: flex;
  align-items: center;
  background: none;
  border: none;
  color: #a9adc1;
  cursor: pointer;
  font-size: 14px;
  transition: color 0.3s;
}

.action-button:hover {

  color: red;
}

.action-button.liked {

  color: red;
}

.icon {

  width: 20px;
  height: 20px;
  margin-right: 5px;
}

.comments-section {
 
  margin-top: 15px;
  padding: 10px;
  /* background-color: #13141f; */
  border-radius: 8px;
}

.comment {
  margin-bottom: 10px;
  font-size: 14px;
  color: black;
}

.comment-input {
  width: 97%;
  padding: 8px;
  border: 1px solid #a9adc1;
  border-radius: 4px;
  /* background-color: #13141f; */
  color: black;
}
</style>
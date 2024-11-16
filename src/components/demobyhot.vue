<template>
    <div class="content-cards">
      <div v-for="card in contentCards" :key="card.id" class="card">
        <div class="card-header">
          <a href="">
            <img :src="card.avatar" :alt="`${card.author}'s avatar`" class="avatar" />
          </a>
          <div>
            <div class="author">{{ card.author }}</div>
            <div class="time">{{ card.time }}</div>
          </div>
        </div>
  
        <p>{{ card.content }}</p>
  
        <div class="card-images">
          <div class="image-container" v-for="(image, index) in displayedImages(card.images)" :key="index">
            <img
              v-if="image !== '...'"
              :src="image"
              :alt="card.content"
              class="card-image"
            />
            <span v-else class="ellipsis">{{ image }}</span>
          </div>
        </div>
        <div class="card-content">
          
          <div class="card-actions">
            <button
              class="action-button"
              :class="{ 'liked': card.liked }"
              @click="toggleLike(card)"
            >
              <Heart :class="{ 'fill-heart': card.liked }" />
              <span>{{ card.likes }}</span>
            </button>
            <button class="action-button" @click="toggleComments(card)">
              <MessageCircle />
              <span>{{ card.comments }}</span>
            </button>
            <button class="action-button">
              <Share2 />
              <span>{{ card.shares }}</span>
            </button>
          </div>
          
          <!-- 评论区域 -->
          <div v-if="card.showComments" class="comment-section">
            <input
              v-model="card.userComment"
              type="text"
              placeholder="写下你的评论..."
              class="comment-input"
            />
            <button @click="addComment(card)" class="comment-button">评论</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { Heart, MessageCircle, Share2 } from 'lucide-vue-next'
  
  const contentCards = ref([
    {
      id: 1,
      author: "猫咪爱好者",
      avatar: ".//public/imgs/avter/avter1.jpg",
      content: "看看这个可爱的小家伙和他的Chill Goods！😻🐱",
      images: [".//public/imgs/topicpageimg/cat3.jpg", ".//public/imgs/topicpageimg/car2.jpg", ".//public/imgs/topicpageimg/cat6.jpg", ".//public/imgs/topicpageimg/cat4.jpg", ".//public/imgs/topicpageimg/cart5.jpg",".//public/imgs/topicpageimg/cart5.jpg",".//public/imgs/topicpageimg/cart5.jpg",".//public/imgs/topicpageimg/cart5.jpg",".//public/imgs/topicpageimg/cart5.jpg"],
      likes: 1234,
      comments: 56,
      shares: 7,
      time: "10分钟前",
      liked: false,
      showComments: false, // 新增状态来控制评论区显示
      userComment: '' // 用于存储用户输入的评论
    },
    {
      id: 3,
      author: "小鸟观察者",
      avatar: "http://inews.gtimg.com/newsapp_bt/0/13349963837/1000",
      content: "今天在公园看到了一只美丽的鹦鹉！🦜🌳",
      images: [
        "http://hbimg.huaban.com/d5990a4a281493912b46b65ec05bcef538b8f3e13d9f27-1of2ZU",
        "http://hbimg.huaban.com/d261932d8265ae3727d652d8c9abbab07cadfb071d1004-plEqpA"
      ],
      likes: 567,
      comments: 22,
      shares: 5,
      time: "1小时前",
      liked: false,
      showComments: false,
      userComment: ''
    },
    {
      id: 4,
      author: "旅行者",
      avatar: "http://hbimg.huaban.com/4d9fa55f71fdd5324613c94cee4f86ebea90a316bed4-QwmHe1",
      content: "这次旅行的风景真是令人难忘！🏞️✈️",
      images: [
        "http://hbimg.huaban.com/8bfe08162f50181c287ef3e2c9d16807e24b5bef2e7905-BV3Ogq",
        "http://hbimg.huaban.com/e443d425d9e41d8d6e45702c93cb832f55a1543b518d9-ZSBqV8",
        "http://hbimg.huaban.com/271724504b1a87737c0bf95aaa99aa7988fc1ecb13c777-71iOmC"
      ],
      likes: 2345,
      comments: 78,
      shares: 20,
      time: "",
      liked: false,
      showComments: false,
      userComment: ''
    },
    {
      id: 5,
      author: "美食爱好者",
      avatar: "https://hbimg.huaban.com/c9e65ef6377f2910cdcd1400b51bfb17f4aa819b13fc1-J8ECWR",
      content: "刚刚做的披萨，真是太好吃了！🍕😍",
      images: [
        "http://hbimg.huaban.com/dfb8b1ee8433cca31519a6390993e14b06c4344a22c170-KCaDll",
        "http://dingyue.nosdn.127.net/JFtcKo31eW4D5=0nXuni31dKDnc2sZcn1QK6ILJ7w20BN1543633119239compressflag.jpg"
      ],
      likes: 456,
      comments: 30,
      shares: 11,
      time: "3小时前",
      liked: false,
      showComments: false,
      userComment: ''
    }
    // 其他卡片...
  ]);
  
  const toggleLike = (card) => {
    card.liked = !card.liked
    card.likes += card.liked ? 1 : -1
  }
  
  const toggleComments = (card) => {
    card.showComments = !card.showComments // 切换评论区显示
  }
  
  const addComment = (card) => {
    if (!card.userComment.trim()) {
      card.userComment = "请输入内容..." // 提示用户输入内容
      return; // 退出函数
    }
      card.comments += 1; // 增加评论数
      card.userComment = ''; // 清空输入框
      card.showComments = false; // 提交后隐藏评论区域
    }
  
  const displayedImages = (images) => {
    if (images.length > 9) {
      return [...images.slice(0, 8), '...'];
    }
    return images;
  }
  </script>
  
  <style scoped>
  .content-cards {
    display: grid;
    flex-direction: column;
    width: 100%;
    gap: 15px;
  }
  
  .card {
    height: auto;
    background-color: #1e1e2e;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .card-header {
    display: flex;
    padding-top: 20px;
    padding-left: 15px;
    width: 100%;
  }
  
  .author {
    margin: 0;
    font-size: 25px;
    color: #ffffff;
  }
  
  .time {
    margin-left: -60px;
    margin-top: 5px;
    font-size: 14px; 
    color: #a9adc1;
    
  }
  
  .avatar {
    margin-left: 9px;
    width: 70px;
    height: 70px;
    border-radius: 25%;
    margin-right: 12px;
  }
  
  .card p {
    font-size: 20px;
    padding: 28px 25px 23px;
    color: #a9adc1;
    margin: 0; 
    word-wrap: break-word; 
    overflow-wrap: break-word; 
    text-align: left; 
  }
  
  
  .card-images {
    border-radius: 15px;
    margin-left: 25px;
    width: calc(100% - 50px); 
    display: flex;
    flex-wrap: nowrap; /* 不换行，保持在一行 */
    overflow-x: auto; 
    overflow-y: hidden;
    gap: 10px; 
    scrollbar-width: none;
  }
  
  .image-container {
    flex: 0 0 200px; 
    height: 200px; 
    position: relative; 
  }
  
  .card-image {
    width: 100%; 
    height: 100%; 
    object-fit: cover; 
    border-radius: 10px; 
  }
  
  .ellipsis {
    width: 100%;
    text-align: center;
    color: #a9adc1;
    font-size: 20px;
  }
  
  .card-content {
    padding: 16px;
  }
  
  .card-content p {
    color: #a9adc1;
    margin-bottom: 16px;
  }
  
  .card-actions {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
  }
  
  .action-button {
    display: flex;
    align-items: center;
    background: none;
    border: none;
    color: #a9adc1;
    cursor: pointer;
    transition: color 0.3s ease;
  }
  
  .action-button:hover {
    color: #ffffff;
  }
  
  .action-button svg {
    width: 20px;
    height: 20px;
    margin-right: 4px;
  }
  
  .action-button.liked {
    color: #ff4081;
  }
  
  .fill-heart {
    fill: #ff4081;
  }
  
  /* 评论 */
  .comment-section {
    margin-top: 10px;
    padding: 7px 0px;
    background-color: #2e2e3e;
    border-radius: 8px;
  }
  
  .comment-input {
    width: calc(100% - 90px); 
    padding: 8px;
    border: none;
    border-radius: 5px;
    background-color: #1e1e2e;
    color: #ffffff;
  }
  
  .comment-button {
    padding: 8px 15px;
    margin-left: 5px;
    border: none;
    border-radius: 5px;
    background: var(--gradient-2, linear-gradient(90deg, #2AF598 0%, #009EFD 100%));
    color: #ffffff;
    cursor: pointer;
    transition: background 0.3s ease;
  }
  
  .comment-button:hover {
    background: var(--gradient-2, linear-gradient(90deg, #2AF598 0%, #009EFD 100%));
  }
  </style>
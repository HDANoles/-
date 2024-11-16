<template>
  <div class="tiktok-container">
    <!-- 用于包裹视频列表的容器，设置了样式如圆角、占满整个视口宽度和高度、黑色背景以及隐藏溢出内容 -->
    <div class="video-container" @scroll="handleScroll" ref="videoContainer">
      <!-- 循环遍历视频列表中的每个视频，根据视频数据生成对应的视频展示项 -->
      <div v-for="(video, index) in videoStore.videos" :key="video.id" class="video-item" :class="{ 'active': currentVideoIndex === index }">
        <!-- 视频元素，设置了视频源、循环播放属性，并且绑定了点击事件用于切换播放状态 -->
        <video :src="video.url" loop @click="togglePlay(index)" ref="videoRefs"></video>
        <div class="video-info">
          <!-- 显示视频发布者的用户名 -->
          <h3>@{{ video.username }}</h3>
          <!-- 显示视频的描述信息 -->
          <p>{{ video.description }}</p>
        </div>
        <div class="video-actions">
          <!-- 点赞按钮，绑定了点击事件用于处理点赞操作，根据视频是否已点赞设置不同样式 -->
          <button @click="likeVideo(index)" :class="{ 'liked': video.liked }">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            {{ video.likes }}
          </button>
          <!-- 查看评论按钮，绑定了点击事件用于显示对应视频的评论，目前只是在控制台打印信息 -->
          <button @click="showComments(index)">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            {{ video.comments.length }}
          </button>
          <!-- 分享按钮，绑定了点击事件用于处理分享操作，目前只是在控制台打印信息 -->
          <button @click="shareVideo(index)">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
            Share
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useVideoStore } from '@/stores/videoStore';

// 获取视频数据存储实例
const videoStore = useVideoStore();
// 当前播放视频的索引，用于标记当前正在播放的视频在列表中的位置
const currentVideoIndex = ref(0);
// 用于存储所有视频元素的引用，方便后续对视频进行操作
const videoRefs = ref([]);
// 用于存储视频容器元素的引用，方便获取容器的相关属性如高度等
const videoContainer = ref(null);

// 切换视频播放状态的函数，根据视频当前的暂停/播放状态来执行播放或暂停操作
const togglePlay = (index) => {
  const video = videoRefs.value[index];
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
};

// 处理点赞视频的函数，根据视频是否已点赞来增加或减少点赞数，并更新点赞状态
const likeVideo = (index) => {
  const video = videoStore.videos[index];
  if (video.liked) {
    video.likes--;
  } else {
    video.likes++;
  }
  video.liked =!video.liked;
};

// 显示对应视频评论的函数，目前只是在控制台打印出要显示评论的视频编号信息
const showComments = (index) => {
  console.log(`Show comments for video ${index + 1}`);
};

// 分享对应视频的函数，目前只是在控制台打印出要分享的视频编号信息
const shareVideo = (index) => {
  console.log(`Show comments for video ${index + 1}`);
};

// 处理视频容器滚动事件的函数，根据滚动位置计算出当前应该播放的视频索引，并更新播放状态
const handleScroll = () => {
  if (videoContainer.value) {
    const containerHeight = videoContainer.value.clientHeight;
    const scrollTop = videoContainer.value.scrollTop;
    const newIndex = Math.round(scrollTop / containerHeight);
    if (newIndex!== currentVideoIndex.value) {
      currentVideoIndex.value = newIndex;
      playCurrentVideo();
    }
  }
};

// 根据当前播放视频索引来播放当前视频，并暂停其他视频的函数
const playCurrentVideo = () => {
  videoRefs.value.forEach((video, index) => {
    if (index === currentVideoIndex.value) {
      video.play();
    } else {
      video.pause();
    }
  });
};

// 在组件挂载后执行的钩子函数，先等待下一个DOM更新周期，然后生成随机视频数据并播放当前视频
onMounted(() => {
  nextTick(() => {
    videoStore.generateRandomVideos();
    playCurrentVideo();
  });
});
</script>

<style scoped>
.tiktok-container {
  border-radius: 25px;
  width: 100%;
  height: 100vh;
  background-color: #000;
  overflow: hidden;
}

.video-container {
  border-radius: 25px;
  height: 100%;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  scrollbar-width: none;
}

.video-item {
  position: relative;
  height: 100vh;
  scroll-snap-align: start;
  scroll-snap-stop: always;
}

video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-info {
  position: absolute;
  bottom: 80px;
  left: 10px;
  color: #fff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.video-info h3 {
  font-size: 1.2rem;
  margin-bottom: 5px;
}

.video-info p {
  font-size: 0.9rem;
}

.video-actions {
  position: absolute;
  right: 10px;
  bottom: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.video-actions button {
  background: none;
  border: none;
  color: #fff;
  font-size: 0.8rem;
  margin-bottom: 20px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.video-actions button svg {
  width: 30px;
  height: 30px;
  margin-bottom: 5px;
}

.video-actions button.liked svg {
  fill: #ff2d55;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.video-actions button:active svg {
  animation: pulse 0.3s ease-in-out;
}
</style>
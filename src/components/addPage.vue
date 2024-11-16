<template>
  <div class="create-post">
    <!-- 页面标题，提示用户要进行发布新状态的操作 -->
    <h1>发布你的新状态！</h1>
    <form @submit.prevent="submitPost">
      <!-- 标题输入框所在的表单组 -->
      <div class="form-group">
        <!-- 标题输入框的标签 -->
        <label for="post-title">添加标题</label>
        <input
          type="text"
          id="post-title"
          v-model="postTitle"
          placeholder="输入标题..."
          class="form-control title-input"
        />
      </div>
      <!-- 内容输入框所在的表单组 -->
      <div class="form-group">
        <!-- 内容输入框的标签 -->
        <label for="post-content">内容</label>
        <textarea
          id="post-content"
          v-model="postContent"
          rows="4"
          placeholder="分享你的想法..."
          class="form-control"
        ></textarea>
      </div>
      <!-- 图片上传相关的表单组 -->
      <div class="form-group">
        <label>
          <!-- 上传按钮，包含一个文件图标（这里假设是自定义的FileIcon组件）和文字提示 -->
          <div class="upload-button">
            <FileIcon />
            添加图片 
          </div>
          <!-- 真正用于接收文件上传的input元素，设置了接受的文件类型为图片，可多选 -->
          <input
            type="file"
            @change="handleImageUpload"
            accept="image/*"
            multiple
            class="file-input"
          />
        </label>
        <!-- 用于预览已上传图片的容器 -->
        <div class="image-previews">
          <!-- 循环遍历已上传并生成预览的图片数组，展示每张图片的预览 -->
          <div v-for="(image, index) in imagePreviews" :key="index" class="image-preview">
            <img :src="image" alt="Preview" />
          </div>
        </div>
      </div>
      <!-- 提交按钮，用于发布帖子 -->
      <button type="submit" class="submit-button">发布</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { FileIcon } from 'lucide-vue-next';
import { usePostStore } from '../stores/addpost-person.js';

// 导入并实例化帖子数据存储相关的store，用于后续操作帖子数据（如添加帖子等）
const postStore = usePostStore();

// 使用ref创建响应式数据，用于存储用户输入的帖子标题，初始值为空字符串
const postTitle = ref('');
// 使用ref创建响应式数据，用于存储用户输入的帖子内容，初始值为空字符串
const postContent = ref('');
// 使用ref创建响应式数据，用于存储已上传图片的预览链接数组，初始值为空数组
const imagePreviews = ref([]);

// 处理图片上传的函数
const handleImageUpload = (event) => {
  // 获取用户选择的所有文件（图片），将其转换为数组形式方便后续处理
  const files = Array.from(event.target.files);

  // 判断上传的图片数量加上已有的图片预览数量是否不超过9张，如果是则进行上传处理，否则弹出提示框告知用户最多只能上传9张图片
  if (files.length + imagePreviews.value.length <= 9) {
    // 遍历用户选择的每张图片
    files.forEach(file => {
      // 创建一个FileReader对象，用于读取文件内容并转换为可在浏览器中展示的数据URL格式
      const reader = new FileReader();

      // 当文件读取完成后触发的回调函数，将读取到的结果（数据URL形式的图片）添加到imagePreviews数组中，以便展示图片预览
      reader.onload = (e) => {
        imagePreviews.value.push(e.target.result);
      };

      // 开始读取文件内容，以数据URL格式读取
      reader.readAsDataURL(file);
    });
  } else {
    alert('最多只能上传 9 张图片');
  }
};

// 提交帖子的函数
const submitPost = () => {
  // 创建一个新的帖子对象，包含帖子的唯一标识（这里使用当前时间戳作为id）、标题、内容以及已上传图片的预览链接数组
  const newPost = {
    id: Date.now(),
    title: postTitle.value,
    content: postContent.value,
    images: imagePreviews.value
  };

  // 使用postStore的addPost方法将新创建的帖子添加到存储中
  postStore.addPost(newPost);

  // 清空输入框和图片预览相关的数据，以便用户下次发布新帖子
  postTitle.value = '';
  postContent.value = '';
  imagePreviews.value = [];

  // 弹出提示框告知用户帖子发布成功
  alert('帖子发布成功!');
};
</script>

<style scoped>
body {
  height: 200vh;
}

.title-input,
.form-control {
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 10px;
}

.create-post {
  height: auto;
  margin: 0 auto;
  padding: 20px;
  background-color: #2e2e3e;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1 {
  color: white;
  margin-bottom: 20px;
}

.form-group {
  width: 98%;
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  color: white;
}

.file-input {
  display: none;
}

.upload-button {
  display: flex;
  align-items: center;
  background-color: #009EFD;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 5px;
  width: 8%;
}

.upload-button:hover {
  background: linear-gradient(90deg, #2AF598 0%, #009EFD 100%);
}

.image-previews {
  display: flex;
  flex-wrap: wrap;
}

.image-preview {
  margin-top: 10px;
  margin-right: 10px;
}

.image-preview img {
  max-width: 100px;
  max-height: 100px;
  border-radius: 4px;
}

.submit-button {
  background-color: #009EFD;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.submit-button:hover {
  background: linear-gradient(90deg, #2AF598 0%, #009EFD 100%);
}
</style>
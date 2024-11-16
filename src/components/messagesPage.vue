<template>
  <div class="messages-container">
    <div class="conversation-list">
      <div class="search-bar">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索好友..."
          @input="searchConversations"
        >
      </div>
      <div class="conversations">
        <div
          v-for="contact in filteredContacts"
          :key="contact.id"
          @click="selectConversation(contact)"
          class="conversation-item"
          :class="{ 'active': selectedConversation?.id === contact.id }"
        >
          <img :src="contact.avatar" :alt="contact.name" class="avatar">
          <div class="conversation-info">
            <h4>{{ contact.name }}</h4>
            <p>{{ contact.lastMessage || 'Start a conversation' }}</p>
          </div>
          <span class="status" :class="{ 'online': contact.online }"></span>
        </div>
      </div>
    </div>
    <div class="message-area">
      <div v-if="selectedConversation" class="message-header">
        <img :src="selectedConversation.avatar" :alt="selectedConversation.name" class="avatar">
        <h2>{{ selectedConversation.name }}</h2>
      </div>
      <div v-if="selectedConversation" class="messages">
        <div
          v-for="message in selectedConversation.messages"
          :key="message.id"
          class="message"
          :class="{ 'sent': message.sender === 'me' }"
        >
          <div class="message-content">
            {{ message.content }}
          </div>
          <span class="message-time">{{ message.time }}</span>
        </div>
      </div>
      <div v-else class="no-conversation">
        选择对话以开始发送消息
      </div>
      <div v-if="selectedConversation" class="message-input">
        <textarea
          v-model="newMessage"
          placeholder="请输入内容...."
          @keyup.enter.prevent="sendMessage"
        ></textarea>
        <button @click="sendMessage" class="send-button">Send</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';


//users集合规则
const contacts = ref([
  {
    id: 1,
    name: '小🐟恋佳',
    online: true,
    avatar: '/imgs/avter/avter1.jpg',
    lastMessage: '嘿，你好吗？',
    messages: [
      { id: 1, content: '嘿，你好吗？', sender: 'other', time: '10:00 AM' },
      { id: 2, content: '我很好，谢谢！你呢？', sender: 'me', time: '10:05 AM' },
    ]
  },
  {
    id: 2,
    name: '狸花',
    online: true,
    avatar: '/imgs/avter/avter3.jpg',
    lastMessage: '你看了最新的那部电影吗？',
    messages: [
      { id: 1, content: '你看了最新的那部电影吗？', sender: 'other', time: '2:00 PM' },
      { id: 2, content: '还没有，好吗？', sender: 'me', time: '2:05 PM' },
    ]
  },
  {
    id: 3,
    name: 'Bryan',
    online: true,
    avatar: '/imgs/avter/avter4.jpg',
    lastMessage: '下午3点开会，别忘了！',
    messages: [
      { id: 1, content: '下午3点开会，别忘了！', sender: 'other', time: '1:30 PM' },
      { id: 2, content: '谢谢提醒！', sender: 'me', time: '1:35 PM' },
    ]
  },
  {
    id: 4,
    name: '风止何安',
    online: false,
    avatar: '/imgs/avter/avter5.png',
    lastMessage: '看看我找到的这首新歌',
    messages: [
      { id: 1, content: '看看我找到的这首新歌', sender: 'other', time: '11:20 AM' },
      { id: 2, content: '当然，把链接发给我', sender: 'me', time: '11:25 AM' },
    ]
  },
  {
    id: 5,
    name: '半糖主义',
    online: false,
    avatar: '/imgs/avter/12.png',
    lastMessage: '我们明天还一起吃午饭吗？',
    messages: [
      { id: 1, content: '我们明天还一起吃午饭吗？', sender: 'other', time: '9:00 PM' },
      { id: 2, content: '是的，非常期待！', sender: 'me', time: '9:05 PM' },
    ]
  },
]);

// 定义状态变量和函数
const selectedConversation = ref(null);
const newMessage = ref('');
const searchQuery = ref('');
// 计算属性，用于搜索联系人
const filteredContacts = computed(() => {
  if (!searchQuery.value) return contacts.value;
  return contacts.value.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    (contact.lastMessage && contact.lastMessage.toLowerCase().includes(searchQuery.value.toLowerCase()))
  );
});
// 选择对话
const selectConversation = (contact) => {
  selectedConversation.value = contact;
};
// 发送消息函数处理
const sendMessage = () => {
  if (newMessage.value.trim() && selectedConversation.value) {
    const now = new Date();
    const time = now.getHours().toString().padStart(2, '0') + ':' + 
                 now.getMinutes().toString().padStart(2, '0');
    selectedConversation.value.messages.push({
      id: selectedConversation.value.messages.length + 1,
      content: newMessage.value,
      sender: 'me',
      time: time
    });
    selectedConversation.value.lastMessage = newMessage.value;
    newMessage.value = '';
  }
};

const searchConversations = () => {
  //过滤由计算属性'filteredContacts'处理
};
</script>

<style scoped>
.messages-container {
  display: flex;
  height: 95vh;
  background-color: #1a1b26;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.conversation-list {
  width: 30%;
  min-width: 250px;
  border-right: 1px solid #2a2b36;
  display: flex;
  flex-direction: column;
}

.search-bar {
  padding: 10px;
  border-bottom: 1px solid #2a2b36;
}

.search-bar input {
  width: 100%;
  padding: 8px;
  border: 1px solid #2a2b36;
  border-radius: 20px;
  background-color: #13141f;
  color: #ffffff;
}

.conversations {
  flex-grow: 1;
  overflow-y: auto;
}

.conversation-item {
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.conversation-item h4{
  display: flex;
  left: 0;
}
.conversation-item:hover {
  background-color: #2a2b36;
}

.conversation-item.active {
  background-color: #2a2b36;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.conversation-info h3 {
  font-size: 16px;
  margin: 0 0 5px 0;
  color: #ffffff;
}

.conversation-info p {
  font-size: 14px;
  color: #a9adc1;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.message-area {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.message-header {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #2a2b36;
}

.message-header h2 {
  font-size: 18px;
  margin: 0;
  color: #ffffff;
}

.messages {
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.message {
  max-width: 70%;
  margin-bottom: 15px;
  align-self: flex-start;
}

.message.sent {
  align-self: flex-end;
}

.message-content {
  padding: 10px;
  border-radius: 18px;
  background-color: #2a2b36;
  color: #ffffff;
  display: inline-block;
}

.message.sent .message-content {
  background: linear-gradient(90deg, #2AF598 0%, #009EFD 100%);
  color: white;
}

.message-time {
  font-size: 12px;
  color: #a9adc1;
  margin-top: 5px;
  display: block;
}

.no-conversation {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a9adc1;
}

.message-input {
  display: flex;
  padding: 10px;
  border-top: 1px solid #2a2b36;
}

.message-input textarea {
  flex-grow: 1;
  padding: 8px;
  border: 1px solid #2a2b36;
  border-radius: 20px;
  margin-right: 10px;
  resize: none;
  height: 40px;
  line-height: 20px;
  background-color: #13141f;
  color: #ffffff;
}

.send-button {
  background: linear-gradient(90deg, #2AF598 0%, #009EFD 100%);
  color: white;
  border: none;
  padding: 0 16px;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.send-button:hover {
  background-color: #6d28d9;
}

@media (max-width: 768px) {
  .messages-container {
    flex-direction: column;
  }

  .conversation-list {
    width: 100%;
    height: 30%;
    min-height: 200px;
    border-right: none;
    border-bottom: 1px solid #2a2b36;
  }

  .message-area {
    height: 70%;
  }
}
</style>
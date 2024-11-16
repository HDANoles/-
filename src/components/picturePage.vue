<template>
  <div class="gallery-container">
    <div class="gallery-grid">
      <div v-for="(post, index) in userStore.posts" 
           :key="index" 
           class="gallery-item"
           @click="openLightbox(index)">
        <img :src="post.image" :alt="post.title" loading="lazy" />
      </div>
    </div>

    <div v-if="lightboxOpen" class="lightbox" @click="closeLightbox">
      <button @click.stop="previousImage" class="lightbox-button lightbox-button-left">&lt;</button>
      <div class="lightbox-image-container">
        <img :src="currentImage.image" :alt="currentImage.title" class="lightbox-image" />
      </div>
      <button @click.stop="nextImage" class="lightbox-button lightbox-button-right">&gt;</button>
      <button @click.stop="closeLightbox" class="lightbox-button lightbox-button-close">X</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useUserStore } from '@/stores/userStore.js';

const userStore = useUserStore();

const lightboxOpen = ref(false);
const currentImageIndex = ref(0);
const currentImage = ref({});

const openLightbox = (index) => {
  currentImageIndex.value = index;
  currentImage.value = userStore.posts[index];
  lightboxOpen.value = true;
  document.body.style.overflow = 'hidden';
};

const closeLightbox = () => {
  lightboxOpen.value = false;
  document.body.style.overflow = 'auto';
};

const nextImage = (e) => {
  e.stopPropagation();
  currentImageIndex.value = (currentImageIndex.value + 1) % userStore.posts.length;
  currentImage.value = userStore.posts[currentImageIndex.value];
};

const previousImage = (e) => {
  e.stopPropagation();
  currentImageIndex.value = (currentImageIndex.value - 1 + userStore.posts.length) % userStore.posts.length;
  currentImage.value = userStore.posts[currentImageIndex.value];
};

const handleKeydown = (e) => {
  if (!lightboxOpen.value) return;

  switch (e.key) {
    case 'ArrowRight':
      nextImage(e);
      break;
    case 'ArrowLeft':
      previousImage(e);
      break;
    case 'Escape':
      closeLightbox();
      break;
  }
};

window.addEventListener('keydown', handleKeydown);
</script>

<style scoped>
.gallery-container {
  min-height: 100vh;
  background-color: #1a1a1a;
  padding: 1rem;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); /* Changed to auto-fit */
  gap: 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

.gallery-item {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.gallery-item:hover {
  transform: scale(1.05);
}

.gallery-item::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0);
  transition: background-color 0.3s ease;
}

.gallery-item:hover::after {
  background-color: rgba(0, 0, 0, 0.3);
}

.gallery-item img {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

.lightbox {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.lightbox-image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.lightbox-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  display: block;
}

.lightbox-button {
  position: absolute;
  background-color: transparent;
  color: white;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  padding: 1rem;
  transition: background-color 0.3s ease;
}

.lightbox-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.lightbox-button-left {
  left: 1rem;
}

.lightbox-button-right {
  right: 1rem;
}

.lightbox-button-close {
  top: 1rem;
  right: 1rem;
  font-size: 1.5rem;
  background-color: #fff;
  color: #000;
  border-radius: 50%;
  padding: 0.5rem 0.75rem;
}

@media (max-width: 768px) {
  .gallery-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }

  .gallery-item img {
    height: 200px;
  }

  .lightbox-button {
    font-size: 1.5rem;
    padding: 0.5rem;
  }
}
</style>
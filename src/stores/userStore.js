import { defineStore } from 'pinia';
import { ref } from 'vue';
import Mock from 'mockjs';

export const useUserStore = defineStore('user', () => {
    const posts = ref([]);
    const bookmarkedPosts = ref([]);
    const totalPosts = 100;
    const loadedPosts = ref(0);
    //模拟数据
    const fetchPosts = (count = 20) => {
        const newPosts = Mock.mock({
            [`posts|${count}`]: [{
                'id': '@GUID',
                'image': () => `https://picsum.photos/600/600?random=${Math.floor(Math.random() * 1000)}`,
                'likes|1-999': 999,
                'comments|1-999': 15,
                'username': '@NAME',
                'userAvatar': () => `https://picsum.photos/150/150?random=${Math.floor(Math.random() * 1000)}`,
                'title': '@TITLE(1, 3)',
                'content': '@PARAGRAPH(1, 3)',
                'isBookmarked': false,
            }]
        }).posts;

        posts.value.push(...newPosts);
        loadedPosts.value += count;
    };

    const toggleBookmark = (postId) => {
        const post = posts.value.find(p => p.id === postId);
        if (post) {
            if (!post.isBookmarked) {
                post.isBookmarked = true;
                bookmarkedPosts.value.push(post);
            } else {
                post.isBookmarked = false;
                const index = bookmarkedPosts.value.findIndex(p => p.id === postId);
                if (index !== -1) {
                    bookmarkedPosts.value.splice(index, 1);
                }
            }
        }
    };

    const isBookmarked = (postId) => {
        return bookmarkedPosts.value.some(p => p.id === postId);
    };

    return {
        posts,
        bookmarkedPosts,
        fetchPosts,
        loadedPosts,
        totalPosts,
        toggleBookmark,
        isBookmarked
    };
});
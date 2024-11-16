import { defineStore } from 'pinia';

//模拟数据
export const useVideoStore = defineStore('videoStore', {
    state: () => ({
        videos: [],
    }),
    actions: {
        generateRandomVideos() {
            const sampleUsers = ['user1', 'user2', 'user3', 'user4', 'user5'];
            const videoUrls = [
                'http://vjs.zencdn.net/v/oceans.mp4',
                'http://vjs.zencdn.net/v/oceans.mp4',
                'http://vjs.zencdn.net/v/oceans.mp4',
            ];
            this.videos = Array.from({ length: 10 }, (_, index) => {
                const randomUser = sampleUsers[Math.floor(Math.random() * sampleUsers.length)];
                return {
                    id: index + 1,
                    url: videoUrls[Math.floor(Math.random() * videoUrls.length)],
                    username: randomUser,
                    description: `随机视频 #${index + 1}`,
                    likes: Math.floor(Math.random() * 1000),
                    comments: [],
                    liked: false,
                };
            });
        },
    },
});
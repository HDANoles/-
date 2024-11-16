import { defineStore } from 'pinia'

export const usePostStore = defineStore('post', {
    state: () => ({
        posts: []
    }),
    actions: {
        addPost(post) {
            this.posts.unshift(post)
        }
    }
})
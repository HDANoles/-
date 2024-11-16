import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        registeredUsers: [],
        currentUser: null
    }),
    getters: {
        getCurrentUser: (state) => state.currentUser
    },
    actions: {
        initializeTestUser() {
            this.registeredUsers.push({
                name: '测试用户',
                email: 'test@example.com',
                password: 'password123'
            });
        },
        registerUser(userData) {
            const existingUser = this.registeredUsers.find(u => u.email === userData.email);
            if (existingUser) {
                throw new Error('用户已存在');
            }
            this.registeredUsers.push(userData);
        },
        loginUser(userData) {
            const user = this.registeredUsers.find(u => u.email === userData.email && u.password === userData.password);
            if (user) {
                this.currentUser = user;
            } else {
                throw new Error('登录信息不正确');
            }
        },
        logoutUser() {
            this.currentUser = null;
        }
    }
});
import { defineStore } from 'pinia';
import { login as userLogin, getUserProfile, LoginData } from '/@/api/user/index';
import { setToken, clearToken } from '/@/utils/auth';
import { UserState } from './types';

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user_id: undefined,
    user_name: undefined,
  }),
  getters: {
    userProfile(state: UserState): UserState {
      return { ...state };
    },
  },
  actions: {
    switchRoles() {
      return new Promise((resolve) => {
        // this.role = this.role === 'user' ? 'user' : 'admin';
        resolve(this.role);
      });
    },
    // 设置用户的信息
    setInfo(partial: Partial<UserState>) {
      this.$patch(partial);
    },
    // 重置用户信息
    resetInfo() {
      this.$reset();
    },
    // 获取用户信息
    async info() {
      const result = await getUserProfile();
      this.setInfo(result);
    },
    // 异步登录并存储token
    async login(loginForm: LoginData) {
      const result = await userLogin(loginForm);
      const token = result?.token;
      if (token) {
        setToken(token);
      }
      this.setInfo({
        user_id: result?.id,
        user_name: result?.data,
      });
      return result;
    },
    // Logout
    logout() {
      this.resetInfo();
      clearToken();
      // 路由表重置
      // location.reload();
    },
  },
  persist: [
    {
      key: 'userStore',
      storage: localStorage,
      paths: ['user_id', 'user_name'],
    },
  ],
});

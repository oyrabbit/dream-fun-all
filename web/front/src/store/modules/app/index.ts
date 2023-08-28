import { defineStore } from 'pinia';
import piniaStore from '/@/store/index';
import { AppState } from './types';

export const useAppStore = defineStore(
  // 唯一ID
  'app',
  {
    state: (): any => ({
      title: '梦趣导航，创建属于你的个人导航',
      h1: '梦趣导航，创建属于你的个人导航',
      theme: '',
      collapsed: false,
      loginModal: false,
      registerModal: false,
      lastWebsite: {},
      recommendWebsites: [],
      searchSetValue: 'baidu',
      recommendSetValue: true,
      skinUrl: 'https://dream.orabbit.cn/FnZJ8-LDZow0qyDR1TfYyPm17ssW',
      icoUrl: 'https://api.iowen.cn/favicon/',
      // icoUrl: 'http://localhost:8899/',
    }),
    getters: {},
    actions: {
      updateSettings(partial: Partial<AppState>) {
        this.$patch(partial);
      },

      // Change theme color
      toggleTheme(dark: boolean) {
        if (dark) {
          this.theme = 'dark';
          document.documentElement.classList.add('dark');
        } else {
          this.theme = 'light';
          document.documentElement.classList.remove('dark');
        }
      },
    },
    persist: [
      {
        key: 'appStore',
        storage: localStorage,
        paths: ['theme', 'collapsed', 'skinUrl'],
      },
      {
        key: 'websiteSet',
        storage: localStorage,
        paths: ['searchSetValue', 'recommendSetValue'],
      },
      {
        key: 'recommendWebsites',
        storage: localStorage,
        paths: ['lastWebsite', 'recommendWebsites'],
      },
    ],
  },
);

export function useAppOutsideStore() {
  return useAppStore(piniaStore);
}

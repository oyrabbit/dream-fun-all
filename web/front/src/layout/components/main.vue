<script setup lang="ts">
  import { useAppStore } from '/@/store';
  const appStore = useAppStore();
  const back = computed(() => 'url(' + appStore.skinUrl + ')');
</script>
<template>
  <div>
    <!-- <div class="" h="[calc(100vh-60px)]"> -->
    <router-view />
  </div>
</template>

<style scoped lang="less">
  .main-back {
    width: 100%;
    min-height: calc(100vh - 60px) !important;
    background-image: v-bind(back);
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    background-attachment: fixed;
  }
</style>

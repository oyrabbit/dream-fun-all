<template>
  <div class="detail-item">
    <div class="detail-item-title">{{ title }}</div>
    <div class="detail-item-safe-box">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
}

const { title } = defineProps<Props>()
</script>

<style scoped lang="scss">
.detail-item {
  width: 100%;
  .detail-item-title {
    position: relative;
    padding-left: 10px;
    color: var(--el-text-color-regular);
    &::after {
      content: '';
      width: 2px;
      height: 10px;
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      background: var(--el-color-primary);
    }
  }
  .detail-item-safe-box {
    width: 100%;
    padding: 15px 0;
  }
}
</style>

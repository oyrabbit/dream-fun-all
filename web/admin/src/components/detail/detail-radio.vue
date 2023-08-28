<script lang="ts" setup>
import { ref } from 'vue'

interface Props {
  tabs: {
    label: string
    name: string
  }[]
}

const { tabs } = defineProps<Props>()

const activeName = ref(tabs[0].label)
</script>

<template>
  <div class="detail-radio">
    <div class="tabs">
      <el-radio-group v-model="activeName" size="large">
        <el-radio-button v-for="(item, index) in tabs" :key="index" :label="item.label" />
      </el-radio-group>
    </div>
    <div class="detail-radio-container">
      <template v-for="item in tabs">
        <slot :name="item.name" v-if="activeName === item.label" />
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.detail-radio {
  width: 100%;
  &-container {
    width: 100%;
    padding: 20px 0 0 0;
  }
}
</style>

<template>
  <div class="detail layout-pd">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <div class="card-header-left">
            <span>{{ options.title }}</span>
            <el-tabs v-model="activeName" class="card-header-left-tabs" :stretch="true">
              <el-tab-pane
                v-for="(item, index) in options.tabs"
                :key="index"
                :label="item.label"
                :name="item.name"
              ></el-tab-pane>
            </el-tabs>
          </div>

          <div class="card-header-btn">
            <el-row :gutter="20">
              <el-col
                :xs="24"
                :sm="12"
                :md="12"
                :lg="12"
                :xl="12"
                v-for="(item, index) in options.btns"
                :key="index"
              >
                <el-button type="primary" @click="router.push(item.path)">{{
                  item.title
                }}</el-button>
              </el-col>
            </el-row>
          </div>
        </div>
      </template>
      <div class="card-body">
        <!-- <el-tabs tab-position="left" class="demo-tabs">
          <el-tab-pane label="User"></el-tab-pane>
          <el-tab-pane label="项目作战图"></el-tab-pane>
          <el-tab-pane label="Role"></el-tab-pane>
          <el-tab-pane label="Task"></el-tab-pane>
        </el-tabs> -->
        <div class="card-body-slot">
          <template v-for="item in options.tabs">
            <slot :name="item.name" v-if="activeName === item.name" />
          </template>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import router from '/@/router'
import 'element-plus/theme-chalk/display.css'

interface Props {
  options: {
    title: string
    tabs: {
      label: string
      name: string
    }[]
    btns: {
      title: string
      path: string
    }[]
  }
}

const { options } = defineProps<Props>()

const activeName = ref(options.tabs[0].name)
</script>

<style scoped lang="scss">
.detail {
  width: 100%;
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    &-left {
      display: flex;
      flex-direction: column;
      max-width: 70%;
      &-tabs {
        margin-top: 20px;
        margin-bottom: -30px;
      }
    }
    &-btn {
      max-width: 30%;
      display: flex;
      justify-content: center;
      margin-left: 20px;
    }
  }
  .card-body {
    width: 100%;
    display: flex;
    &-slot {
      width: 100%;
    }
  }
}
// :deep(.el-tabs__nav-wrap) {
//   overflow-x: auto;
//   overflow-y: hidden;
//   -webkit-overflow-scrolling: touch;
// }
// :deep(.el-tabs__header) {
//   overflow-x: auto;
//   overflow-y: hidden;
//   -webkit-overflow-scrolling: touch;
// }
// :deep(.el-tabs__nav-scroll) {
//   overflow-x: auto;
//   overflow-y: hidden;
//   -webkit-overflow-scrolling: touch;
// }
:deep(.el-tabs__nav) {
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
}
</style>

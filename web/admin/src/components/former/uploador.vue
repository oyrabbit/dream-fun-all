<template>
  <el-upload
    class="uploador"
    action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
    :show-file-list="true"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
    :limit="3"
  >
    <div class="uploador-content">
      <el-icon class="uploador-icon"><Plus /></el-icon>
      <span v-if="type === 'video'">上传视频</span>
      <span v-if="type === 'image'">上传图片</span>
    </div>
  </el-upload>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

import type { UploadProps } from 'element-plus'

interface Props {
  type: string
}

const { type } = defineProps<Props>()

const imageUrl = ref('')

const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!)
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('Avatar picture must be JPG format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Avatar picture size can not exceed 2MB!')
    return false
  }
  return true
}
</script>

<style scoped>
.uploador .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style lang="scss">
.uploador .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.uploador .el-upload:hover {
  border-color: var(--el-color-primary);
}

.uploador-content {
  width: 178px;
  height: 178px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  padding: 50px 0;
  span {
    line-height: 20px;
    font-size: 14px;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: #aaacad;
  }
}

.el-icon.uploador-icon {
  font-size: 28px;
  width: 78px;
  height: 78px;
  text-align: center;
  color: #8c939d;
}
</style>

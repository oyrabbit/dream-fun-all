<script setup lang="ts">
import { ref, watchEffect, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

interface Props {
  dialogFormVisible: boolean
  title: string
  data: EmptyObjectType[]
  btns: EmptyObjectType[]
}
const { dialogFormVisible, btns, title } = defineProps<Props>()

const emit = defineEmits(['update:dialogFormVisible', 'dialogBtnClick'])

const ruleFormRef = ref<FormInstance>()

const ruleForm = reactive({
  fcatename: '',
  icon: '',
  priority: 0
})

const rules = reactive<FormRules>({
  fcatename: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { min: 1, max: 50, message: '分类名称应该在1-50个字符之间', trigger: 'blur' }
  ],
  icon: [
    { required: true, message: '请输入iconpark-icon图标名称', trigger: 'blur' },
    { min: 1, max: 50, message: '图标名称应该在1-50个字符之间', trigger: 'blur' }
  ],
  priority: [
    { required: true, message: '请输入优先级', trigger: 'blur' },
    { type: 'number', message: '优先级必须为数字' }
  ]
})

// const resetForm = (formEl: FormInstance | undefined) => {
//   if (!formEl) return
//   formEl.resetFields()
// }

const dialogFormVisibleC = ref(false)

watchEffect(() => emit('update:dialogFormVisible', dialogFormVisibleC))

watchEffect(() => {
  dialogFormVisibleC.value = dialogFormVisible
})

const hanleDialogBtnClick = (id: number, formEl: FormInstance | undefined) => {
  if (!formEl) {
    emit('dialogBtnClick', id)
  } else {
    formEl.validate((valid) => {
      if (valid) {
        emit('dialogBtnClick', id, ruleForm)
        resetForm()
      } else {
        console.log('error submit!')
        return false
      }
    })
  }
}

const resetForm = () => {
  ruleForm.fcatename = ''
  ruleForm.icon = ''
  ruleForm.priority = 0
}
const handleCanle = () => {
  dialogFormVisibleC.value = false
  resetForm()
}
</script>

<template>
  <el-dialog v-model="dialogFormVisibleC" :title="title" width="75%">
    <div class="dialog-detail">
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        status-icon
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称" prop="fcatename">
          <el-input v-model="ruleForm.fcatename" type="text" autocomplete="off" />
        </el-form-item>
        <el-form-item label="xicons图标名称" prop="icon">
          <el-input v-model="ruleForm.icon" type="text" autocomplete="off" />
        </el-form-item>
        <el-form-item label="优先级" prop="priority">
          <el-input v-model.number="ruleForm.priority" type="text" autocomplete="off" />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCanle()">取消</el-button>
        <el-button
          :type="item.type"
          @click="() => hanleDialogBtnClick(item.id, ruleFormRef)"
          v-for="item in btns"
          :key="item.id"
          >{{ item.title }}</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.dialog-detail {
}
</style>

<script setup lang="ts">
import { ref, watchEffect, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

interface Props {
  dialogFormVisible: boolean
  title: string
  data: EmptyObjectType[]
  btns: EmptyObjectType[]
}
const { dialogFormVisible, btns, title, data } = defineProps<Props>()

const emit = defineEmits(['update:dialogFormVisible', 'dialogBtnClick'])

const ruleFormRef = ref<FormInstance>()

const ruleForm = reactive({
  catename: '',
  fcatename: '',
  priority: 0
})

const rules = reactive<FormRules>({
  catename: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { min: 1, max: 50, message: '分类名称应该在1-50个字符之间', trigger: 'blur' }
  ],
  fcatename: [
    {
      required: true,
      message: '请选择所属大分类',
      trigger: 'change'
    }
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
  ruleForm.catename = ''
  ruleForm.fcatename = ''
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
        <el-form-item label="分类名称" prop="catename">
          <el-input v-model="ruleForm.catename" type="text" autocomplete="off" />
        </el-form-item>
        <el-form-item label="所属大分类" prop="fcatename">
          <el-select v-model="ruleForm.fcatename" placeholder="请选择所属分类">
            <el-option :label="item.name" :value="item.id" v-for="item in data" :key="item.id" />
          </el-select>
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

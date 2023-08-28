<script setup lang="ts">
import { ref, watchEffect, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

interface Props {
  dialogFormVisible: boolean
  title: string
  data: EmptyObjectType
  btns: EmptyObjectType[]
}
const { dialogFormVisible, data, btns, title } = defineProps<Props>()

const emit = defineEmits(['update:dialogFormVisible', 'dialogBtnClick'])

const ruleFormRef = ref<FormInstance>()

const ruleForm = reactive({
  username: '',
  role: ''
  // age: ''
})
watchEffect(() => {
  ruleForm.username = data.username
  ruleForm.role = data.role
})

const rules = reactive<FormRules>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 4, max: 12, message: '用户名长度应该在4-12个字符之间', trigger: 'blur' }
  ],
  role: [
    {
      required: true,
      message: '请选择用户角色',
      trigger: 'change'
    }
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
  ruleForm.role = ''
  ruleForm.username = ''
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
        <el-form-item label="用户名" prop="username">
          <el-input v-model="ruleForm.username" type="text" autocomplete="off" />
        </el-form-item>
        <el-form-item label="用户角色" prop="role">
          <el-radio-group v-model="ruleForm.role">
            <el-radio label="管理员" />
            <el-radio label="普通用户" />
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item label="Age" prop="age">
          <el-input v-model.number="ruleForm.age" />
        </el-form-item> -->
        <!-- <el-form-item>
          <el-button type="primary" @click="submitForm(ruleFormRef)">Submit</el-button>
          <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
        </el-form-item> -->
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

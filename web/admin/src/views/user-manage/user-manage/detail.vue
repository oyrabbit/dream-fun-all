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

// const checkAge = (rule: any, value: any, callback: any) => {
//   if (!value) {
//     return callback(new Error('Please input the age'))
//   }
//   setTimeout(() => {
//     if (!Number.isInteger(value)) {
//       callback(new Error('Please input digits'))
//     } else {
//       if (value < 18) {
//         callback(new Error('Age must be greater than 18'))
//       } else {
//         callback()
//       }
//     }
//   }, 1000)
// }

const validatePass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else {
    if (ruleForm.checkPass !== '') {
      if (!ruleFormRef.value) return
      ruleFormRef.value.validateField('checkPass', () => null)
    }
    callback()
  }
}
const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码！'))
  } else if (value !== ruleForm.pass) {
    callback(new Error('两次密码不相同！'))
  } else {
    callback()
  }
}

const ruleForm = reactive({
  pass: '',
  checkPass: ''
  // age: ''
})

const rules = reactive<FormRules>({
  pass: [{ required: true, validator: validatePass, trigger: 'blur' }],
  checkPass: [{ required: true, validator: validatePass2, trigger: 'blur' }]
  // age: [{ validator: checkAge, trigger: 'blur' }]
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
  ruleForm.pass = ''
  ruleForm.checkPass = ''
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
        <el-form-item label="新密码" prop="pass">
          <el-input v-model="ruleForm.pass" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input v-model="ruleForm.checkPass" type="password" autocomplete="off" />
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
        <el-button @click="() => handleCanle()">取消</el-button>
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

<script setup lang="ts">
import { ref, watchEffect, watch, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useCateApi } from '/@/api/admin/category'

interface Props {
  dialogFormVisible: boolean
  title: string
  data: EmptyObjectType
  btns: EmptyObjectType[]
}
const { dialogFormVisible, btns, title, data } = defineProps<Props>()

const emit = defineEmits(['update:dialogFormVisible', 'dialogBtnClick'])

const ruleFormRef = ref<FormInstance>()

const cateApi = useCateApi()

const ruleForm = reactive({
  name: '',
  url: '',
  description: '',
  catename: '',
  fcatename: '',
  priority: 0
})

const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入网站名称', trigger: 'blur' }],
  url: [
    { required: true, message: '请输入网站地址', trigger: 'blur' }
    // { type: 'url', message: '请输入正确的地址格式！（http://... https://....）', trigger: 'blur' }
  ],
  description: [{ required: true, message: '请输入网站描述', trigger: 'blur' }],
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

const dialogFormVisibleC = ref(false)
const cateList = ref<RefType>([])

const getCateList = (val: number) => {
  cateList.value = []
  cateApi.getCateByfid(val).then((res) => {
    res?.data?.forEach((item: any) => {
      cateList.value.push({
        id: item.id,
        name: item.s_name
      })
    })
  })
}

watchEffect(() => emit('update:dialogFormVisible', dialogFormVisibleC))

watchEffect(() => {
  dialogFormVisibleC.value = dialogFormVisible
})

watch(
  data.editFormData,
  () => {
    ruleForm.name = data.editFormData.name
    ruleForm.url = data.editFormData.url
    ruleForm.description = data.editFormData.description
    ruleForm.fcatename = data.fcateList.find(
      (item: any) => item.name === data.editFormData.fcatename
    )?.id
    cateList.value = []
    cateApi.getCateByfid(Number(ruleForm.fcatename)).then((res) => {
      res?.data?.forEach((item: any) => {
        cateList.value.push({
          id: item.id,
          name: item.s_name
        })
      })
      ruleForm.catename = cateList.value.find(
        (item: any) => item.name === data.editFormData.catename
      )?.id
      ruleForm.priority = data.editFormData.priority
    })
  },
  { deep: true }
)

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

const handleChange = (val: number) => {
  ruleForm.catename = ''
  getCateList(val)
}

const resetForm = () => {
  ruleForm.name = ''
  ruleForm.url = ''
  ruleForm.description = ''
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
        <el-form-item label="网站名称" prop="name">
          <el-input v-model="ruleForm.name" type="text" autocomplete="off" />
        </el-form-item>
        <el-form-item label="网站地址" prop="url">
          <el-input v-model="ruleForm.url" type="text" autocomplete="off" />
        </el-form-item>
        <el-form-item label="网站描述" prop="description">
          <el-input v-model="ruleForm.description" type="text" autocomplete="off" />
        </el-form-item>
        <el-form-item label="所属大分类" prop="fcatename">
          <el-select
            v-model="ruleForm.fcatename"
            placeholder="请选择所属大分类"
            @change="handleChange"
          >
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="item in data.fcateList"
              :key="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属分类" prop="fcatename">
          <el-select v-model="ruleForm.catename" placeholder="请选择所属分类">
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="item in cateList"
              :key="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="优先级" prop="priority">
          <el-input v-model.number="ruleForm.priority" type="text" autocomplete="off" />
        </el-form-item>
        <!-- <el-form-item label="Age prop="age">
          <el-input v-model.number="ru"leForm.age" />
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

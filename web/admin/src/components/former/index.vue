<template>
  <div class="dynamic-form-container layout-pd">
    <el-card shadow="hover" :header="options.title" style="margin-bottom: -30px">
      <div class="form-title" v-if="options.formTitle">{{ options.formTitle }}</div>
      <el-form
        :model="state.form"
        ref="formRulesOneRef"
        size="default"
        label-width="250px"
        class="mt35"
      >
        <template v-if="options.type === 'inline'">
          <el-row :gutter="35">
            <el-col
              :xs="val.xs"
              :sm="val.sm"
              :md="val.md"
              :lg="val.lg"
              :xl="val.xl"
              class="mb30"
              v-for="(val, key) in options.formData"
              :key="key"
              v-show="val.isShow"
            >
              <template v-if="val.type !== ''">
                <el-form-item
                  :label="val.label"
                  :prop="val.prop"
                  :rules="[
                    {
                      required: val.required,
                      message: `${val.label}不能为空`,
                      trigger: 'blur'
                    }
                  ]"
                  v-if="val.type !== 'other'"
                >
                  <el-input
                    v-model="state.form[val.prop]"
                    :placeholder="val.placeholder"
                    clearable
                    v-if="val.type === 'input'"
                    style="width: 100%"
                    :disabled="val.disabled"
                    ><template #append v-if="val.type === 'input' && val.right">{{
                      val.right
                    }}</template></el-input
                  >
                  <el-date-picker
                    v-model="state.form[val.prop]"
                    :type="val.type"
                    :placeholder="val.placeholder"
                    v-else-if="
                      [
                        'year',
                        'month',
                        'date',
                        'dates',
                        'datetime',
                        'week',
                        'datetimerange',
                        'daterange',
                        'monthrange'
                      ].includes(val.type)
                    "
                    style="width: 100%"
                    :disabled="val.disabled"
                  >
                  </el-date-picker>
                  <yearRange
                    v-model:year="state.form[val.prop]"
                    v-else-if="val.type === 'yearRange'"
                  />
                  <baiduMap
                    v-model:address="state.form[val.prop]"
                    :placeholder="val.placeholder"
                    v-else-if="val.type === 'baiduMap'"
                    style="width: 100%"
                  />
                  <uploadImage type="image" v-else-if="val.type === 'uploadImage'" />
                  <uploadImage type="video" v-else-if="val.type === 'uploadVideo'" />
                  <el-select
                    v-model="state.form[val.prop]"
                    :placeholder="val.placeholder"
                    v-else-if="val.type === 'select'"
                    style="width: 100%"
                    :disabled="val.disabled"
                  >
                    <el-option
                      v-for="item in val.options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                  <el-input
                    type="textarea"
                    v-model="state.form[val.prop]"
                    :placeholder="val.placeholder"
                    clearable
                    v-if="val.type === 'textarea'"
                    style="width: 100%"
                    :rows="4"
                    :disabled="val.disabled"
                  ></el-input>
                  <el-date-picker
                    v-model="state.form[val.prop]"
                    type="daterange"
                    range-separator="To"
                    v-if="val.type === 'datePicker'"
                    start-placeholder="Start date"
                    end-placeholder="End date"
                    size="default"
                  />
                  <el-checkbox-group v-model="state.form[val.prop]" v-if="val.type === 'checkbox'">
                    <el-checkbox
                      :name="state.form[val.prop]"
                      v-for="item in val.options"
                      :key="item.value"
                      :label="item.label"
                    />
                  </el-checkbox-group>
                </el-form-item>
              </template>
            </el-col>
          </el-row>
        </template>
        <template v-if="options.type === 'outline'">
          <el-row :gutter="35" v-for="(val, key) in options.formData" :key="key">
            <el-col
              :xs="val.xs"
              :sm="val.sm"
              :md="val.md"
              :lg="val.lg"
              :xl="val.xl"
              class="mb30"
              v-show="val.isShow"
            >
              <template v-if="val.type !== ''">
                <el-form-item
                  :label="val.label"
                  :prop="val.prop"
                  :rules="[
                    {
                      required: val.required,
                      message: `${val.label}不能为空`,
                      trigger: 'blur'
                    }
                  ]"
                  v-if="val.type !== 'other'"
                >
                  <el-input
                    v-model="state.form[val.prop]"
                    :placeholder="val.placeholder"
                    clearable
                    v-if="val.type === 'input'"
                    style="width: 100%"
                    :disabled="val.disabled"
                    ><template #append v-if="val.type === 'input' && val.right">{{
                      val.right
                    }}</template></el-input
                  >
                  <el-date-picker
                    v-model="state.form[val.prop]"
                    :type="val.type"
                    :placeholder="val.placeholder"
                    v-else-if="
                      [
                        'year',
                        'month',
                        'date',
                        'dates',
                        'datetime',
                        'week',
                        'datetimerange',
                        'daterange',
                        'monthrange'
                      ].includes(val.type)
                    "
                    style="width: 100%"
                    :disabled="val.disabled"
                  >
                  </el-date-picker>
                  <yearRange
                    v-model:year="state.form[val.prop]"
                    v-else-if="val.type === 'yearRange'"
                  />
                  <baiduMap
                    v-model:address="state.form[val.prop]"
                    :placeholder="val.placeholder"
                    v-else-if="val.type === 'baiduMap'"
                    style="width: 100%"
                  />
                  <uploadImage type="image" v-else-if="val.type === 'uploadImage'" />
                  <uploadImage type="video" v-else-if="val.type === 'uploadVideo'" />
                  <el-select
                    v-model="state.form[val.prop]"
                    :placeholder="val.placeholder"
                    v-else-if="val.type === 'select'"
                    style="width: 100%"
                    :disabled="val.disabled"
                  >
                    <el-option
                      v-for="item in val.options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                  <el-input
                    type="textarea"
                    v-model="state.form[val.prop]"
                    :placeholder="val.placeholder"
                    clearable
                    v-if="val.type === 'textarea'"
                    style="width: 100%"
                    :rows="4"
                    :disabled="val.disabled"
                  ></el-input>
                  <el-date-picker
                    v-model="state.form[val.prop]"
                    type="daterange"
                    range-separator="To"
                    v-if="val.type === 'datePicker'"
                    start-placeholder="Start date"
                    end-placeholder="End date"
                    size="default"
                  />
                  <el-checkbox-group v-model="state.form[val.prop]" v-if="val.type === 'checkbox'">
                    <el-checkbox
                      :name="state.form[val.prop]"
                      v-for="item in val.options"
                      :key="item.value"
                      :label="item.label"
                    />
                  </el-checkbox-group>
                </el-form-item>
              </template>
            </el-col>
          </el-row>
        </template>
      </el-form>
    </el-card>
  </div>
  <el-row class="flex mt15 subs">
    <!-- <div class="flex-margin"> -->
    <div class="subs-content">
      <el-button size="default" @click="onResetForm(formRulesOneRef)">
        <el-icon>
          <ele-RefreshRight />
        </el-icon>
        重置
      </el-button>
      <el-button size="default" type="primary" @click="onSubmitForm(formRulesOneRef)">
        <el-icon>
          <ele-Position />
        </el-icon>
        {{ options.subName }}
      </el-button>
    </div>
  </el-row>
</template>

<script setup lang="ts" name="pagesDynamicForm">
import { reactive, ref, onMounted } from 'vue'
import type { FormInstance } from 'element-plus'

import yearRange from './year-range.vue'
import baiduMap from './baidu-map.vue'
import uploadImage from './uploador.vue'

interface Props {
  options: FormOptions
}

const { options } = defineProps<Props>()

// 定义子组件向父组件传值/事件
const emit = defineEmits(['submitForm'])

// 定义变量内容
const formRulesOneRef = ref<FormInstance>()
const state = reactive({
  form: {}
})

// 表单验证
const onSubmitForm = (formEl: FormInstance | undefined) => {
  console.log(state.form, 111)
  if (!formEl) return
  formEl.validate((valid: boolean) => {
    if (valid) {
      emit('submitForm', state.form)
    } else {
      return false
    }
  })
}
// 重置表单
const onResetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

// 初始化 form 字段
const initFormField = () => {
  if (options.formData.length <= 0) {
    return false
  }
  options.formData.forEach((v) => {
    if (v.type !== 'checkbox') {
      state.form[v.prop] = v.value || ''
      if (v.type === 'yearRange') {
        state.form[v.prop] = v.value || ['', '']
      } else {
        state.form[v.prop] = v.value || ''
      }
    }
  })
  console.log(state.form)
}
// 页面加载时
onMounted(() => {
  initFormField()
})
</script>
<style scoped lang="scss">
.subs {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 76px;
  background: #ffffff;
  box-shadow: 1px 0px 6px 1px rgba(0, 0, 0, 0.16);
  &-content {
    margin-right: 37px;
  }
}
.form-title {
  line-height: 22px;
  font-size: 16px;
  font-family: PingFang SC-Bold, PingFang SC;
  font-weight: bold;
  color: #050505;
}
</style>

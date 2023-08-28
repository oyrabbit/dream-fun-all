<template>
  <div v-if="props.search.length > 0" class="table-search-container">
    <el-form
      ref="tableSearchRef"
      :model="form"
      size="default"
      label-width="100px"
      class="table-form"
    >
      <el-row>
        <el-col
          v-for="(val, key) in search"
          v-show="key === 0 || isToggle"
          :key="key"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="6"
          :xl="4"
          class="mb20"
        >
          <template v-if="val.type !== ''">
            <el-form-item
              :label-width="val.width"
              :label="val.label"
              :prop="val.prop"
              :rules="[
                {
                  required: val.required,
                  message: `${val.label}不能为空`,
                  trigger: val.type === 'input' ? 'blur' : 'change'
                }
              ]"
            >
              <el-input
                v-if="val.type === 'input'"
                v-model="form[val.prop]"
                :placeholder="val.placeholder"
                clearable
                style="width: 100%"
              />
              <el-date-picker
                v-else-if="val.type === 'date'"
                v-model="form[val.prop]"
                type="date"
                :placeholder="val.placeholder"
                style="width: 100%"
              />
              <el-select
                v-else-if="val.type === 'select'"
                v-model="form[val.prop]"
                :placeholder="val.placeholder"
                style="width: 100%"
              >
                <el-option
                  v-for="item in val.options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </template>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
          <el-form-item class="table-form-btn" :label-width="search.length <= 1 ? '10px' : '100px'">
            <template v-if="search.length > 1" #label>
              <div class="table-form-btn-toggle ml10" @click="storesTableList.isToggle = !isToggle">
                <span>{{ isToggle ? '收筛选' : '展筛选' }}</span>
                <SvgIcon :name="isToggle ? 'ele-ArrowUp' : 'ele-ArrowDown'" />
              </div>
            </template>
            <div>
              <el-button size="default" type="primary" @click="onSearch(tableSearchRef)"
                >查询
              </el-button>
              <el-button size="default" type="info" class="ml10" @click="onReset(tableSearchRef)">
                重置
              </el-button>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup lang="ts" name="makeTableDemoSearch">
import { ref, onMounted } from 'vue'
import type { FormInstance } from 'element-plus'
import { storeToRefs } from 'pinia'
import { useTableList } from '/@/stores/tableList'

const storesTableList = useTableList()
const { form, isToggle } = storeToRefs(storesTableList)

// 定义父组件传过来的值
const props = defineProps({
  // 搜索表单
  search: {
    type: Array<TableSearchType>,
    default: () => []
  }
})

// 定义子组件向父组件传值/事件
const emit = defineEmits(['search'])

// 定义变量内容
const tableSearchRef = ref<FormInstance>()

// 查询
const onSearch = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.validate((valid: boolean) => {
    if (valid) {
      // console.log(form)
      emit('search', form)
    } else {
      return false
    }
  })
}
// 重置
const onReset = (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  formEl.resetFields()
  emit('search', form)
}
// 初始化 form 字段，取自父组件 search.prop
const initFormField = () => {
  if (props.search.length <= 0) {
    return false
  }
  props.search.forEach((v) => (storesTableList.form[v.prop] = ''))
}
// 页面加载时
onMounted(() => {
  initFormField()
})
</script>

<style scoped lang="scss">
.table-search-container {
  //   display: flex;
  .table-form {
    flex: 1;
    .table-form-btn-toggle {
      white-space: nowrap;
      user-select: none;
      display: flex;
      align-items: center;
      color: var(--el-color-primary);
    }
  }
}
</style>

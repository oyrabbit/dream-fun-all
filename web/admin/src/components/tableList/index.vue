<template>
  <div class="table-view">
    <div v-if="tableData.search.length !== 0" class="table-search layout-pd">
      <div class="table-search-padding layout-padding-view">
        <TableSearch :search="tableData.search" @search="onSearch" />
      </div>
    </div>
    <div class="table-main layout-pd">
      <div class="table-padding layout-padding-view layout-padding-auto">
        <div class="table-top">
          <el-row>
            <el-col :xs="12" :sm="10" :md="10" :lg="10" :xl="10">
              <div v-if="tableData.tabs.length !== 0" style="margin-bottom: 15px">
                <el-radio-group v-model="tabId" @input="onTabChange">
                  <el-radio-button
                    v-for="(item, index) in tableData.tabs"
                    :key="index"
                    :label="item"
                  />
                </el-radio-group></div
            ></el-col>
            <el-col :xs="12" :sm="14" :md="14" :lg="14" :xl="14">
              <div class="btns">
                <el-button
                  v-for="(item, index) in tableData.btns"
                  :key="index"
                  type="primary"
                  size="default"
                  @click="handleBtnClick(item)"
                  >{{ item.title }}
                </el-button>
                <el-button
                  type="primary"
                  size="default"
                  @click="onExportTable()"
                  v-if="tableData.config.isExportBtnShow"
                >
                  导出
                </el-button>
              </div></el-col
            >
          </el-row>
        </div>

        <Table
          ref="tableRef"
          class="table-demo"
          @delRow="onTableDelRow"
          @pageChange="onTablePageChange"
          @sortHeader="onSortHeader"
          @operationsClick="handleOperationsClick"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="makeTableDemo">
import { defineAsyncComponent, ref, onMounted, watch } from 'vue'
import router from '/@/router'
// import { ElMessage } from 'element-plus'
import { storeToRefs } from 'pinia'
import { useTableList } from '/@/stores/tableList'

// 引入组件
const Table = defineAsyncComponent(() => import('./table.vue'))
const TableSearch = defineAsyncComponent(() => import('./search.vue'))

interface Props {
  tableData: TableData
}

const props = defineProps<Props>()

// 定义子组件向父组件传值/事件
const emit = defineEmits([
  'search',
  'delRow',
  'pageChange',
  'tabChange',
  'btnClick',
  'operationsClick'
])

const storesTableList = useTableList()
const { tabId } = storeToRefs(storesTableList)

// 定义变量内容
const tableRef = ref<RefType>()

// 初始化列表数据
const getTableData = () => {
  storesTableList.data = props.tableData.data
  storesTableList.header = props.tableData.header
  storesTableList.operations = props.tableData.operations
  // 配置项（必传）
  storesTableList.config = props.tableData.config
  // 搜索参数（不用传，用于分页、搜索时传给后台的值，`getTableData` 中使用）
  storesTableList.page = props.tableData.page
  // 数据总数（模拟，真实从接口取）
  storesTableList.tabId = props.tableData.tabs[0]
}
watch(
  props,
  () => {
    getTableData()
  },
  {
    immediate: true,
    deep: true
  }
)
// 搜索点击时表单回调
const onSearch = (data: EmptyObjectType) => {
  // console.log(data)
  // storesTableList.page = Object.assign({}, props.tableData.page, { ...data })
  // tableRef.value.pageReset()
  emit('search', data)
}

// 选项卡切换
const onTabChange = (data: EmptyObjectType) => {
  emit('tabChange', data)
}

// 点击按钮事件
const handleBtnClick = (item: any) => {
  if (item.path) {
    router.push(item.path)
  } else if (item.click) {
    emit('btnClick', item.id)
  }
}

// 操作按钮事件
const handleOperationsClick = (id: number, row: EmptyObjectType) => {
  emit('operationsClick', id, row)
}

// 删除当前项回调
const onTableDelRow = (row: EmptyObjectType) => {
  // ElMessage.success(`删除${row.name}成功！`)
  emit('delRow', row)
  getTableData()
}
// 分页改变时回调
const onTablePageChange = (page: TableDemoPageType) => {
  storesTableList.page.pageNum = page.pageNum
  storesTableList.page.pageSize = page.pageSize
  emit('pageChange', page)
  // getTableData()
}
// 拖动显示列排序回调
const onSortHeader = (data: TableHeaderType[]) => {
  storesTableList.header = data
}

// 顶部导出按钮
const onExportTable = () => {
  tableRef.value.onImportTable()
}
// 页面加载时
onMounted(() => {
  // getTableData()
})
defineExpose({
  getTableData
})
</script>

<style scoped lang="scss">
.table-view {
  margin-bottom: 0;
}
.table-search {
  width: 100%;
  &-padding {
    padding: 15px;
    // padding-bottom: 0px;
  }
}
.table-main {
  width: 100%;
  height: 100%;
  margin-top: -15px;
  overflow: hidden;
  .table-top {
    width: 100%;
    .btns {
      display: flex;
      justify-content: flex-end;
    }
  }
}
.table-padding {
  padding: 15px;
  .table-demo {
    flex: 1;
    overflow: hidden;
  }
}
</style>

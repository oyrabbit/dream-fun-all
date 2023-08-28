<template>
  <div>
    <!-- 这个btn-clicks id=1新增按钮 -->
    <!-- 这个operations-click 代表操作那一行按钮 -->
    <TableList
      :table-data="tableData"
      @page-change="pageChange"
      @search="search"
      @operations-click="handleOperationsClick"
      @btnClick="handleBtnClick"
      @delRow="delRow"
    />
    <Detail1
      title="编辑网站"
      :data="{ fcateList: fcateList, editFormData: editWebsiteData }"
      :btns="editCateBtns"
      v-model:dialogFormVisible="state.editWebsiteShow"
      @dialogBtnClick="hanleDetail1Click"
    />
    <Detail2
      title="新增网站"
      :data="{ fcateList: fcateList }"
      :btns="addWebsiteBtns"
      v-model:dialogFormVisible="state.addWebsiteShow"
      @dialogBtnClick="hanleDetail2Click"
    />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref, computed, onMounted, reactive } from 'vue'
import { useWebsiteApi } from '/@/api/admin/website'
import { useFCateApi } from '/@/api/admin/fcategory'
import { ElMessage } from 'element-plus'
import moment from 'moment'
moment.locale('zh-cn')

const TableList = defineAsyncComponent(() => import('../../../components/tableList/index.vue'))
const Detail1 = defineAsyncComponent(() => import('./detail1.vue'))
const Detail2 = defineAsyncComponent(() => import('./detail2.vue'))
const websiteApi = useWebsiteApi()
const fcateApi = useFCateApi()

const tableData = computed((): TableData => {
  return {
    // 切换标签，动态生成（传空数组时，将不显示搜索，注意格式）
    tabs: [],
    btns: [
      {
        id: 1,
        title: '新增网站',
        // path: '/project-initiation/declare-entry/add-project'
        click: true
      }
    ],
    // 列表数据（必传）
    data: data.value,
    // 表头内容（必传，注意格式）
    header: [
      {
        key: 'col1',
        colWidth: '100',
        title: '网站id',
        type: 'text',
        isCheck: true
      },
      {
        key: 'col2',
        colWidth: '',
        title: '网站名称',
        type: 'text',
        isCheck: true
      },
      {
        key: 'col3',
        colWidth: '',
        title: '网站地址',
        type: 'text',
        isCheck: true
      },
      {
        key: 'col4',
        colWidth: '',
        title: '所属分类',
        type: 'text',
        isCheck: true
      },
      {
        key: 'col5',
        colWidth: '',
        title: '所属大分类',
        type: 'text',
        isCheck: true
      },
      {
        key: 'col6',
        colWidth: '200',
        title: '描述',
        type: 'text',
        isCheck: true
      },
      {
        key: 'col7',
        colWidth: '80',
        title: '优先级',
        type: 'text',
        isCheck: true
      }
    ],
    // 配置项（必传）
    config: {
      total: pageData.total, // 列表总数
      loading: isLoading.value, // loading 加载
      isBorder: false, // 是否显示表格边框
      isSerialNo: false, // 是否显示表格序号
      isSelection: true, // 是否显示表格多选
      isOperate: true, // 是否显示表格操作栏
      operateWidth: 150,
      isExportBtnShow: false // 是否显示导出组件
    },
    operations: [
      {
        id: 1,
        name: '编辑',
        // path: ''
        click: true
      },
      {
        id: 2,
        name: '删除',
        // path: ''
        click: true
      }
    ],
    // 搜索表单，动态生成（传空数组时，将不显示搜索，注意格式）
    search: [
      {
        label: '网站名称',
        prop: 'val1',
        placeholder: '按网站名称查找',
        required: true,
        type: 'input',
        width: 100
      }
    ],
    // 搜索参数（不用传，用于分页、搜索时传给后台的值，`getTableData` 中使用）
    page: {
      pageNum: pageData.pageNumber,
      pageSize: pageData.pageSize
    }
  }
})

const fcateList = ref<RefType>([])

const getFcateList = async () => {
  const params = { pagenum: 1, pagesize: 9999 }
  await fcateApi.getFCate({ ...params, fcatename: '' }).then((res) => {
    const cateData: EmptyArrayType = []
    res.data?.forEach((item: any) => {
      cateData.push({
        id: item.id,
        name: item.name
      })
    })
    fcateList.value = cateData
  })
}

// 编辑部分
const state = reactive({
  editWebsiteShow: false,
  addWebsiteShow: false
})

const editWebsiteId = ref(0)
const editWebsiteData = reactive({
  name: '',
  url: '',
  description: '',
  catename: '',
  fcatename: '',
  priority: 0
})

const handleOperationsClick = (id: number, row: EmptyObjectType) => {
  if (id === 1) {
    editWebsiteId.value = row.col1
    editWebsiteData.name = row.col2
    editWebsiteData.url = row.col3
    editWebsiteData.catename = row.col4
    editWebsiteData.fcatename = row.col5
    editWebsiteData.description = row.col6
    editWebsiteData.priority = row.col7
    state.editWebsiteShow = true
  }
}

// 删除
const delRow = async (row: EmptyObjectType) => {
  console.log(row)
  await websiteApi.delWebsite(row?.col1).then((res) => {
    if (res.status === 200) {
      ElMessage.success('刪除成功！')
    } else {
      ElMessage.warning(res.message)
    }
    getListData()
  })
}

const editCateBtns = [
  {
    id: 1,
    title: '确认',
    type: 'primary',
    click: true
  }
]

const addWebsiteBtns = [
  {
    id: 1,
    title: '确认',
    type: 'primary',
    click: true
  }
]
const hanleDetail1Click = async (id: number, form: any) => {
  console.log(id, form)
  if (id === 1) {
    await websiteApi
      .editWebsite(editWebsiteId.value, {
        name: form.name,
        url: form.url,
        category_id: form.catename,
        description: form.description,
        priority: form.priority
      })
      .then((res) => {
        if (res.status === 200) {
          ElMessage.success('修改成功！')
        } else {
          ElMessage.warning(res.message)
        }
        state.editWebsiteShow = false
        getListData()
      })
  }
}

const hanleDetail2Click = async (id: number, form: any) => {
  if (id === 1) {
    await websiteApi
      .addWebsite({
        name: form.name,
        url: form.url,
        description: form.description,
        category_id: form.catename,
        priority: form.priority
      })
      .then((res) => {
        if (res.status === 200) {
          ElMessage.success('添加成功！')
        } else {
          ElMessage.warning(res.message)
        }
        state.addWebsiteShow = false
        getListData()
      })
  }
}
const handleBtnClick = (id: number) => {
  if (id === 1) {
    state.addWebsiteShow = true
  }
}
// 表部分
const data = ref<RefType>([])

const pageData = reactive({
  pageNumber: 1,
  pageSize: 10,
  total: 0
})

const searchData: any = ref({})

const search = (data: EmptyObjectType) => {
  searchData.value = data.value
  pageData.pageNumber = 1
  getListData(data.value.val1)
}

const pageChange = (data: TableDemoPageType) => {
  pageData.pageNumber = data.pageNum
  pageData.pageSize = data.pageSize
  getListData(searchData.value.val1)
}
const isLoading = ref(false)

const getListData = async (webname?: string) => {
  const params = { pagenum: pageData.pageNumber, pagesize: pageData.pageSize }

  isLoading.value = true
  await websiteApi.getWebsite({ ...params, webname: webname || '' }).then((res) => {
    const websiteData: EmptyArrayType = []
    if (res?.data) {
      res.data?.forEach((item: any) => {
        websiteData.push({
          col1: item?.id,
          col2: item?.name,
          col3: item?.url,
          col4: item?.category_name,
          col5: item?.f_category_name,
          col6: item?.description,
          col7: item?.priority
        })
      })
      pageData.total = res?.data[0]?.total || 0
    }
    data.value = websiteData
    isLoading.value = false
  })
}
onMounted(() => {
  getListData()
  getFcateList()
})
</script>

<style scoped lang="scss"></style>

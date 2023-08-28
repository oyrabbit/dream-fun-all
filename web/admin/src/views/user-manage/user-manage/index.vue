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
    <Detail
      title="修改密码"
      :data="[]"
      :btns="editPwdBtns"
      v-model:dialogFormVisible="state.editPwdShow"
      @dialogBtnClick="hanleDetailClick"
    />
    <Detail1
      title="编辑用户"
      :data="editUserData"
      :btns="editUserBtns"
      v-model:dialogFormVisible="state.editUserShow"
      @dialogBtnClick="hanleDetail1Click"
    />
    <Detail2
      title="添加用户"
      :data="[]"
      :btns="addUserBtns"
      v-model:dialogFormVisible="state.addUserShow"
      @dialogBtnClick="hanleDetail2Click"
    />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref, computed, onMounted, reactive } from 'vue'
import { useUserApi } from '/@/api/admin/user'
import { ElMessage } from 'element-plus'
import moment from 'moment'
moment.locale('zh-cn')

const TableList = defineAsyncComponent(() => import('../../../components/tableList/index.vue'))
const Detail = defineAsyncComponent(() => import('./detail.vue'))
const Detail1 = defineAsyncComponent(() => import('./detail1.vue'))
const Detail2 = defineAsyncComponent(() => import('./detail2.vue'))
const userApi = useUserApi()

const tableData = computed((): TableData => {
  return {
    // 切换标签，动态生成（传空数组时，将不显示搜索，注意格式）
    tabs: [],
    btns: [
      {
        id: 1,
        title: '新增用户',
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
        title: '用户id',
        type: 'text',
        isCheck: true
      },
      {
        key: 'col2',
        colWidth: '',
        title: '用户名',
        type: 'text',
        isCheck: true
      },
      {
        key: 'col3',
        colWidth: '',
        title: '注册时间',
        type: 'text',
        isCheck: true
      },
      {
        key: 'col4',
        colWidth: '',
        title: '角色',
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
      operateWidth: 200,
      isExportBtnShow: false // 是否显示导出组件
    },
    operations: [
      {
        id: 1,
        name: '修改密码',
        // path: ''
        click: true
      },
      {
        id: 2,
        name: '编辑',
        // path: ''
        click: true
      },
      {
        id: 3,
        name: '删除',
        // path: ''
        click: true
      }
    ],
    // 搜索表单，动态生成（传空数组时，将不显示搜索，注意格式）
    search: [
      {
        label: '用户名',
        prop: 'val1',
        placeholder: '按用户名查找',
        required: true,
        type: 'input',
        width: 75
      }
    ],
    // 搜索参数（不用传，用于分页、搜索时传给后台的值，`getTableData` 中使用）
    page: {
      pageNum: pageData.pageNumber,
      pageSize: pageData.pageSize
    }
  }
})

// 编辑部分
const state = reactive({
  editPwdShow: false,
  editUserShow: false,
  addUserShow: false
})

const editPwdId = ref(0)
const editUserId = ref(0)
const editUserData = reactive({
  username: '',
  role: ''
})

const handleOperationsClick = (id: number, row: EmptyObjectType) => {
  if (id === 1) {
    state.editPwdShow = true
    editPwdId.value = row.col1
  } else if (id === 2) {
    editUserId.value = row.col1
    editUserData.username = row.col2
    editUserData.role = row.col4
    state.editUserShow = true
  }
}

// 删除
const delRow = async (row: EmptyObjectType) => {
  console.log(row)
  await userApi.delUser(row?.col1).then((res) => {
    if (res.status === 200) {
      ElMessage.success('刪除成功！')
    } else {
      ElMessage.warning(res.message)
    }
    getListData()
  })
}

const editPwdBtns = [
  {
    id: 1,
    title: '确认',
    type: 'primary',
    click: true
  }
]

const editUserBtns = [
  {
    id: 1,
    title: '确认',
    type: 'primary',
    click: true
  }
]

const addUserBtns = [
  {
    id: 1,
    title: '确认',
    type: 'primary',
    click: true
  }
]
const hanleDetailClick = async (id: number, form: any) => {
  if (id === 1) {
    await userApi.changePwd(editPwdId.value, { password: form.pass }).then((res) => {
      if (res.status === 200) {
        ElMessage.success('密码修改成功！')
      } else {
        ElMessage.warning(res.message)
      }
      state.editPwdShow = false
      getListData()
    })
  }
}
const hanleDetail1Click = async (id: number, form: any) => {
  console.log(id, form)
  if (id === 1) {
    await userApi
      .editUser(editUserId.value, { username: form.username, role: form.role === '管理员' ? 1 : 2 })
      .then((res) => {
        if (res.status === 200) {
          ElMessage.success('修改成功！')
        } else {
          ElMessage.warning(res.message)
        }
        state.editUserShow = false
        getListData()
      })
  }
}
const hanleDetail2Click = async (id: number, form: any) => {
  if (id === 1) {
    await userApi
      .addUser({
        username: form.username,
        password: form.pass,
        role: form.role === '管理员' ? 1 : 2
      })
      .then((res) => {
        if (res.status === 200) {
          ElMessage.success('添加成功！')
        } else {
          ElMessage.warning(res.message)
        }
        state.addUserShow = false
        getListData()
      })
  }
}
const handleBtnClick = (id: number) => {
  if (id === 1) {
    state.addUserShow = true
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

const getListData = async (username?: string) => {
  const params = { pagenum: pageData.pageNumber, pagesize: pageData.pageSize }

  isLoading.value = true
  await userApi.getUsers({ ...params, username: username || '' }).then((res) => {
    const userData: EmptyArrayType = []
    if (res?.data) {
      res.data?.forEach((item: any) => {
        userData.push({
          col1: item.ID,
          col2: item.username,
          col3: moment(item.CreatedAt).format('YYYY-MM-DD HH:mm:ss'),
          col4: item.role === 1 ? '管理员' : '普通用户'
        })
      })
    }
    data.value = userData
    pageData.total = res.total
    isLoading.value = false
  })
}
onMounted(() => {
  getListData()
})
</script>

<style scoped lang="scss"></style>

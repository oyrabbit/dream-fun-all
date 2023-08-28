import { defineStore } from 'pinia'

/**
 * 表格列表组件
 * @methods setRoutesList 设置路由数据
 * @methods setColumnsMenuHover 设置分栏布局菜单鼠标移入 boolean
 * @methods setColumnsNavHover 设置分栏布局最左侧导航鼠标移入 boolean
 */
export const useTableList = defineStore('tableList', {
  state: (): TableListState => ({
    header: [], // 表头内容
    operations: [],
    data: [], // 列表内容
    config: {}, // 配置项
    page: {
      pageNum: 1,
      pageSize: 10
    },
    selectlist: [],
    checkListAll: true,
    checkListIndeterminate: false,
    form: {},
    isToggle: false,
    tabId: ''
  }),
  actions: {
    // tool 列显示全选改变时
    onCheckAllChange<T>(val: T) {
      if (val) {
        this.header.forEach((v) => (v.isCheck = true))
      } else {
        this.header.forEach((v) => (v.isCheck = false))
      }
      this.checkListIndeterminate = false
    },
    // tool 列显示当前项改变时
    onCheckChange() {
      const headers = this.header.filter((v) => v.isCheck).length
      this.checkListAll = headers === this.header.length
      this.checkListIndeterminate = headers > 0 && headers < this.header.length
    }
  }
})

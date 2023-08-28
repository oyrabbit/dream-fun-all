/**
 * views personal
 */
type NewInfo = {
  title: string
  date: string
  link: string
}
type Recommend = {
  title: string
  msg: string
  icon: string
  bg: string
  iconColor: string
}
declare type PersonalState = {
  newsInfoList: NewInfo[]
  recommendList: Recommend[]
  personalForm: {
    name: string
    email: string
    autograph: string
    occupation: string
    phone: string
    sex: string
  }
}

/**
 * views visualizing
 */
declare type Demo2State<T = any> = {
  time: {
    txt: string
    fun: number
  }
  dropdownList: T[]
  dropdownActive: string
  skyList: T[]
  dBtnList: T[]
  chartData4Index: number
  dBtnActive: number
  earth3DBtnList: T[]
  chartData4List: T[]
  myCharts: T[]
}

/**
 * views params
 */
declare type ParamsState = {
  value: string
  tagsViewName: string
  tagsViewNameIsI18n: boolean
}

/**
 * views system
 */
// role
declare interface RowRoleType {
  roleName: string
  roleSign: string
  describe: string
  sort: number
  status: boolean
  createTime: string
}

interface SysRoleTableType extends TableType {
  data: RowRoleType[]
}

declare interface SysRoleState {
  tableData: SysRoleTableType
}

declare type TreeType = {
  id: number
  label: string
  children?: TreeType[]
}

// user
declare type RowUserType<T = any> = {
  userName: string
  userNickname: string
  roleSign: string
  department: string[]
  phone: string
  email: string
  sex: string
  password: string
  overdueTime: T
  status: boolean
  describe: string
  createTime: T
}

interface SysUserTableType extends TableType {
  data: RowUserType[]
}

declare interface SysUserState {
  tableData: SysUserTableType
}

declare type DeptTreeType = {
  deptName: string
  createTime: string
  status: boolean
  sort: number
  describe: string
  id: number | string
  children?: DeptTreeType[]
}

// dept
declare interface RowDeptType extends DeptTreeType {
  deptLevel: string[]
  person: string
  phone: string
  email: string
}

interface SysDeptTableType extends TableType {
  data: DeptTreeType[]
}

declare interface SysDeptState {
  tableData: SysDeptTableType
}

// dic
type ListType = {
  id: number
  label: string
  value: string
}

declare interface RowDicType {
  dicName: string
  fieldName: string
  describe: string
  status: boolean
  createTime: string
  list: ListType[]
}

interface SysDicTableType extends TableType {
  data: RowDicType[]
}

declare interface SysDicState {
  tableData: SysDicTableType
}

/**
 * views pages
 */
//  filtering
declare type FilteringChilType = {
  id: number | string
  label: string
  active: boolean
}

declare type FilterListType = {
  img: string
  title: string
  evaluate: string
  collection: string
  price: string
  monSales: string
  id: number | string
  loading?: boolean
}

declare type FilteringRowType = {
  title: string
  isMore: boolean
  isShowMore: boolean
  id: number | string
  children: FilteringChilType[]
}

// tableRules
declare type TableRulesHeaderType = {
  prop: string
  width: string | number
  label: string
  isRequired?: boolean
  isTooltip?: boolean
  type: string
}

declare type TableRulesState = {
  tableData: {
    data: EmptyObjectType[]
    header: TableRulesHeaderType[]
    option: SelectOptionType[]
  }
}

declare type TableRulesOneProps = {
  name: string
  email: string
  autograph: string
  occupation: string
}

// tree
declare type RowTreeType = {
  id: number
  label: string
  label1: string
  label2: string
  isShow: boolean
  children?: RowTreeType[]
}

// workflow index
declare type NodeListState = {
  id: string | number
  nodeId: string | undefined
  class: HTMLElement | string
  left: number | string
  top: number | string
  icon: string
  name: string
}

declare type LineListState = {
  sourceId: string
  targetId: string
  label: string
}

declare type XyState = {
  x: string | number
  y: string | number
}

declare type WorkflowState<T = any> = {
  leftNavList: T[]
  dropdownNode: XyState
  dropdownLine: XyState
  isShow: boolean
  jsPlumb: T
  jsPlumbNodeIndex: null | number
  jsplumbDefaults: T
  jsplumbMakeSource: T
  jsplumbMakeTarget: T
  jsplumbConnect: T
  jsplumbData: {
    nodeList: NodeListState[]
    lineList: LineListState[]
  }
}

// workflow drawer
declare type WorkflowDrawerNodeState<T = any> = {
  node: { [key: string]: T }
  nodeRules: T
  form: T
  tabsActive: string
  loading: {
    extend: boolean
  }
}

declare type WorkflowDrawerLabelType = {
  type: string
  label: string
}

declare type WorkflowDrawerState<T = any> = {
  isOpen: boolean
  nodeData: {
    type: string
  }
  jsplumbConn: T
}

/**
 * views make
 */
// tableDemo
declare type TableDemoPageType = {
  pageNum: number
  pageSize: number
}

// 表格列配置
declare type TableHeaderType = {
  key: string // 列的标识，必须唯一
  title: string // 列名
  type: 'text' | 'bool' | 'progress' | 'image' | 'status' // text：文本  bool：是或否  propgress：进度条  image：图片  status：状态
  colWidth: string // 列宽度，值为纯数字文本
  width?: string | number // 图片宽度，type为 image 时有效
  height?: string | number // 图片高度，type为 image 时有效
  isCheck: boolean // 列是否显示
  fixed?: boolean | 'left' | 'right' // 列是否固定
  sortable?: boolean // 列是否显示排序按钮
  align?: 'left' | 'center' | 'right' // 列的对齐方式
}

// 列表搜索配置
declare type TableSearchType = {
  label: string // 搜索项名称
  prop: string // 搜索项标签，必须唯一
  width: string | number // 搜索标签宽度
  placeholder: string // 搜索项占位符
  required: boolean // 是否必填
  type: 'input' | 'date' | 'select' | '' // 搜索项类型，目前支持输入框、日期选择器、下拉框
  options?: SelectOptionType[] // 下拉框配置参数，类型为'select'时有效
}

declare type TableData<T = any> = {
  // 切换标签，动态生成（传空数组时，将不显示）
  tabs: string[]
  // 表格右上角操作按钮
  btns: {
    id: number // 按钮id，值必须唯一
    title: string // 按钮名称
    path?: string // 跳转路径
    click?: boolean // 是否监听点击事件
  }[]
  // 表格数据
  data: {
    [key: string]: T // 键值为各列的prop名称
  }[]
  // 表格列配置
  header: TableHeaderType[]
  // 表格总配置
  config: {
    total: number // 列表数据总数
    loading: boolean // 是否显示loading 加载
    isBorder: boolean // 是否显示表格边框
    isSelection: boolean // 是否显示表格序号
    isSerialNo: boolean // 是否显示表格多选
    isOperate: boolean // 是否显示表格操作栏
    operateWidth: number // 操作栏宽度
    isExportBtnShow: boolean // 是否显示左上角导出按钮
  }
  // 操作列配置
  operations: {
    id: number // 按钮id，值唯一
    name: string // 按钮名称
    path?: string // 按钮跳转链接
    click?: boolean // 是否监听按钮点击事件
  }[]
  // 搜索表单，动态生成（传空数组时，将不显示搜索）
  search: TableSearchType[]
  // 分页配置
  page: {
    pageNum: Number // 默认当前页数
    pageSize: Number // 默认每页大小
  }
}

declare type FormOptions<T = any> = {
  title: string // 表单名称
  formTitle?: string // 表单小标题
  subName: string // 提交按钮名称
  type: 'outline' | 'inline' // 表单布局方式：outline每一项都换行，inline在一行占满时才换行
  formData: {
    label: string // 表单项名称
    prop: string // 表单项标识，必须唯一
    value?: T // 表单项默认值
    placeholder: string // 表单占位符
    clearable: boolean // 是否可清除
    disabled: boolean // 是否禁用
    required: boolean //是否必填
    type:
      | 'input'
      | 'year'
      | 'month'
      | 'date'
      | 'dates'
      | 'datetime'
      | 'week'
      | 'datetimerange'
      | 'daterange'
      | 'monthrange'
      | 'yearRange'
      | 'baiduMap'
      | 'select'
      | 'textarea'
      | 'datePicker'
      | 'checkbox'
      | 'uploadImage'
      | 'uploadVideo'
      | 'other'
      | ''
    // 表单类型
    options?: SelectOptionType[] // 类型为 'checkbox' 和 'select' 时有效
    right?: string // 右侧单位，类型为 'input' 时有效
    isShow: boolean // 是否显示
    // 自适应配置
    xs: number
    sm: number
    md: number
    lg: number
    xl: number
  }[]
}

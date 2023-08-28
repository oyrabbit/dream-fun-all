<template>
  <div class="table-container">
    <el-table
      :data="data"
      :border="setBorder"
      v-bind="$attrs"
      row-key="id"
      stripe
      style="width: 100%"
      v-loading="config.loading"
      @selection-change="onSelectionChange"
    >
      <el-table-column
        type="selection"
        :reserve-selection="true"
        width="30"
        v-if="config.isSelection"
        fixed="left"
      />
      <el-table-column type="index" label="序号" width="60" v-if="config.isSerialNo" fixed="left" />
      <el-table-column
        v-for="(item, index) in setHeader"
        :key="index"
        show-overflow-tooltip
        :prop="item.key"
        :width="item.colWidth"
        :label="item.title"
        :fixed="item.fixed"
        :sortable="item.sortable"
        :align="item.align || 'left'"
      >
        <template v-slot="scope">
          <template v-if="item.type === 'image'">
            <img :src="scope.row[item.key]" :width="item.width" :height="item.height" />
          </template>
          <template v-else-if="item.type === 'bool'">
            <div class="slot-bool">
              <div
                :class="{
                  'point-yes': isBool(scope.row[item.key]),
                  'point-no': !isBool(scope.row[item.key])
                }"
              ></div>
              <span v-if="isBool(scope.row[item.key])">是</span>
              <span v-if="!isBool(scope.row[item.key])">否</span>
            </div>
          </template>
          <template v-else-if="item.type === 'progress'">
            <div class="slot-progress">
              <el-progress :percentage="Number(scope.row[item.key])" />
            </div>
          </template>
          <template v-else-if="item.type === 'status'">
            <div class="slot-status">
              <el-tag :type="scope.row[item.key].type">{{ scope.row[item.key].name }}</el-tag>
            </div>
          </template>
          <template v-else>
            {{ scope.row[item.key] }}
          </template>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        :width="config.operateWidth"
        v-if="config.isOperate"
        fixed="right"
        align="center"
      >
        <template v-slot="scope">
          <el-button
            text
            type="primary"
            @click="() => handleOperationsClick(item, scope.row)"
            v-for="(item, index) in operations.filter((k) => k.name !== '删除')"
            :key="index"
            >{{ item.name }}</el-button
          >
          <el-popconfirm
            title="确定删除吗？"
            @confirm="onDelRow(scope.row)"
            v-if="operations.find((item) => item.name === '删除')"
          >
            <template #reference>
              <el-button text type="primary">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="暂无数据" />
      </template>
    </el-table>
    <div class="table-footer mt15">
      <el-pagination
        v-model:current-page="page.pageNum"
        v-model:page-size="page.pageSize"
        :pager-count="5"
        :page-sizes="[10, 20, 30]"
        :total="config.total"
        layout="total, sizes, prev, pager, next, jumper"
        background
        @size-change="onHandleSizeChange"
        @current-change="onHandleCurrentChange"
      >
      </el-pagination>
      <div class="table-footer-tool">
        <SvgIcon name="iconfont icon-yunxiazai_o" :size="22" title="导出" @click="onImportTable" />
        <SvgIcon name="iconfont icon-shuaxin" :size="22" title="刷新" @click="onRefreshTable" />
        <el-popover
          placement="top-end"
          trigger="click"
          transition="el-zoom-in-top"
          popper-class="table-tool-popper"
          :width="300"
          :persistent="false"
          @show="onSetTable"
        >
          <template #reference>
            <SvgIcon name="iconfont icon-quanjushezhi_o" :size="22" title="设置" />
          </template>
          <template #default>
            <div class="tool-box">
              <el-tooltip content="拖动进行排序" placement="top-start">
                <SvgIcon name="fa fa-question-circle-o" :size="17" class="ml11" color="#909399" />
              </el-tooltip>
              <el-checkbox
                v-model="checkListAll"
                :indeterminate="checkListIndeterminate"
                class="ml10 mr1"
                label="列显示"
                @change="onCheckAllChange"
              />
              <el-checkbox v-model="config.isSerialNo" class="ml12 mr1" label="序号" />
              <el-checkbox v-model="config.isSelection" class="ml12 mr1" label="多选" />
            </div>
            <el-scrollbar>
              <div ref="toolSetRef" class="tool-sortable">
                <div class="tool-sortable-item" v-for="v in header" :key="v.key" :data-key="v.key">
                  <i class="fa fa-arrows-alt handle cursor-pointer"></i>
                  <el-checkbox
                    v-model="v.isCheck"
                    size="default"
                    class="ml12 mr8"
                    :label="v.title"
                    @change="onCheckChange"
                  />
                </div>
              </div>
            </el-scrollbar>
          </template>
        </el-popover>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="netxTable">
import { computed, nextTick, ref } from 'vue'
import { ElMessage } from 'element-plus'
import table2excel from 'js-table2excel'
import router from '/@/router'
import Sortable from 'sortablejs'
import { storeToRefs } from 'pinia'
import { useThemeConfig } from '/@/stores/themeConfig'
import { useTableList } from '/@/stores/tableList'
import '/@/theme/tableTool.scss'

// 定义子组件向父组件传值/事件
const emit = defineEmits(['delRow', 'pageChange', 'sortHeader', 'operationsClick'])

// 定义变量内容
const toolSetRef = ref()
const storesThemeConfig = useThemeConfig()
const storesTableList = useTableList()
const { themeConfig } = storeToRefs(storesThemeConfig)
const { data, page, config, header, operations, checkListAll, checkListIndeterminate } =
  storeToRefs(storesTableList)

// 操作按钮事件
const handleOperationsClick = (item: EmptyObjectType, row: EmptyObjectType) => {
  if (item.path) {
    router.push(item.path)
  } else if (item.click) {
    emit('operationsClick', item.id, row)
  }
}

// 设置边框显示/隐藏
const setBorder = computed(() => {
  return storesTableList.config.isBorder ? true : false
})

// slot布尔类型判断
const isBool = (val: any) => {
  if (['是', 1, '1'].includes(val)) {
    return true
  } else if (['否', 0, '0'].includes(val)) {
    return false
  }
}

// 设置 tool header 数据
const setHeader = computed(() => {
  return storesTableList.header.filter((v: any) => v.isCheck)
})

// tool 列显示全选改变时
const onCheckAllChange = <T>(val: T) => {
  if (val) storesTableList.header.forEach((v) => (v.isCheck = true))
  else storesTableList.header.forEach((v) => (v.isCheck = false))
  storesTableList.checkListIndeterminate = false
}
// tool 列显示当前项改变时
const onCheckChange = () => {
  const headers = storesTableList.header.filter((v) => v.isCheck).length
  storesTableList.checkListAll = headers === storesTableList.header.length
  storesTableList.checkListIndeterminate = headers > 0 && headers < storesTableList.header.length
}
// 表格多选改变时，用于导出
const onSelectionChange = (val: EmptyObjectType[]) => {
  storesTableList.selectlist = val
}
// 删除当前项
const onDelRow = (row: EmptyObjectType) => {
  emit('delRow', row)
}
// 分页改变
const onHandleSizeChange = (val: number) => {
  storesTableList.page.pageSize = val
  console.log(storesTableList.config.total)
  emit('pageChange', storesTableList.page)
}
// 分页改变
const onHandleCurrentChange = (val: number) => {
  storesTableList.page.pageNum = val
  emit('pageChange', storesTableList.page)
}
// 搜索时，分页还原成默认
const pageReset = () => {
  storesTableList.page = { pageNum: 1, pageSize: 20 }
  emit('pageChange', storesTableList.page)
}
// 导出
const onImportTable = () => {
  if (storesTableList.selectlist.length <= 0) return ElMessage.warning('请先选择要导出的数据')
  console.log(storesTableList.header, storesTableList.selectlist)

  table2excel(
    storesTableList.header,
    storesTableList.selectlist,
    `${themeConfig.value.globalTitle} ${new Date().toLocaleString()}`
  )
}
// 刷新
const onRefreshTable = () => {
  emit('pageChange', storesTableList.page)
}
// 设置
const onSetTable = () => {
  nextTick(() => {
    const sortable = Sortable.create(toolSetRef.value, {
      handle: '.handle',
      dataIdAttr: 'data-key',
      animation: 150,
      onEnd: () => {
        const headerList: EmptyObjectType[] = []
        sortable.toArray().forEach((val) => {
          storesTableList.header.forEach((v) => {
            if (v.key === val) headerList.push({ ...v })
          })
        })
        emit('sortHeader', headerList)
      }
    })
  })
}

// 暴露变量
defineExpose({
  pageReset,
  onImportTable
})
</script>

<style scoped lang="scss">
.table-container {
  display: flex;
  flex-direction: column;
  .el-table {
    flex: 1;
  }
  .table-footer {
    display: flex;
    .table-footer-tool {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      i {
        margin-right: 10px;
        cursor: pointer;
        color: var(--el-text-color-regular);
        &:last-of-type {
          margin-right: 0;
        }
      }
    }
  }
}
.slot-bool {
  display: flex;
  align-items: center;
  justify-content: center;
  .point-yes {
    width: 10px;
    height: 10px;
    background: #72c140;
    border-radius: 50%;
  }
  .point-no {
    width: 10px;
    height: 10px;
    background: #478ce9;
    border-radius: 50%;
  }
  span {
    margin-left: 11px;
  }
}
</style>

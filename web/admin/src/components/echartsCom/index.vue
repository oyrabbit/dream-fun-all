<template>
  <div :id="chartId" :style="getChartStyle"></div>
</template>

<script name="MyCharts" lang="ts" setup>
import {
  ref,
  shallowRef,
  computed,
  watch,
  inject,
  onMounted,
  onBeforeUnmount,
  getCurrentInstance,
  PropType
} from 'vue'
import { debounce } from 'lodash'
const { proxy } = getCurrentInstance() as any

const props = defineProps({
  options: {
    type: Object,
    default: () => {
      return {}
    }
  },
  height: {
    type: Number,
    default: 300
  },
  // 是否不跟之前的传入值合并
  notMerge: {
    type: Boolean,
    default: true
  }
})

const emits = defineEmits(['chart-click'])

const getChartStyle = computed(() => {
  return {
    width: '100%',
    height: `${props.height}px`
  }
})

// 默认显示的图表配置数据
const defaultOptions = {
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['Email', 'Union Ads']
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: 'Email',
      type: 'line',
      smooth: true,
      stack: 'Total',
      data: [120, 132, 101, 134, 90, 230, 210]
    },
    {
      name: 'Union Ads',
      type: 'line',
      smooth: true,
      stack: 'Total',
      data: [220, 182, 191, 234, 290, 330, 310]
    }
  ]
}

const getRandomStr = () => {
  const randomNumStr = String(Math.random()).split('.')[1]
  return randomNumStr
}

const chartId = ref('chart-id')
const getChartId = () => {
  const str = 'chart-id-' + getRandomStr()
  chartId.value = str
}

getChartId()

const resizeHandler = () => {
  eChartsRef.value.resize()
}

// const resizeHandlerOrigin = debounce(resizeHandler, 100)

const eCharts: any = inject('echarts')
const eChartsRef = shallowRef<any>()
const initChart = () => {
  eChartsRef.value = eCharts.init(document.getElementById(chartId.value))
  let options = {}
  if (isEmptyObj(props.options)) {
    options = defaultOptions
  } else {
    options = props.options
  }
  eChartsRef.value.setOption(options, props.notMerge)
  window.addEventListener('resize', resizeHandler)
}

const isEmptyObj = (obj: any) => {
  return typeof obj === 'object' && JSON.stringify(obj) === '{}'
}

const initChartEvent = () => {
  cancelClickEvent()
  eChartsRef.value.on('click', (params: any) => {
    emits('chart-click', params)
  })
}

const cancelClickEvent = () => {
  eChartsRef.value.off('click')
}

onMounted(() => {
  initChart()
})

onBeforeUnmount(() => {
  cancelClickEvent()
  window.removeEventListener('resize', resizeHandler)
  eChartsRef.value.dispose()
})

watch(
  () => props.options,
  () => {
    initChart()
  },
  {
    deep: true
  }
)
</script>
<style lang="scss" scoped></style>

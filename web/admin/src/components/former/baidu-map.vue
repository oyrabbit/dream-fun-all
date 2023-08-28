<template>
  <div id="address">
    <el-input
      id="suggestId"
      v-model="address"
      style="width: 100%"
      :placeholder="placeholder"
      clearable
    />
  </div>
  <div id="map"></div>
</template>

<script setup lang="ts">
import loadBMap from '/@/utils/loadMap'
import { ref, watch } from 'vue'
const mapInit = loadBMap('BIXRKVmN0CznE3QnmgQsGyhAEcQR0IlP')

interface Props {
  placeholder: string
}

const { placeholder } = defineProps<Props>()

const lng = ref('')
const lat = ref('')
const address = ref('')

const emit = defineEmits(['update:address'])

watch(address, (address) => {
  emit('update:address', address)
})

mapInit.then((BMap: any) => {
  //创建地图实例,位于BMap命名空间下的Map类表示地图，通过new操作符可以创建一个地图实例。其参数可以是元素id也可以是元素对象。
  const map = new BMap.Map('map')
  map.centerAndZoom('上海', 12) // 初始化地图,设置城市和地图级别
  map.enableScrollWheelZoom(true) //开启鼠标滚轮缩放

  const ac = new BMap.Autocomplete({ input: 'suggestId', location: map }) //建立一个自动完成的对象
  ac.addEventListener('onconfirm', function (e: any) {
    //鼠标点击下拉列表后的事件
    const tempValue = e.item.value
    const searchValue =
      tempValue.province +
      tempValue.city +
      tempValue.district +
      tempValue.street +
      tempValue.business
    setPlace(BMap, map, searchValue)
  })
})
/**
 * 根据输入框的值在地图上添加标记点
 * @param
 *   BMap：地图对象
 *   searchValue：输入框下拉数据选中的值
 * **/
function setPlace(BMap: any, map: any, searchValue: any) {
  map.clearOverlays() //清除地图上所有覆盖物
  const local = new BMap.LocalSearch(map, {
    //智能搜索
    onSearchComplete: (res: any) => {
      const pp = local.getResults().getPoi(0).point //获取第一个智能搜索的结果
      map.centerAndZoom(pp, 21)
      map.addOverlay(new BMap.Marker(pp)) //添加标注
      movePoint(BMap, map, res.Ir[0].point)
    }
  })
  local.search(searchValue)
}
/**
 * 移动标记点
 * @param
 *   BMap：地图对象
 *   latlng：经纬度
 * **/
function movePoint(BMap: any, map: any, latlng: any) {
  map.clearOverlays() //清除地图上所有覆盖物
  //使用BMap命名空间下的Point类来创建一个坐标点
  const point = new BMap.Point(latlng.lng, latlng.lat)
  const marker = new BMap.Marker(point, {
    enableDragging: true
  })
  map.addOverlay(marker)
  latlngToAddress(BMap, latlng)

  // 覆盖物拖拽开始事件
  marker.addEventListener('dragstart', function (e: any) {
    // 清除一些覆盖物
    console.log('[开始]', e)
  })
  // 覆盖物拖拽事件
  marker.addEventListener('dragend', function () {
    const nowPoint = marker.getPosition() // 拖拽完成之后坐标的位置(经纬度)
    latlngToAddress(BMap, nowPoint)
  })
}
/**
 * 地址解析
 * @param
 *   BMap：地图对象
 *   latlng：经纬度
 * **/
function latlngToAddress(BMap: any, latlng: any) {
  const geoc = new BMap.Geocoder()
  geoc.getLocation(latlng, function (rs: any) {
    console.log(rs.surroundingPois[0])
    address.value = rs.surroundingPois[0].address + rs.surroundingPois[0].title
    lat.value = rs.surroundingPois[0].point.lat
    lng.value = rs.surroundingPois[0].point.lng
  })
}
</script>

<style lang="scss" scoped>
#address {
  width: 100%;
  margin-bottom: 20px;
}
#map {
  width: 100%;
  height: 400px;
}
#suggestId {
  margin-bottom: 20px;
}
</style>

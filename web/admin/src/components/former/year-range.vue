<template>
  <div class="year-range-picker">
    <el-select
      v-model="startYear"
      placeholder="开始年份"
      size="default"
      @change="validateYearRange"
    >
      <el-option v-for="year in yearOptions" :key="year" :label="year.label" :value="year.value" />
    </el-select>
    <span class="range-separator">-</span>
    <el-select
      v-model="endYear"
      placeholder="结束年份"
      size="default"
      :disabled="startYear === ''"
      @change="validateYearRange"
    >
      <el-option v-for="year in yearOptions" :key="year" :label="year.label" :value="year.value" />
    </el-select>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, reactive } from 'vue'

const years = reactive<string[]>([new Date().getFullYear() + '', ''])

const emit = defineEmits(['update:year'])

const startYear = ref<string>(years[0])
const endYear = ref<string>(years[1])

watch([startYear, endYear], ([start, end]) => {
  emit('update:year', [start, end])
})

const yearOptions = computed(() => {
  const currentYear = new Date().getFullYear()
  const options = []
  for (let year = currentYear - 5; year <= currentYear + 10; year++) {
    options.push({ label: year.toString(), value: year.toString() })
  }
  return options
})

const validateYearRange = () => {
  if (startYear.value === '' || endYear.value === '') {
    return
  }

  const start = parseInt(startYear.value)
  const end = parseInt(endYear.value)
  if (isNaN(start) || isNaN(end) || end < start) {
    startYear.value = ''
    endYear.value = ''
  }
}
</script>

<style scoped>
.year-range-picker {
  display: flex;
}

.range-separator {
  margin: 0 10px;
}
</style>

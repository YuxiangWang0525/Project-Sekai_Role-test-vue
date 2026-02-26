<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { Chart } from '@antv/g2'
import type { ExtendedMatchResult } from '@/stores/test'

interface Props {
  matches: ExtendedMatchResult[]
  onCharacterSelect?: (match: ExtendedMatchResult) => void
}

const props = defineProps<Props>()

const chartRef = ref<HTMLDivElement | null>(null)
let chart: Chart | null = null

function initChart() {
  if (!chartRef.value || props.matches.length === 0) return

  chart = new Chart({
    container: chartRef.value,
    autoFit: true,
    height: 300,
    padding: 'auto'
  })
  // 准备数据 - 使用你提供的数据格式
  const data = props.matches.map(match => ({
    name: match.character.name || '未知角色',
    percentage: match.percentage || 0,
    color: match.character.color || '#CCCCCC',
    match: match
  }))
  console.log('图表数据:', data)
  console.log('颜色映射:', data.map(d => ({ name: d.name, color: d.color })))

  // 创建简单的垂直条形图，保持数据顺序
  chart
    .interval()
    .data(data)
    .encode('x', 'name')
    .encode('y', 'percentage')
    .encode('color', 'name') // 使用名称作为颜色映射的键
    .scale('color', {
      domain: data.map(d => d.name),
      range: data.map(d => d.color)
    })
    .coordinate({ transform: [{ type: 'transpose' }] })
    .axis('x', {
      title: null,
      label: {
        autoHide: true,
        autoEllipsis: true
      }
    })
    .axis('y', {
      title: null,
      label: {
        formatter: (d: any) => `${d}%`
      }
    })
    .legend(true)
    .tooltip({
      title: 'name',
      items: [
        {
          channel: 'y',
          valueFormatter: (d) => `${d}%`
        }
      ]
    })

  // 添加点击事件
  chart.on('interval:click', (event) => {
    const { data: clickedData } = event
    if (clickedData && props.onCharacterSelect) {
      const match = data.find(d => d.name === clickedData.name)?.match
      if (match) {
        props.onCharacterSelect(match)
      }
    }
  })

  chart.render()
}

function updateChart() {
  if (!chart) return

  const data = props.matches.map(match => ({
    name: match.character.name || '未知角色',
    percentage: match.percentage || 0,
    color: match.character.color || '#CCCCCC',
    match: match
  }))
  console.log('更新图表数据:', data)
  console.log('更新颜色映射:', data.map(d => ({ name: d.name, color: d.color })))

  // 清除之前的配置并重新设置
  chart.clear()

  chart
    .interval()
    .data(data)
    .encode('x', 'name')
    .encode('y', 'percentage')
    .encode('color', 'color')
    .axis('x', {
      title: null,
      label: {
        autoHide: true,
        autoEllipsis: true
      }
    })
    .axis('y', {
      title: null,
      label: {
        formatter: (d: any) => `${d}%`
      }
    })
    .legend(false)
    .tooltip({
      title: 'name',
      items: [
        {
          channel: 'y',
          valueFormatter: (d) => `${d}%`
        }
      ]
    })

  // 重新添加点击事件
  chart.on('interval:click', (event) => {
    const { data: clickedData } = event
    if (clickedData && props.onCharacterSelect) {
      const match = data.find(d => d.name === clickedData.name)?.match
      if (match) {
        props.onCharacterSelect(match)
      }
    }
  })

  chart.render()
}
watch(() => props.matches, () => {
  if (props.matches.length > 0) {
    if (chart) {
      updateChart()
    } else {
      initChart()
    }
  }
}, { deep: true })

onMounted(() => {
  if (props.matches.length > 0) {
    initChart()
  }
})

onUnmounted(() => {
  if (chart) {
    chart.destroy()
    chart = null
  }
})
</script>

<template>
  <div class="bar-chart-container">
    <h3 class="chart-title">其他高匹配角色</h3>
    <div v-if="matches.length > 0" ref="chartRef" class="chart-wrapper"></div>
    <div v-else class="no-data">
      暂无其他高匹配角色
    </div>
  </div>
</template>

<style scoped>
.bar-chart-container {
  margin: 25px 0;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.chart-title {
  font-size: 18px;
  font-weight: bold;
  color: #4A4A6A;
  margin-bottom: 15px;
  text-align: center;
  font-family: '黑体', sans-serif;
}

.chart-wrapper {
  width: 100%;
  height: 350px;
}

.no-data {
  text-align: center;
  color: #888;
  font-size: 16px;
  padding: 40px 0;
  font-family: '黑体', sans-serif;
}
</style>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { Chart } from '@antv/g2'

interface Props {
  percentage: number
  color: string
}

const props = defineProps<Props>()
const chartRef = ref<HTMLDivElement | null>(null)
let chart: Chart | null = null

function initChart() {
  if (!chartRef.value) return

  chart = new Chart({
    container: chartRef.value,
    autoFit: true,
    height: 200,
    padding: 0
  })

  // 创建环形图数据
  const data = [
    { type: 'matched', value: props.percentage },
    { type: 'unmatched', value: 100 - props.percentage }
  ]

  chart
    .interval()
    .data(data)
    .encode('y', 'value')
    .encode('color', 'type')
    .coordinate({ type: 'theta', innerRadius: 0.7 })
    .scale('color', {
      range: [props.color, '#e0e0e0']
    })
    .legend(false)
    .axis(false)
    .tooltip(false)
    .animate('enter', { type: 'waveIn', duration: 1000 })
    .animate('update', { type: 'morphing', duration: 800 })

  chart.render()
}

function updateChart() {
  if (chart) {
    chart.destroy()
    chart = null
  }
  console.log('updateChart')
  initChart()
}

watch([() => props.percentage, () => props.color], () => {
  updateChart()
})

onMounted(() => {
  initChart();
})

onUnmounted(() => {
  if (chart) {
    chart.destroy()
    chart = null
  }
})
</script>

<template>
  <div class="percentage-chart-container">
    <div ref="chartRef" class="chart-wrapper"></div>
    <div class="percentage-text" :style="{ color: color }">
      {{ percentage }}%
    </div>
  </div>
</template>

<style scoped>
.percentage-chart-container {
  position: relative;
  width: 200px;
  height: 200px;
  margin: 25px auto;
}

.chart-wrapper {
  width: 100%;
  height: 100%;
}

.percentage-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 48px;
  font-weight: bold;
  font-family: '黑体', sans-serif;
  pointer-events: none;
}
</style>

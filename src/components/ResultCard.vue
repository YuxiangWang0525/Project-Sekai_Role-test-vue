<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import html2canvas from 'html2canvas'
import type { MatchResult } from '@/data'

interface Props {
  matchResult: MatchResult
  showAnimation: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'retry'): void
  (e: 'share'): void
}>()

const currentPercentage = ref(0)
const circumference = 2 * Math.PI * 88

watch(() => props.showAnimation, (newVal) => {
  if (newVal) {
    animatePercentage()
  }
})

function animatePercentage() {
  const target = props.matchResult.percentage
  const duration = 1000
  const startTime = Date.now()
  
  const step = () => {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)
    const easeOut = 1 - Math.pow(1 - progress, 4)
    currentPercentage.value = Math.floor(target * easeOut)
    
    if (progress < 1) {
      requestAnimationFrame(step)
    }
  }
  
  requestAnimationFrame(step)
}

async function handleShare() {
  try {
    const resultCard = document.querySelector('.test-card') as HTMLElement
    if (resultCard) {
      const canvas = await html2canvas(resultCard, {
        backgroundColor: '#f5f0ff',
        scale: 2,
        useCORS: true
      })
      
      // 创建下载链接
      const link = document.createElement('a')
      link.download = `世界计划角色结果_${new Date().getTime()}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
      
      // 同时复制到剪贴板（如果支持）
      if (navigator.clipboard && window.ClipboardItem) {
        canvas.toBlob(async (blob) => {
          if (blob) {
            try {
              await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob })
              ])
            } catch (err) {
              console.log('复制到剪贴板失败:', err)
            }
          }
        })
      }
    }
  } catch (err) {
    console.error('导出失败:', err)
    alert('导出失败，请重试')
  }
}
</script>

<template>
  <div class="test-card" id="result-card">
    <div 
      class="question-section" 
      :style="{ backgroundColor: matchResult.character.color }"
    >
      <div class="result-title">测试结果</div>
      <div class="result-character">你最像{{ matchResult.character.name }}！</div>
    </div>
    <div class="answer-section">
      <div class="percentage-ring-container">
        <svg class="percentage-ring-svg" viewBox="0 0 200 200">
          <circle class="percentage-ring-bg" cx="100" cy="100" r="88"></circle>
          <circle 
            class="percentage-ring-fill" 
            cx="100" 
            cy="100" 
            r="88"
            :stroke="matchResult.character.color"
            :stroke-dasharray="`${(currentPercentage / 100) * circumference} ${circumference}`"
            :stroke-dashoffset="0"
          ></circle>
        </svg>
        <div 
          class="percentage-text" 
          :style="{ color: matchResult.character.color }"
        >
          {{ currentPercentage }}%
        </div>
      </div>
      <div class="character-info">
        {{ matchResult.character.desc }}
      </div>
      <div class="result-buttons">
        <button class="test-button secondary-button" @click="$emit('retry')">
          重新测试
        </button>
        <button 
          class="test-button primary-button" 
          :style="{ backgroundColor: matchResult.character.color }"
          @click="handleShare"
        >
          分享结果
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.test-card {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.question-section {
  color: white;
  padding: 40px 30px;
  min-height: 25%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  transition: background-color 0.3s ease;
}

.result-title {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 15px;
  font-family: '黑体', sans-serif;
}

.result-character {
  font-size: 26px;
  font-weight: bold;
  margin: 25px 0;
  color: #4A4A6A;
  font-family: '黑体', sans-serif;
}

.answer-section {
  flex: 1;
  padding: 40px 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #f5f0ff;
}

.percentage-ring-container {
  position: relative;
  width: 200px;
  height: 200px;
  margin: 25px auto;
}

.percentage-ring-svg {
  transform: rotate(-90deg);
  width: 100%;
  height: 100%;
}

.percentage-ring-bg {
  fill: none;
  stroke: #e0e0e0;
  stroke-width: 12;
}

.percentage-ring-fill {
  fill: none;
  stroke-width: 12;
  stroke-linecap: round;
  transition: stroke-dasharray 1s ease;
}

.percentage-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 48px;
  font-weight: bold;
  font-family: '黑体', sans-serif;
  transition: color 0.3s ease;
}

.character-info {
  margin: 25px 0;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  border-left: 5px solid #5CE1E6;
  font-size: 16px;
  line-height: 1.7;
  color: #4A4A6A;
  font-family: '黑体', sans-serif;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  max-height: 300px;
  overflow-y: auto;
}

.result-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
}

.test-button {
  padding: 14px 35px;
  border: none;
  border-radius: 25px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: '黑体', sans-serif;
  min-width: 140px;
  text-align: center;
}

.primary-button {
  color: white;
  box-shadow: 0 4px 8px rgba(92, 225, 230, 0.3);
}

.primary-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(92, 225, 230, 0.4);
}

.secondary-button {
  background-color: white;
  color: #4A4A6A;
  border: 2px solid #e0e0e0;
}

.secondary-button:hover {
  background-color: #f5f5f5;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
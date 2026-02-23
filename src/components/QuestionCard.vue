<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Question } from '@/data'
import { VALUE_LABELS } from '@/data'

interface Props {
  question: Question
  dimensionName: string
  progress: string
  currentAnswer: number | null
  canGoNext: boolean
  canGoPrev: boolean
  isLastQuestion: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:answer', value: number): void
  (e: 'next'): void
  (e: 'prev'): void
  (e: 'exit'): void
}>()

const localAnswer = ref(props.currentAnswer ?? 3)

// 当组件挂载或题目切换时，确保设置默认值
import { onMounted } from 'vue'
onMounted(() => {
  // 如果当前题目没有答案，设置默认值3
  if (props.currentAnswer === null) {
    emit('update:answer', 3)
  }
})
const isDragging = ref(false)

// 监听props变化更新本地状态
watch(() => props.currentAnswer, (newVal) => {
  localAnswer.value = newVal ?? 3
  // 如果新值为null，设置默认值
  if (newVal === null) {
    emit('update:answer', 3)
  }
})

function updateAnswer(value: number) {
  localAnswer.value = Math.max(1, Math.min(5, value))
  emit('update:answer', localAnswer.value)
}

function handleMinus() {
  updateAnswer(localAnswer.value - 1)
}

function handlePlus() {
  updateAnswer(localAnswer.value + 1)
}

function handleTrackClick(event: MouseEvent) {
  const track = event.currentTarget as HTMLElement
  const rect = track.getBoundingClientRect()
  const percent = (event.clientX - rect.left) / rect.width
  const value = Math.round(1 + percent * 4)
  updateAnswer(value)
}

function handleMouseDown(event: MouseEvent) {
  isDragging.value = true
  handleMouseMove(event)
}

function handleMouseMove(event: MouseEvent) {
  if (!isDragging.value) return
  const track = (event.target as HTMLElement).closest('.slider-track') as HTMLElement
  if (track) {
    const rect = track.getBoundingClientRect()
    const percent = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width))
    const value = Math.round(1 + percent * 4)
    updateAnswer(value)
  }
}

function handleMouseUp() {
  isDragging.value = false
}

// 添加全局事件监听器
document.addEventListener('mousemove', handleMouseMove)
document.addEventListener('mouseup', handleMouseUp)

// 清理事件监听器
// 在组件卸载时需要移除，这里简化处理
</script>

<template>
  <div class="test-card" id="test-card">
    <div class="question-section">
      <div class="question-counter">{{ progress }} · 维度: {{ dimensionName }}</div>
      <div class="question-text">{{ question.text }}</div>
    </div>
    <div class="answer-section">
      <div class="slider-container">
        <div class="slider-label">请滑动选择你的符合程度</div>
        <div class="slider-controls">
          <button 
            class="control-btn" 
            :disabled="localAnswer <= 1"
            @click="handleMinus"
          >
            −
          </button>
          <div 
            class="slider-track" 
            @click="handleTrackClick"
            @mousedown="handleMouseDown"
          >
            <div 
              class="slider-fill" 
              :style="{ width: `${(localAnswer - 1) / 4 * 100}%` }"
            ></div>
            <div 
              class="slider-thumb" 
              :style="{ left: `${(localAnswer - 1) / 4 * 100}%` }"
            ></div>
          </div>
          <button 
            class="control-btn" 
            :disabled="localAnswer >= 5"
            @click="handlePlus"
          >
            +
          </button>
        </div>
        <div class="slider-value">{{ localAnswer }}</div>
        <div class="slider-value-label">{{ VALUE_LABELS[localAnswer - 1] }}</div>
      </div>
      <div class="navigation-buttons">
        <button 
          class="test-button secondary-button" 
          :disabled="!canGoPrev"
          @click="$emit('prev')"
        >
          上一题
        </button>
        <button 
          class="test-button primary-button" 
          :disabled="!canGoNext"
          @click="$emit('next')"
        >
          {{ isLastQuestion ? '查看结果' : '下一题' }}
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
  background-color: #5CE1E6;
  color: white;
  padding: 40px 30px;
  min-height: 25%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.question-counter {
  font-size: 18px;
  opacity: 0.9;
  font-family: '黑体', sans-serif;
  margin-bottom: 10px;
}

.question-text {
  font-size: 24px;
  font-weight: bold;
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

.slider-container {
  margin-bottom: 30px;
  background-color: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.slider-label {
  text-align: center;
  font-size: 18px;
  color: #4A4A6A;
  margin-bottom: 20px;
  font-family: '黑体', sans-serif;
  font-weight: bold;
}

.slider-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.control-btn {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border: 2px solid #e0e0e0;
  background-color: white;
  font-size: 24px;
  color: #4A4A6A;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  font-family: '黑体', sans-serif;
  font-weight: bold;
  user-select: none;
}

.control-btn:hover:not(:disabled) {
  background-color: #f5f5f5;
  transform: scale(1.05);
}

.control-btn:active:not(:disabled) {
  transform: scale(0.95);
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.slider-track {
  flex: 1;
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  position: relative;
  margin: 0 10px;
  cursor: pointer;
}

.slider-fill {
  height: 100%;
  background-color: #5CE1E6;
  border-radius: 4px;
  transition: width 0.1s;
  pointer-events: none;
}

.slider-thumb {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 24px;
  height: 24px;
  background-color: white;
  border: 3px solid #5CE1E6;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  transition: left 0.1s;
  pointer-events: none;
}

.slider-value {
  text-align: center;
  margin-top: 15px;
  font-size: 32px;
  color: #FF6B9D;
  font-weight: bold;
  font-family: '黑体', sans-serif;
}

.slider-value-label {
  text-align: center;
  font-size: 14px;
  color: #888;
  margin-top: 5px;
  font-family: '黑体', sans-serif;
}

.navigation-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
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
  background-color: #5CE1E6;
  color: white;
  box-shadow: 0 4px 8px rgba(92, 225, 230, 0.3);
}

.primary-button:hover:not(:disabled) {
  background-color: #4DD0D5;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(92, 225, 230, 0.4);
}

.primary-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.secondary-button {
  background-color: white;
  color: #4A4A6A;
  border: 2px solid #e0e0e0;
}

.secondary-button:hover:not(:disabled) {
  background-color: #f5f5f5;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.secondary-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
</style>
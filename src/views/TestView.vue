<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTestStore } from '@/stores/test'
import QuestionCard from '@/components/QuestionCard.vue'

const router = useRouter()
const testStore = useTestStore()

const isLoading = ref(true)

onMounted(() => {
  // 模拟加载动画
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
  
  // 检查是否有保存的进度
  if (testStore.hasSavedProgress() && !testStore.isCompleted) {
    // 有保存的未完成进度，加载它
    const loaded = testStore.loadProgress()
    console.log('加载保存的进度:', loaded, '当前索引:', testStore.currentIndex)
  } else if (testStore.currentIndex === 0 && !testStore.answers.some(a => a !== null)) {
    // 没有保存进度且是新开始，重置测试
    testStore.resetTest()
    console.log('重置测试')
  }
  console.log('测试页面挂载完成，当前索引:', testStore.currentIndex)
})

function handleNext() {
  if (testStore.canGoNext) {
    if (testStore.isLastQuestion) {
      testStore.completeTest()
      router.push('/result')
    } else {
      testStore.goToNext()
    }
  }
}

function handlePrev() {
  testStore.goToPrev()
}

function handleExit() {
  testStore.saveProgress()
  router.push('/')
}
</script>

<template>
  <div class="test-view">
    <!-- 加载动画 -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <p>加载中...</p>
      </div>
    </div>

    <!-- 测试卡片 -->
    <div v-else class="test-container">
      <QuestionCard
        :question="testStore.currentQuestion || { text: '', dim: 0 }"
        :dimension-name="testStore.dimensionName || '未知维度'"
        :progress="testStore.progress"
        :current-answer="testStore.answers[testStore.currentIndex] ?? null"
        :can-go-next="testStore.canGoNext"
        :can-go-prev="testStore.canGoPrev"
        :is-last-question="testStore.isLastQuestion"
        @update:answer="testStore.setAnswer"
        @next="handleNext"
        @prev="handlePrev"
        @exit="handleExit"
      />
    </div>
  </div>
</template>

<style scoped>
.test-view {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #e6e6fa 0%, #f0e6ff 100%);
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #e6e6fa 0%, #f0e6ff 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loading-content {
  text-align: center;
  color: #4A4A6A;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e0e0e0;
  border-top: 4px solid #5CE1E6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-content p {
  font-size: 18px;
  font-weight: bold;
}

.test-container {
  width: 100%;
  max-width: 800px;
  background-color: #f8f8f8;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}
</style>
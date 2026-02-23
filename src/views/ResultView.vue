<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTestStore } from '@/stores/test'
import ResultCard from '@/components/ResultCard.vue'

const router = useRouter()
const testStore = useTestStore()

const showAnimation = ref(false)

onMounted(() => {
  if (!testStore.isCompleted) {
    router.push('/')
    return
  }
  // 延迟显示动画效果
  setTimeout(() => {
    showAnimation.value = true
  }, 100)
})

function handleRetry() {
  testStore.resetTest()
  router.push('/')
}

async function handleShare() {
  // 分享功能将在ResultCard组件中实现
}
</script>

<template>
  <div class="result-view">
    <div class="artistic-decoration">
      <div class="artistic-text">
        <div class="text-line project-sekai">Project SEKAI</div>
        <div class="text-line colorful-stage">COLORFUL STAGE</div>
        <div class="text-line feat-miku">feat. HATSUNE MIKU</div>
      </div>
    </div>

    <div class="result-container">
      <ResultCard
        :match-result="testStore.matchResult"
        :show-animation="showAnimation"
        @retry="handleRetry"
        @share="handleShare"
      />
    </div>
  </div>
</template>

<style scoped>
.result-view {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #e6e6fa 0%, #f0e6ff 100%);
  position: relative;
}

.artistic-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.artistic-text {
  position: absolute;
  top: 80px;
  left: 80px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  user-select: none;
  z-index: 2;
}

.text-line {
  font-family: 'Arial Black', 'Arial Bold', Gadget, sans-serif;
  color: transparent;
  -webkit-text-stroke: 1.5px rgba(255, 255, 255, 0.7);
  text-stroke: 1.5px rgba(255, 255, 255, 0.7);
  line-height: 1;
  margin-bottom: 5px;
  letter-spacing: 1px;
  writing-mode: vertical-rl;
  text-orientation: mixed;
}

.project-sekai {
  font-size: 28px;
  margin-bottom: 20px;
  -webkit-text-stroke: 1.8px rgba(255, 255, 255, 0.7);
  text-stroke: 1.8px rgba(255, 255, 255, 0.7);
}

.colorful-stage {
  font-size: 52px;
  margin-bottom: 20px;
  -webkit-text-stroke: 2.5px rgba(255, 255, 255, 0.7);
  text-stroke: 2.5px rgba(255, 255, 255, 0.7);
}

.feat-miku {
  font-size: 22px;
  -webkit-text-stroke: 1.2px rgba(255, 255, 255, 0.7);
  text-stroke: 1.2px rgba(255, 255, 255, 0.7);
}

.result-container {
  width: 100%;
  max-width: 800px;
  background-color: #f8f8f8;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  position: relative;
  z-index: 2;
}
</style>
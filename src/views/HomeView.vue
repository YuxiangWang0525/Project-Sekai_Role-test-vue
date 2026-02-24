<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTestStore } from '@/stores/test'
import StartCard from '@/components/StartCard.vue'

const router = useRouter()
const testStore = useTestStore()

const showResumeDialog = ref(false)
const showResultDialog = ref(false)

// 在组件挂载后检查进度
import { onMounted } from 'vue'
onMounted(async () => {

  // 检查是否有未完成的保存进度
  const hasProgress = testStore.hasSavedProgress()
  const hasRecentResult = testStore.hasRecentResult()
  const isCompleted = testStore.isCompleted

  // 优先检查是否有最近完成的结果

  if (hasRecentResult && !hasProgress) {
    showResultDialog.value = true
  } else if (hasProgress && !isCompleted) {
    // 只有当有保存进度且测试未完成时才显示恢复对话框
    showResumeDialog.value = true
  }


  // 添加一个小延迟确保DOM更新
  await new Promise(resolve => setTimeout(resolve, 100))

})
const isResuming = ref(false)

function handleStart(resume: boolean = false) {
  isResuming.value = resume
  if (resume) {
    testStore.loadProgress()
  } else {
    testStore.resetTest()
  }
  router.push('/test')
}

function handleCancel() {
  showResumeDialog.value = false
  testStore.resetTest()
}

function handleViewResult() {
  router.push('/result')
}

function handleDismissResult() {
  showResultDialog.value = false
  testStore.clearResult()
}
</script>

<template>
  <div class="artistic-decoration">
    <div class="artistic-text">
      <div class="text-line project-sekai">Project SEKAI</div>
      <div class="text-line colorful-stage">COLORFUL STAGE</div>
      <div class="text-line feat-miku">feat. HATSUNE MIKU</div>
    </div>
  </div>

  <div id="test-container">
    <StartCard
      v-if="!showResumeDialog && !showResultDialog"
      @start="handleStart(false)"
    />

    <!-- 恢复进度对话框 -->
    <div v-if="showResumeDialog" class="resume-dialog-overlay">
      <div class="resume-dialog">
        <div class="dialog-content">
          <h3>检测到未完成的测试</h3>
          <p>您上次的测试还未完成，是否要继续？</p>
          <div class="dialog-actions">
            <button class="test-button secondary-button" @click="handleCancel">
              重新开始
            </button>
            <button class="test-button primary-button" @click="handleStart(true)">
              继续测试
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 结果提醒对话框 -->
    <div v-if="showResultDialog" class="resume-dialog-overlay">
      <div class="resume-dialog">
        <div class="dialog-content">
          <h3>您近期已进行过测评</h3>
          <p>是否查看最后一次测评结果？</p>
          <div class="dialog-actions">
            <button class="test-button secondary-button" @click="handleDismissResult">
              不，谢谢
            </button>
            <button class="test-button primary-button" @click="handleViewResult">
              查看结果
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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

#test-container {
  width: 100%;
  max-width: 800px;
  min-height: 500px;
  background-color: #f8f8f8;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  position: relative;
  z-index: 2;
}

.resume-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.resume-dialog {
  background-color: white;
  border-radius: 12px;
  padding: 30px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.dialog-content h3 {
  font-size: 24px;
  color: #4A4A6A;
  margin-bottom: 15px;
  text-align: center;
}

.dialog-content p {
  font-size: 16px;
  color: #666;
  margin-bottom: 25px;
  text-align: center;
  line-height: 1.6;
}

.dialog-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.test-button {
  padding: 12px 25px;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: '黑体', sans-serif;
  min-width: 120px;
  text-align: center;
}

.primary-button {
  background-color: #5CE1E6;
  color: white;
  box-shadow: 0 4px 8px rgba(92, 225, 230, 0.3);
}

.primary-button:hover {
  background-color: #4DD0D5;
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

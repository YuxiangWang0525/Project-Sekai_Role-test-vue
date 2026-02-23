<script setup lang="ts">
const emit = defineEmits<{
  (e: 'start'): void
}>()

function handleClick() {
  console.log('StartCard按钮被点击')
  emit('start')
}
</script>

<template>
  <div class="test-card" id="start-card">
    <div class="question-section">
      <div class="question-text">哪颗心与你共鸣？世界计划角色测试</div>
    </div>
    <div class="answer-section">
      <div class="disclaimer">
        本测试为粉丝二创作品，完全免费，基于《世界计划 彩色舞台》世界观。<br>
        所有角色版权归属SEGA、Colorful Palette等原公司。<br>
        39题·五维·结合角色核心渴望与内心，更贴近「宫益坂」「神山」的她们与他们。
      </div>
      <button class="test-button primary-button button-full" @click="handleClick">
        开始测试
      </button>
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

.question-text {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
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

.disclaimer {
  color: #6C6C9D;
  font-size: 14px;
  text-align: center;
  margin-bottom: 25px;
  line-height: 1.6;
  font-family: '黑体', sans-serif;
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

.primary-button:hover {
  background-color: #4DD0D5;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(92, 225, 230, 0.4);
}

.button-full {
  width: 100%;
}
</style>
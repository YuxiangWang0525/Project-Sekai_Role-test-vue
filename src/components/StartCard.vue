<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useTestStore } from '@/stores/test'

const emit = defineEmits<{
  (e: 'start'): void
}>()

const testStore = useTestStore()

// 响应式数据绑定实验性选项
const weightedMode = ref(testStore.getWeightedMode())
const multiResultMode = ref(testStore.getMultiResultMode())

// 昵称绑定
const nicknameInput = ref<HTMLInputElement | null>(null)

// 监听选项变化并同步到store
watch(weightedMode, (newValue) => {
  testStore.setWeightedMode(newValue)
})

watch(multiResultMode, (newValue) => {
  testStore.setMultiResultMode(newValue)
})

// 监听昵称输入变化
function handleNicknameInput(event: Event) {
  const target = event.target as HTMLInputElement
  const value = target.value.trim() || '你'
  testStore.saveNickname(value)
}

// 组件挂载时同步昵称
onMounted(() => {
  if (nicknameInput.value) {
    nicknameInput.value.value = testStore.nickname
  }
})

function handleClick() {
  console.log('StartCard按钮被点击')
  console.log('当前选项状态:', { 
    weightedMode: weightedMode.value, 
    multiResultMode: multiResultMode.value,
    nickname: testStore.nickname
  })
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
        39题·五维·实验性选项默认开启，可随时取消。
      </div>
      <div class="name-input-area">
        <label>昵称</label>
        <input 
          ref="nicknameInput"
          type="text" 
          id="username-input" 
          placeholder="你" 
          :value="testStore.nickname" 
          maxlength="20"
          @input="handleNicknameInput"
        >
        <p style="color:dimgray">(它将显示在结果页的标题文案中)</p>
      </div>

      <!-- 实验性选项区域 -->
      <div class="experimental-options">
        <div class="option-item">
          <input
            type="checkbox"
            id="weightedMode"
            v-model="weightedMode"
          >
          <label for="weightedMode"><strong>结果多样化</strong> (加权算法，突出角色独特性)</label>
        </div>
        <div class="option-note">※ 开启后可能影响结果客观性，但能增加低频角色的出现机会。</div>
        <div class="option-item">
          <input
            type="checkbox"
            id="multiResultMode"
            v-model="multiResultMode"
          >
          <label for="multiResultMode"><strong>多结果显示</strong> (展示匹配度≥60%的其他角色)</label>
        </div>
      </div>
      <button class="test-button primary-button button-full" @click="handleClick">
        开始测试
      </button>
      <br />
      <p style="text-align:center;">这是<a href="https://github.com/yangzihao1234567/Project-Sekai_Role-test" target="_blank">Project-Sekai_Role-test</a>使用Vue 3重构的版本 <a href="https://github.com/YuxiangWang0525/Project-Sekai_Role-test-vue" target="_blank">GitHub</a><br></br>由<a href="https://github.com/YuxiangWang0525" target="_blank">晚江右海</a>主导维护. 以GPL v3 License发布</p>
    </div>
  </div>
</template>

<style scoped>
.name-input-area {
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 40px;
  padding: 5px 20px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  border: 1px solid #5CE1E6;
}

.name-input-area label {
  color: #4A4A6A;
  margin-right: 10px;
  font-weight: bold;
  white-space: nowrap;
}

.name-input-area input {
  flex: 1;
  border: none;
  background: transparent;
  padding: 12px 0;
  font-size: 16px;
  outline: none;
  color: #333;
  font-weight: 500;
}
a {
  color: #49D0BB;
  text-decoration: none;
}
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

/* 实验性选项样式 */
.experimental-options {
  background-color: rgba(255,255,255,0.7);
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 20px;
  text-align: left;
  border: 1px dashed #5CE1E6;
}

.option-item {
  margin: 8px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.option-item input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.option-note {
  font-size: 12px;
  color: #888;
  margin-left: 26px;
}
</style>

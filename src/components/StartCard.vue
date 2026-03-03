<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useTestStore } from '@/stores/test'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

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
      <div class="question-text">{{ t('start.title') }}</div>
    </div>
    <div class="answer-section">
      <div class="disclaimer">
        {{ t('start.disclaimer') }}
      </div>
      <div class="name-input-area">
        <label>{{ t('start.nicknameLabel') }}</label>
        <input
          ref="nicknameInput"
          type="text"
          id="username-input"
          placeholder="你"
          :value="testStore.nickname"
          maxlength="20"
          @input="handleNicknameInput"
        >
        <p style="color:dimgray">{{ t('start.nicknameHint') }}</p>
      </div>


      <!-- 实验性选项区域 -->
      <div class="experimental-options">
        <div class="option-item">
          <input
            type="checkbox"
            id="weightedMode"
            v-model="weightedMode"
          >
          <label for="weightedMode"><strong>{{ t('start.weightedOption') }}</strong> ({{ t('start.weightedDesc') }})</label>
        </div>
        <div class="option-note">{{ t('start.weightedNote') }}</div>
        <div class="option-item">
          <input
            type="checkbox"
            id="multiResultMode"
            v-model="multiResultMode"
          >
          <label for="multiResultMode"><strong>{{ t('start.multiResultOption') }}</strong> ({{ t('start.multiResultDesc') }})</label>
        </div>
      </div>
      <button class="test-button primary-button button-full" @click="handleClick">
        {{ t('start.startButton') }}
      </button>
      <br />
      <p style="text-align:center;">
        {{ t('start.footerText1') }}
        <a :href="t('start.footerLinks.originalProject')" target="_blank">Project-Sekai_Role-test</a>
        {{ t('start.footerText2') }}
        <a :href="t('start.footerLinks.vueVersion')" target="_blank">{{ t('start.footerGithub') }}</a><br>
        {{ t('start.footerText3') }}
        <a :href="t('start.footerLinks.maintainer')" target="_blank">{{ $i18n.locale === 'zh' ? '晚江右海' : ($i18n.locale === 'ja' ? '晩江右海' : 'Yuxiang Wang') }}</a>
        {{ t('start.footerText4') }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.name-input-area {
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 40px;
  padding: 5px 20px;
  margin-bottom: 20px;
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

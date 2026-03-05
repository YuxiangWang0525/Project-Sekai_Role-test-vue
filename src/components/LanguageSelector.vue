<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supportedLanguages, getCurrentLanguage, setCurrentLanguage } from '@/data/languages'
import { switchLanguage } from '@/plugins/i18n'

const currentLanguage = ref(getCurrentLanguage())
const isOpen = ref(false)

const handleLanguageChange = (code: string) => {
  currentLanguage.value = code
  setCurrentLanguage(code)
  switchLanguage(code as 'zh' | 'yue_Hant')
  isOpen.value = false
  
  // 刷新页面以应用新语言
  window.location.reload()
}

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

// 点击外部关闭下拉框
const closeDropdown = () => {
  isOpen.value = false
}

onMounted(() => {
  document.addEventListener('click', closeDropdown)
  
  return () => {
    document.removeEventListener('click', closeDropdown)
  }
})
</script>

<template>
  <div class="language-selector" @click.stop="toggleDropdown">
    <button class="language-button">
      <span class="globe-icon">🌐</span>
      <span class="current-language">
        {{ supportedLanguages.find(lang => lang.code === currentLanguage)?.nativeName || '语言' }}
      </span>
      <span class="dropdown-arrow" :class="{ 'open': isOpen }">▼</span>
    </button>
    
    <transition name="dropdown">
      <div v-if="isOpen" class="language-dropdown">
        <ul class="language-list">
          <li 
            v-for="lang in supportedLanguages" 
            :key="lang.code"
            class="language-item"
            :class="{ 'active': lang.code === currentLanguage }"
            @click.stop="handleLanguageChange(lang.code)"
          >
            <span class="native-name">{{ lang.nativeName }}</span>
            <span class="language-name">{{ lang.name }}</span>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.language-selector {
  position: relative;
  display: inline-block;
}

.language-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: rgba(255, 255, 255, 0.9);
  border: 2px solid #e0e0e0;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Microsoft YaHei', '黑体', sans-serif;
  font-size: 14px;
  color: #4A4A6A;
}

.language-button:hover {
  background-color: white;
  border-color: #5CE1E6;
  box-shadow: 0 4px 12px rgba(92, 225, 230, 0.3);
  transform: translateY(-2px);
}

.globe-icon {
  font-size: 16px;
}

.current-language {
  font-weight: 500;
}

.dropdown-arrow {
  font-size: 10px;
  transition: transform 0.3s ease;
}

.dropdown-arrow.open {
  transform: rotate(180deg);
}

.language-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  padding: 8px;
  min-width: 200px;
  z-index: 1000;
  border: 2px solid #f0f0f0;
}

.language-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.language-item {
  display: flex;
  flex-direction: column;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  gap: 4px;
}

.language-item:hover {
  background-color: #f5f5f5;
}

.language-item.active {
  background-color: #e6f7f8;
  border-left: 3px solid #5CE1E6;
}

.native-name {
  font-weight: 600;
  color: #4A4A6A;
  font-size: 15px;
}

.language-name {
  font-size: 12px;
  color: #888;
}

/* 下拉动画 */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>

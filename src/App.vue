<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from "vue"
import { useI18n } from 'vue-i18n'
import { useTitle } from "@vueuse/core"
import LanguageSelector from '@/components/LanguageSelector.vue'

const title = useTitle()
const { t } = useI18n()
onMounted(() => {
  title.value = t('app.title')
})
</script>

<template>
  <div class="app-container">
    <div class="language-selector-container">
      <LanguageSelector />
    </div>
    <RouterView />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Microsoft YaHei', '黑体', sans-serif;
  background: linear-gradient(135deg, #e6e6fa 0%, #f0e6ff 100%);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

#app {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.app-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.language-selector-container {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 100;
}
</style>

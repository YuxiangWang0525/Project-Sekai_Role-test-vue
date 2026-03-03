import { createI18n } from 'vue-i18n'
import zh from '../locales/zh.json'
import en from '../locales/en.json'
import ja from '../locales/ja.json'

const messages = {
  zh,
  en,
  ja
}

export const i18n = createI18n({
  legacy: false,
  locale: 'zh',
  fallbackLocale: 'en',
  messages
})

// 语言切换函数
export function switchLanguage(locale: 'zh' | 'en' | 'ja') {
  i18n.global.locale.value = locale
  localStorage.setItem('preferred-language', locale)
}

// 获取保存的语言设置
export function getSavedLanguage(): 'zh' | 'en' | 'ja' {
  const saved = localStorage.getItem('preferred-language')
  if (saved && ['zh', 'en', 'ja'].includes(saved)) {
    return saved as 'zh' | 'en' | 'ja'
  }
  return 'zh'
}

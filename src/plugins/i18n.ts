import { createI18n } from 'vue-i18n'
import zh from '../locales/zh.json'
// import en from '../locales/en.json'
// import ja from '../locales/ja.json'
import yue_Hant from '../locales/yue_Hant.json'

// 导入数据文件的国际化
import dataZh from '../locales/data-zh.json'
// import dataEn from '../locales/data-en.json'
// import dataJa from '../locales/data-ja.json'
import dataYue_Hant from '../locales/data-yue_Hant.json'

const messages = {
  zh: {
    ...zh,
    data: dataZh
  },
  // en: {
  //   ...en,
  //   data: dataEn
  // },
  // ja: {
  //   ...ja,
  //   data: dataJa
  // },
  yue_Hant: {
    ...yue_Hant,
    data: dataYue_Hant
  }
}

// 获取保存的语言设置
function getSavedLocale(): string {
  const saved = localStorage.getItem('preferred-language')
  if (saved && ['zh', 'yue_Hant'].includes(saved)) {
    return saved
  }
  return 'zh'
}

export const i18n = createI18n({
  legacy: false,
  locale: getSavedLocale(),
  fallbackLocale: 'en',
  messages
})

// 语言切换函数
export function switchLanguage(locale: 'zh' | 'yue_Hant') {
  i18n.global.locale.value = locale
  localStorage.setItem('preferred-language', locale)
}

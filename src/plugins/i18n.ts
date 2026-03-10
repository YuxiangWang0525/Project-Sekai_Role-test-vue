import { createI18n } from 'vue-i18n'
import zh from '../locales/zh.json'
import en from '../locales/en.json'
// import ja from '../locales/ja.json'
import yue_Hant from '../locales/yue_Hant.json'

// 导入数据文件的国际化
import dataZh from '../locales/data-zh.json'
import dataEn from '../locales/data-en.json'
// import dataJa from '../locales/data-ja.json'
import dataYue_Hant from '../locales/data-yue_Hant.json'

// 导入西文空格优化工具
import { optimizeWesternSpacing, isMainlyWestern } from '@/utils/westernSpacing'

// 深度克隆并优化对象中的所有字符串
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function optimizeObjectStrings(obj: any, isWestern: boolean): any {
  if (!obj || typeof obj !== 'object') {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(item => optimizeObjectStrings(item, isWestern))
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: any = {}
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      result[key] = isWestern ? optimizeWesternSpacing(obj[key]) : obj[key]
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      result[key] = optimizeObjectStrings(obj[key], isWestern)
    } else {
      result[key] = obj[key]
    }
  }
  return result
}

// 对英文数据进行空格优化
const optimizedEn = optimizeObjectStrings(en, true)
const optimizedDataEn = optimizeObjectStrings(dataEn, true)

const messages = {
  zh: {
    ...zh,
    data: dataZh
  },
  en: {
    ...optimizedEn,
    data: optimizedDataEn
  },
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
  if (saved && ['zh', 'en', 'yue_Hant'].includes(saved)) {
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
export function switchLanguage(locale: 'zh' | 'en' | 'yue_Hant') {
  i18n.global.locale.value = locale
  localStorage.setItem('preferred-language', locale)
}

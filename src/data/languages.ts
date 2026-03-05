// 支持的语言列表
export interface Language {
  code: string
  name: string
  nativeName: string
}

export const supportedLanguages: Language[] = [
  {
    code: 'zh',
    name: 'Chinese (Simplified)',
    nativeName: '简体中文'
  },
  // {
  //   code: 'en',
  //   name: 'English',
  //   nativeName: 'English'
  // },
  // {
  //   code: 'ja',
  //   name: 'Japanese',
  //   nativeName: '日本語'
  // },
  {
    code: 'yue_Hant',
    name: 'Cantonese (Traditional)',
    nativeName: '粵語（繁體）'
  }
]

// 获取当前语言
export function getCurrentLanguage(): string {
  return localStorage.getItem('preferred-language') || 'zh'
}

// 设置语言
export function setCurrentLanguage(code: string): void {
  localStorage.setItem('preferred-language', code)
}

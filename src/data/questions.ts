import type { Question } from './types'

// 题目对应的维度索引（保持不变）
const QUESTION_DIMS = [
  0, 0, 0, 0, 0, 0, 0, 0,  // 外向性 0-7
  1, 1, 1, 1, 1, 1, 1, 1,  // 宜人性 8-15
  2, 2, 2, 2, 2, 2, 2, 2,  // 尽责性 16-23
  3, 3, 3, 3, 3, 3, 3, 3,  // 神经质 24-31
  4, 4, 4, 4, 4, 4, 4      // 开放性 32-38
]

// 从 localStorage 获取当前语言并动态导入数据
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getCurrentData(): Promise<any> {
  const locale = localStorage.getItem('preferred-language') || 'zh'
  
  try {
    if (locale === 'yue_Hant') {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      return await import('../locales/data-yue_Hant.json')
    }
    // 默认使用中文
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return await import('../locales/data-zh.json')
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return await import('../locales/data-zh.json')
  }
}

// 从 i18n 数据生成题目列表
async function createQuestions(): Promise<Question[]> {
  const data = await getCurrentData()
  const questions = data.questions || []

  return questions.map((q: any, index: number) => ({ // eslint-disable-line @typescript-eslint/no-explicit-any
    text: q.text || `Question ${index + 1}`,
    dim: QUESTION_DIMS[index] || 0
  }))
}

// 初始加载（使用立即执行函数）
let QUESTIONS: Question[] = []

// 同步初始化
const initPromise = (async () => {
  QUESTIONS = await createQuestions()
})()

export { QUESTIONS }

// 导出获取题目列表（支持响应式更新）
export async function getQuestionsDynamic(): Promise<Question[]> {
  return await createQuestions()
}

// 等待初始化完成
export async function waitForInit(): Promise<void> {
  await initPromise
}

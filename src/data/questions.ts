import type { Question } from './types'
import dataZh from '../locales/data-zh.json'
import dataEn from '../locales/data-en.json'
import dataJa from '../locales/data-ja.json'

// 题目对应的维度索引（保持不变）
const QUESTION_DIMS = [
  0, 0, 0, 0, 0, 0, 0, 0,  // 外向性 0-7
  1, 1, 1, 1, 1, 1, 1, 1,  // 宜人性 8-15
  2, 2, 2, 2, 2, 2, 2, 2,  // 尽责性 16-23
  3, 3, 3, 3, 3, 3, 3, 3,  // 神经质 24-31
  4, 4, 4, 4, 4, 4, 4      // 开放性 32-38
]

// 从 i18n 数据生成题目列表
function createQuestions(): Question[] {
  const locale = localStorage.getItem('preferred-language') || 'zh'
  const dataMap: Record<string, any> = {
    zh: dataZh,
    en: dataEn,
    ja: dataJa
  }
  const data = dataMap[locale] || dataZh

  return data.questions.map((q: any, index: number) => ({
    text: q.text || `Question ${index + 1}`,
    dim: QUESTION_DIMS[index] || 0
  }))
}

export const QUESTIONS: Question[] = createQuestions()

// 导出获取函数（支持响应式更新）
export function getQuestionsDynamic(): Question[] {
  return createQuestions()
}

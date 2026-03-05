import type { DimensionName } from './types'

// 根据当前语言获取数据
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

// 根据当前语言获取维度名称
async function getDimensionNames(): Promise<DimensionName[]> {
  const data = await getCurrentData()
  return data.dimensions.names
}

// 根据当前语言获取选项标签
async function getValueLabels(): Promise<string[]> {
  const data = await getCurrentData()
  return data.dimensions.valueLabels
}

// 初始加载（使用立即执行函数）
let DIMENSION_NAMES: DimensionName[] = []
let VALUE_LABELS: string[] = []

// 同步初始化
const initPromise = (async () => {
  DIMENSION_NAMES = await getDimensionNames()
  VALUE_LABELS = await getValueLabels()
})()

export { DIMENSION_NAMES, VALUE_LABELS }

// 导出获取函数（支持响应式更新）
export async function getDimensionNamesDynamic(): Promise<DimensionName[]> {
  return await getDimensionNames()
}

export async function getValueLabelsDynamic(): Promise<string[]> {
  return await getValueLabels()
}

// 等待初始化完成
export async function waitForInit(): Promise<void> {
  await initPromise
}

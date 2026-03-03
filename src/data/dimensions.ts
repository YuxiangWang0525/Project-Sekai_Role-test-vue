import type { DimensionName } from './types'
import dataZh from '../locales/data-zh.json'
import dataEn from '../locales/data-en.json'
import dataJa from '../locales/data-ja.json'

// 根据当前语言获取维度名称
function getDimensionNames(): DimensionName[] {
  const locale = localStorage.getItem('preferred-language') || 'zh'
  const dataMap: Record<string, any> = {
    zh: dataZh,
    en: dataEn,
    ja: dataJa
  }
  const data = dataMap[locale] || dataZh
  return data.dimensions.names
}

// 根据当前语言获取选项标签
function getValueLabels(): string[] {
  const locale = localStorage.getItem('preferred-language') || 'zh'
  const dataMap: Record<string, any> = {
    zh: dataZh,
    en: dataEn,
    ja: dataJa
  }
  const data = dataMap[locale] || dataZh
  return data.dimensions.valueLabels
}

export const DIMENSION_NAMES: DimensionName[] = getDimensionNames()
export const VALUE_LABELS: string[] = getValueLabels()

// 导出获取函数（支持响应式更新）
export function getDimensionNamesDynamic(): DimensionName[] {
  return getDimensionNames()
}

export function getValueLabelsDynamic(): string[] {
  return getValueLabels()
}
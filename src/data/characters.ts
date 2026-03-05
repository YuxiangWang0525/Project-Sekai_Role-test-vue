import type { Character } from './types'
import dataZh from '../locales/data-zh.json'
import dataEn from '../locales/data-en.json'
import dataJa from '../locales/data-ja.json'

// 角色数据（颜色配置保持不变，文本内容从 i18n 读取）
const CHARACTER_COLORS: Record<string, string> = {
  ichika: '#33AAEE',
  saki: '#FFDD44',
  honami: '#EE6666',
  shiho: '#BBDD22',
  minori: '#FFCCAA',
  haruka: '#99CCFF',
  airi: '#FF6699',
  shizuku: '#99EEDD',
  kohane: '#FF6699',
  an: '#00BBDD',
  akito: '#FF7722',
  touya: '#0077DD',
  tsukasa: '#FFBB00',
  emu: '#FF66BB',
  nene: '#33DD99',
  rui: '#BB88EE',
  kanade: '#BB6688',
  mafuyu: '#8888CC',
  ena: '#CCAA88',
  mizuki: '#DDAACC'
}

// 角色五维数据（保持不变）
const CHARACTER_DIMS: Record<string, number[]> = {
  ichika: [2, 4, 4, 3, 4],
  saki: [5, 5, 3, 2, 4],
  honami: [2, 5, 5, 4, 3],
  shiho: [1, 3, 5, 3, 3],
  minori: [5, 5, 4, 3, 3],
  haruka: [3, 4, 5, 2, 3],
  airi: [4, 4, 5, 2, 3],
  shizuku: [2, 5, 4, 2, 4],
  kohane: [1, 4, 3, 5, 3],
  an: [5, 4, 4, 2, 4],
  akito: [5, 4, 3, 2, 4],
  touya: [2, 3, 5, 3, 4],
  tsukasa: [5, 3, 4, 2, 5],
  emu: [5, 5, 2, 1, 5],
  nene: [1, 4, 5, 3, 4],
  rui: [3, 2, 3, 3, 5],
  kanade: [1, 3, 5, 5, 5],
  mafuyu: [1, 2, 5, 5, 3],
  ena: [3, 3, 3, 5, 4],
  mizuki: [4, 5, 3, 3, 4]
}

// 从 i18n 数据生成角色列表
function createCharacters(): Character[] {
  // 根据当前语言选择数据
  const locale = localStorage.getItem('preferred-language') || 'zh'
  const dataMap: Record<string, any> = {
    zh: dataZh,
    en: dataEn,
    ja: dataJa
  }
  const data = dataMap[locale] || dataZh

  return Object.keys(CHARACTER_COLORS).map(id => ({
    id,
    name: data.characters[id]?.name || id,
    color: CHARACTER_COLORS[id]!,
    desc: data.characters[id]?.desc || '',
    dim: CHARACTER_DIMS[id]!
  }))
}

export const CHARACTERS: Character[] = createCharacters()

// 导出获取角色数据的函数（支持响应式更新）
export function getCharacters(): Character[] {
  return createCharacters()
}

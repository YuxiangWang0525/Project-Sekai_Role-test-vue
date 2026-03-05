import type { Character } from './types'

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

// 角色颜色配置（保持不变）
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

// 根据当前语言获取角色数据
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

// 从 i18n 数据生成角色列表
async function createCharacters(): Promise<Character[]> {
  const data = await getCurrentData()
  const characters = data.characters || {}

  return Object.keys(CHARACTER_COLORS).map(id => ({
    id,
    name: characters[id]?.name || id,
    color: CHARACTER_COLORS[id]!,
    desc: characters[id]?.desc || '',
    dim: CHARACTER_DIMS[id]!
  }))
}

// 初始加载（使用立即执行函数）
let CHARACTERS: Character[] = []

// 同步初始化
const initPromise = (async () => {
  CHARACTERS = await createCharacters()
})()

export { CHARACTERS }

// 导出获取角色数据的函数（支持响应式更新）
export async function getCharacters(): Promise<Character[]> {
  return await createCharacters()
}

// 等待初始化完成
export async function waitForInit(): Promise<void> {
  await initPromise
}

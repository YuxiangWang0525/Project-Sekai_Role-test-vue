export interface Character {
  id: string
  name: string
  color: string
  desc: string
  dim: number[] // [外向性, 宜人性, 尽责性, 神经质, 开放性]
}

export interface Question {
  text: string
  dim: number // 维度索引: 0-外向性, 1-宜人性, 2-尽责性, 3-神经质, 4-开放性
}

export interface TestState {
  currentIndex: number
  answers: (number | null)[]
  isCompleted: boolean
  timestamp?: number
}

export interface MatchResult {
  character: Character
  percentage: number
}

export type DimensionName = '外向性' | '宜人性' | '尽责性' | '神经质' | '开放性'
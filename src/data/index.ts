// 数据索引文件
export * from './types'

// 维度数据
export {
  DIMENSION_NAMES,
  VALUE_LABELS,
  getDimensionNamesDynamic,
  getValueLabelsDynamic,
  waitForInit as waitForDimensionsInit
} from './dimensions'

// 角色数据
export { CHARACTERS, getCharacters, waitForInit as waitForCharactersInit } from './characters'

// 问题数据
export { QUESTIONS, getQuestionsDynamic, waitForInit as waitForQuestionsInit } from './questions'
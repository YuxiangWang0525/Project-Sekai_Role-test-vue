import { createI18n } from 'vue-i18n'

const messages = {
  zh: {
    app: {
      title: '世界计划角色匹配测试',
      start: '开始测试',
      next: '下一题',
      prev: '上一题',
      viewResult: '查看结果',
      restart: '重新测试',
      share: '分享结果',
      loading: '加载中...',
      resumeDialog: {
        title: '检测到未完成的测试',
        message: '您上次的测试还未完成，是否要继续？',
        continue: '继续测试',
        restart: '重新开始'
      }
    },
    dimensions: {
      extraversion: '外向性',
      agreeableness: '宜人家',
      conscientiousness: '尽责性',
      neuroticism: '神经质',
      openness: '开放性'
    },
    labels: {
      completelyDisagree: '完全不符合',
      somewhatDisagree: '不太符合',
      neutral: '有些符合',
      somewhatAgree: '基本符合',
      completelyAgree: '完全符合'
    },
    results: {
      title: '测试结果',
      matchPercentage: '匹配度',
      characterDescription: '角色介绍'
    }
  },
  en: {
    app: {
      title: 'Project Sekai Character Matching Test',
      start: 'Start Test',
      next: 'Next',
      prev: 'Previous',
      viewResult: 'View Results',
      restart: 'Restart Test',
      share: 'Share Results',
      loading: 'Loading...',
      resumeDialog: {
        title: 'Unfinished Test Detected',
        message: 'You have an unfinished test. Would you like to continue?',
        continue: 'Continue Test',
        restart: 'Start Over'
      }
    },
    dimensions: {
      extraversion: 'Extraversion',
      agreeableness: 'Agreeableness',
      conscientiousness: 'Conscientiousness',
      neuroticism: 'Neuroticism',
      openness: 'Openness'
    },
    labels: {
      completelyDisagree: 'Completely Disagree',
      somewhatDisagree: 'Somewhat Disagree',
      neutral: 'Neutral',
      somewhatAgree: 'Somewhat Agree',
      completelyAgree: 'Completely Agree'
    },
    results: {
      title: 'Test Results',
      matchPercentage: 'Match Percentage',
      characterDescription: 'Character Description'
    }
  },
  ja: {
    app: {
      title: 'プロジェクトセカイ キャラクターマッチングテスト',
      start: 'テスト開始',
      next: '次の質問',
      prev: '前の質問',
      viewResult: '結果を見る',
      restart: 'テストをやり直す',
      share: '結果を共有',
      loading: '読み込み中...',
      resumeDialog: {
        title: '未完了のテストが検出されました',
        message: '前回のテストが完了していません。続行しますか？',
        continue: 'テストを続ける',
        restart: '最初からやり直す'
      }
    },
    dimensions: {
      extraversion: '外向性',
      agreeableness: '協調性',
      conscientiousness: '誠実性',
      neuroticism: '神経質性',
      openness: '開放性'
    },
    labels: {
      completelyDisagree: '全く当てはまらない',
      somewhatDisagree: 'あまり当てはまらない',
      neutral: 'どちらともいえない',
      somewhatAgree: 'やや当てはまる',
      completelyAgree: 'とても当てはまる'
    },
    results: {
      title: 'テスト結果',
      matchPercentage: '一致率',
      characterDescription: 'キャラクター紹介'
    }
  }
}

export const i18n = createI18n({
  legacy: false,
  locale: 'zh',
  fallbackLocale: 'en',
  messages
})

// 语言切换函数
export function switchLanguage(locale: 'zh' | 'en' | 'ja') {
  i18n.global.locale.value = locale
  localStorage.setItem('preferred-language', locale)
}

// 获取保存的语言设置
export function getSavedLanguage(): 'zh' | 'en' | 'ja' {
  const saved = localStorage.getItem('preferred-language')
  if (saved && ['zh', 'en', 'ja'].includes(saved)) {
    return saved as 'zh' | 'en' | 'ja'
  }
  return 'zh'
}

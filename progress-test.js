// 进度保存测试脚本
console.log('=== 进度保存功能测试 ===')

// 模拟测试store的状态
const testProgress = {
  currentIndex: 9,
  answers: [3, 4, 2, 5, 1, 3, 4, 2, 3, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
  isCompleted: false,
  timestamp: Date.now()
}

console.log('1. 保存测试进度...')
localStorage.setItem('sekai-role-test-progress', JSON.stringify(testProgress))
console.log('✅ 进度已保存')

console.log('2. 检查是否有保存进度...')
const saved = localStorage.getItem('sekai-role-test-progress')
if (saved) {
  const state = JSON.parse(saved)
  const hasValidProgress = Date.now() - (state.timestamp || 0) <= 24 * 60 * 60 * 1000
  const isNotCompleted = !state.isCompleted
  
  console.log('保存的数据:', state)
  console.log('时间有效性:', hasValidProgress)
  console.log('是否未完成:', isNotCompleted)
  console.log('应该显示恢复对话框:', hasValidProgress && isNotCompleted)
}

console.log('3. 模拟完成状态测试...')
const completedProgress = {
  ...testProgress,
  isCompleted: true
}
localStorage.setItem('sekai-role-test-progress', JSON.stringify(completedProgress))

const completedSaved = localStorage.getItem('sekai-role-test-progress')
if (completedSaved) {
  const state = JSON.parse(completedSaved)
  const hasValidProgress = Date.now() - (state.timestamp || 0) <= 24 * 60 * 60 * 1000
  const isNotCompleted = !state.isCompleted
  
  console.log('完成状态数据:', state)
  console.log('应该显示恢复对话框:', hasValidProgress && isNotCompleted)
}

console.log('=== 测试完成 ===')
console.log('请在浏览器中访问 http://localhost:5174 进行实际功能测试')
console.log('测试步骤：')
console.log('1. 开始测试，答到第9题左右')
console.log('2. 刷新页面，应该看到恢复对话框')
console.log('3. 点击"继续测试"，应该回到第9题')
console.log('4. 完成测试到结果页')
console.log('5. 刷新页面，应该回到首页并显示恢复对话框')
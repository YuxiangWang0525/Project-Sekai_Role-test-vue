// 手动测试验证脚本
console.log('=== 测试进度保存和默认值功能 ===')

// 模拟测试store功能
const testStoreFunctionality = () => {
  // 检查localStorage是否可用
  if (typeof localStorage === 'undefined') {
    console.log('❌ localStorage不可用')
    return
  }
  
  console.log('✅ localStorage可用')
  
  // 模拟测试数据
  const testData = {
    currentIndex: 2,
    answers: [3, 4, 3, null, null], // 前3题有答案，后2题无答案
    isCompleted: false,
    timestamp: Date.now()
  }
  
  // 保存测试数据
  localStorage.setItem('sekai-role-test-progress', JSON.stringify(testData))
  console.log('✅ 测试数据已保存')
  
  // 读取测试数据
  const savedData = localStorage.getItem('sekai-role-test-progress')
  if (savedData) {
    const parsed = JSON.parse(savedData)
    console.log('✅ 数据读取成功:', parsed)
    
    // 验证数据完整性
    if (parsed.currentIndex === 2 && parsed.answers.length === 5) {
      console.log('✅ 数据结构正确')
    } else {
      console.log('❌ 数据结构异常')
    }
  }
  
  // 清理测试数据
  localStorage.removeItem('sekai-role-test-progress')
  console.log('✅ 测试数据已清理')
}

// 运行测试
testStoreFunctionality()

console.log('=== 测试完成 ===')
console.log('请在浏览器中访问 http://localhost:5174 进行实际功能测试')
console.log('测试要点：')
console.log('1. 开始测试后，每道题应该默认显示值为3')
console.log('2. 不需要滑动就可以点击"下一题"')
console.log('3. 刷新页面后应该能恢复到之前的进度')
console.log('4. 切换题目时应该自动保存进度')
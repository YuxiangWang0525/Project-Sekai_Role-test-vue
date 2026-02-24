import { test, expect } from '@playwright/test'

test.describe('Project Sekai Role Test', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display home page with start button', async ({ page }) => {
    // 检查标题
    await expect(page).toHaveTitle(/世界计划角色匹配测试/)
    
    // 检查开始按钮
    const startButton = page.getByText('开始测试')
    await expect(startButton).toBeVisible()
    
    // 检查说明文字
    const disclaimer = page.getByText('本测试为粉丝二创作品')
    await expect(disclaimer).toBeVisible()
  })

  test('should navigate to test page when start button is clicked', async ({ page }) => {
    await page.getByText('开始测试').click()
    
    // 等待导航完成
    await page.waitForURL('/test')
    
    // 检查是否在测试页面
    await expect(page.getByText('维度:')).toBeVisible()
    await expect(page.getByText('请滑动选择你的符合程度')).toBeVisible()
  })

  test('should navigate through questions', async ({ page }) => {
    await page.getByText('开始测试').click()
    await page.waitForURL('/test')
    
    // 获取初始进度
    const initialProgress = await page.getByText(/\d+\/\d+/).textContent()
    
    // 回答第一个问题
    await page.getByText('有些符合').click()
    await page.getByText('下一题').click()
    
    // 检查进度是否更新
    const updatedProgress = page.getByText(/\d+\/\d+/)
    await expect(updatedProgress).not.toHaveText(initialProgress)
    
    // 测试上一题按钮（应该被禁用）
    const prevButton = page.getByText('上一题')
    await expect(prevButton).toBeDisabled()
  })

  test('should complete test and show results', async ({ page }) => {
    await page.getByText('开始测试').click()
    await page.waitForURL('/test')
    
    // 快速完成测试（回答所有问题）
    for (let i = 0; i < 39; i++) {
      // 选择中间选项
      await page.getByText('有些符合').click()
      
      if (i < 38) {
        await page.getByText('下一题').click()
      } else {
        await page.getByText('查看结果').click()
      }
    }
    
    // 等待结果页面
    await page.waitForURL('/result')
    
    // 检查结果页面元素
    await expect(page.getByText('测试结果')).toBeVisible()
    await expect(page.getByText('你最像')).toBeVisible()
    await expect(page.getByText('%')).toBeVisible()
    await expect(page.getByText('重新测试')).toBeVisible()
    await expect(page.getByText('分享结果')).toBeVisible()
  })

  test('should allow restarting test', async ({ page }) => {
    // 先完成一次测试
    await page.getByText('开始测试').click()
    await page.waitForURL('/test')
    
    // 快速完成测试
    for (let i = 0; i < 39; i++) {
      await page.getByText('有些符合').click()
      if (i < 38) {
        await page.getByText('下一题').click()
      } else {
        await page.getByText('查看结果').click()
      }
    }
    
    await page.waitForURL('/result')
    
    // 点击重新测试
    await page.getByText('重新测试').click()
    await page.waitForURL('/')
    
    // 应该回到首页
    await expect(page.getByText('开始测试')).toBeVisible()
  })

  test('should preserve progress when navigating away and back', async ({ page }) => {
    await page.getByText('开始测试').click()
    await page.waitForURL('/test')
    
    // 回答几道题
    await page.getByText('有些符合').click()
    await page.getByText('下一题').click()
    
    await page.getByText('基本符合').click()
    await page.getByText('下一题').click()
    
    // 导航到其他地方然后回来
    await page.goto('/')
    await page.goBack()
    
    // 检查是否仍在测试中并且进度保持
    await expect(page.getByText('维度:')).toBeVisible()
    const progress = await page.getByText(/\d+\/\d+/).textContent()
    expect(progress).toContain('3/') // 应该在第3题附近
  })
  
  test('should show result reminder after completing test', async ({ page }) => {
    // 先完成一次测试
    await page.getByText('开始测试').click()
    await page.waitForURL('/test')
    
    // 快速完成测试
    for (let i = 0; i < 39; i++) {
      await page.getByText('有些符合').click()
      if (i < 38) {
        await page.getByText('下一题').click()
      } else {
        await page.getByText('查看结果').click()
      }
    }
    
    await page.waitForURL('/result')
    await expect(page.getByText('测试结果')).toBeVisible()
    
    // 返回首页
    await page.goto('/')
    
    // 应该显示结果提醒对话框
    await expect(page.getByText('您近期已进行过测评')).toBeVisible()
    await expect(page.getByText('查看结果')).toBeVisible()
    await expect(page.getByText('不，谢谢')).toBeVisible()
  })
  
  test('should navigate to result when clicking view result', async ({ page }) => {
    // 先完成一次测试
    await page.getByText('开始测试').click()
    await page.waitForURL('/test')
    
    // 快速完成测试
    for (let i = 0; i < 39; i++) {
      await page.getByText('有些符合').click()
      if (i < 38) {
        await page.getByText('下一题').click()
      } else {
        await page.getByText('查看结果').click()
      }
    }
    
    await page.waitForURL('/result')
    
    // 返回首页
    await page.goto('/')
    
    // 点击查看结果
    await page.getByText('查看结果').click()
    
    // 应该导航到结果页面
    await page.waitForURL('/result')
    await expect(page.getByText('测试结果')).toBeVisible()
  })
  
  test('should dismiss result reminder and show start card', async ({ page }) => {
    // 先完成一次测试
    await page.getByText('开始测试').click()
    await page.waitForURL('/test')
    
    // 快速完成测试
    for (let i = 0; i < 39; i++) {
      await page.getByText('有些符合').click()
      if (i < 38) {
        await page.getByText('下一题').click()
      } else {
        await page.getByText('查看结果').click()
      }
    }
    
    await page.waitForURL('/result')
    
    // 返回首页
    await page.goto('/')
    
    // 点击不，谢谢
    await page.getByText('不，谢谢').click()
    
    // 对话框应该消失，显示开始卡片
    await expect(page.getByText('您近期已进行过测评')).toBeHidden()
    await expect(page.getByText('开始测试')).toBeVisible()
  })
  
  test('should prioritize result reminder over resume dialog', async ({ page }) => {
    // 先完成一次测试
    await page.getByText('开始测试').click()
    await page.waitForURL('/test')
    
    // 快速完成测试
    for (let i = 0; i < 39; i++) {
      await page.getByText('有些符合').click()
      if (i < 38) {
        await page.getByText('下一题').click()
      } else {
        await page.getByText('查看结果').click()
      }
    }
    
    await page.waitForURL('/result')
    
    // 开始一个新的测试但不完成
    await page.goto('/')
    await page.getByText('开始测试').click()
    await page.waitForURL('/test')
    
    // 回答几道题
    await page.getByText('有些符合').click()
    await page.getByText('下一题').click()
    
    // 返回首页
    await page.goto('/')
    
    // 应该显示结果提醒而不是恢复对话框
    await expect(page.getByText('您近期已进行过测评')).toBeVisible()
    await expect(page.getByText('检测到未完成的测试')).toBeHidden()
  })
  
  test('should clear progress but keep result after completion', async ({ page }) => {
    // 开始测试并回答几道题
    await page.getByText('开始测试').click()
    await page.waitForURL('/test')
    
    await page.getByText('有些符合').click()
    await page.getByText('下一题').click()
    
    await page.getByText('基本符合').click()
    await page.getByText('下一题').click()
    
    // 直接前往首页（模拟意外退出）
    await page.goto('/')
    
    // 应该显示恢复对话框
    await expect(page.getByText('检测到未完成的测试')).toBeVisible()
    
    // 继续测试并完成
    await page.getByText('继续测试').click()
    await page.waitForURL('/test')
    
    // 完成剩余题目
    for (let i = 2; i < 39; i++) {
      await page.getByText('有些符合').click()
      if (i < 38) {
        await page.getByText('下一题').click()
      } else {
        await page.getByText('查看结果').click()
      }
    }
    
    await page.waitForURL('/result')
    
    // 返回首页
    await page.goto('/')
    
    // 应该显示结果提醒（进度已清除）
    await expect(page.getByText('您近期已进行过测评')).toBeVisible()
    await expect(page.getByText('检测到未完成的测试')).toBeHidden()
  })
})
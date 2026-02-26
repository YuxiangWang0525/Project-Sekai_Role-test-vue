# 世界计划角色匹配测试 - Vue 3

这是一个基于Vue 3和TypeScript的Project-Sekai_Role-test重构项目

## 与原项目有何不同？
- 使用Vue.js框架
- 使用TypeScript和ESLint保证代码质量
- 意外退出或者刷新自动保存
- 绘图现在使用AntV G2图表库,而不是手动实现动画。
- 结果页面分享的按钮现在导出时会被替换为版权文字
- html2canvas 现在作为 ES 模块,而不是CDN引入 开启速度显著提升
- 人类看得懂的代码
- 国际化支持

##  技术栈

- **Vue 3** - 渐进式 JavaScript 框架
- **TypeScript**
- **Pinia** - 状态管理
- **Vue Router** - 路由管理
- **ESLint** - 静态代码检查
- **Vite** - 构建工具
- **Vitest** - 单元测试
- **Playwright** - 端到端测试
- **html2canvas** - 图片导出功能
- **Vue i18n** - 国际化
- **AntV G2** - 数据可视化(图表库)

##  安装和运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 运行单元测试
npm run test:unit

# 运行端到端测试
npm run test:e2e

# 首次测试时 请安装Playwright组件
npx playwright install
```

## 许可证

项目逻辑以GNU General Public License v3.0发布  
本项目仅供学习和交流使用，所有角色版权归 SEGA、Colorful Palette 等原公司所有。

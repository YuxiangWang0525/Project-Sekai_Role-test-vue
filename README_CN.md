# 世界计划角色匹配测试 - Vue 3

这是一个基于Vue 3和TypeScript的Project-Sekai_Role-test重构项目

[简体中文](README_CN.md)

<p style="color:red;font-size:20px">出售此项目或复制非开源的项目标题或业务逻辑违反了开源协议，构成严重侵权</p>

## 与原项目有何不同？
- 使用Vue.js框架
- 使用TypeScript和ESLint保证代码质量
- 意外退出或者刷新自动保存
- 绘图现在使用AntV G2图表库,而不是手动实现动画。
- 结果页面分享的按钮现在导出时会被替换为版权文字
- html2canvas 现在作为 ES 模块,而不是CDN引入 开启速度显著提升
- 人类看得懂的代码
- 国际化支持

## 技术栈

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

## 帮助我们翻译!

可以在OpenDR团队托管的Weblate上翻译本项目.\
[![翻译状态](https://weblate.dreameriver.cn/widget/project-sekai_role-test-vue/-/en/open-graph.png)](https://weblate.dreameriver.cn/engage/project-sekai_role-test-vue/)

## 安装和运行

```bash
# install dependencies
npm install

# run dev server
npm run dev

# build for production
npm run build

# preview production build
npm run preview

# run unit tests
npm run test:unit

# run end-to-end tests
npm run test:e2e

# install Playwright browser drivers
npx playwright install
```

## 许可证

项目逻辑以GNU General Public License v3.0发布\
本项目仅供学习和交流使用，所有角色版权归 SEGA、Colorful Palette 等原公司所有。

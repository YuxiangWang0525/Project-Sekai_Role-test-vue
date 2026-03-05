import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { i18n } from './plugins/i18n'
import {
  waitForQuestionsInit,
  waitForDimensionsInit,
  waitForCharactersInit
} from './data'

async function bootstrap() {
  // 等待所有数据初始化完成
  await Promise.all([
    waitForQuestionsInit(),
    waitForDimensionsInit(),
    waitForCharactersInit()
  ])
  
  const app = createApp(App)
  
  app.use(createPinia())
  app.use(router)
  app.use(i18n)
  
  app.mount('#app')
}

bootstrap().catch(console.error)

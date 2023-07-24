import { type App } from 'vue'
import { ElNotification } from 'element-plus'

export default {
  install: (app: App) => {
    app.config.globalProperties.$toast = ({
      ...args
    }) =>
      ElNotification({
        ...args
      })

    app.provide('toast', app.config.globalProperties.$toast)
  }
}

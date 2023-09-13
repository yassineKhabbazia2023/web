import { createPinia } from 'pinia'

import { createRouter, createWebHistory } from 'vue-router'
import { menu } from '../../routes'

const helpers = () => {
  const router = createRouter({
    history: createWebHistory(),
    routes: []
  })

  menu.forEach((m: any) => {
    router.addRoute(m)
  })

  const pinia = createPinia()

  const mockUser = {
    user: {
      activeEntity: {
        name: 'Entity Name',
        idAccount: 'AccountNumber',
        icon: 'PICupHot',
        color: 'orange'
      }
    }
  }
  return {
    router,
    pinia,
    mockUser
  }
}

export default helpers

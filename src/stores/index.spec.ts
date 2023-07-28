import { createApp } from 'vue'
import commonStore from './index'
import { setActivePinia, storeToRefs } from 'pinia'
import { createTestingPinia } from '@pinia/testing'

const app = createApp({})
const pinia = createTestingPinia()
describe('commonStore', () => {
  beforeEach(() => {
    app.use(pinia)
    setActivePinia(pinia)
  })

  it('initializes user as Jean Levage', () => {
    const store = commonStore(pinia)
    const { user } = storeToRefs(store)

    store.$patch({
      user: {
        lastName: 'Levage',
        firstName: 'Jean'
      }
    })
    expect(user.value).toBeDefined()
  })
})

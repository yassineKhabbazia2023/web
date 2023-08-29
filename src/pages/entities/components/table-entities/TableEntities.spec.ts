import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import TableEntities from './'
import { commonPinia as pinia } from '@kpmg/common'
import { createPinia, setActivePinia } from 'pinia'
import { shallowRef } from 'vue'
import { createTestingPinia } from '@pinia/testing'

vi.mock('@kpmg/common', () => ({
  commonStore: () => ({
    $patch: vi.fn()
  }),
  commonPinia: () => shallowRef(createPinia())
}))

describe('table-entities', () => {
  setActivePinia(pinia.value)
  it('renders correctly', () => {
    const wrapper = mount(TableEntities, {
      global: {
        plugins: [createTestingPinia()]
      }
    })
    expect(wrapper.exists()).toBeTruthy()
  })
})

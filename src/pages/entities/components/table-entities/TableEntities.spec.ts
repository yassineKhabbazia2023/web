import { mount } from '@vue/test-utils'
import { beforeEach, describe, it, expect, vi } from 'vitest'
import TableEntities from './'
import {
  dynamicUntilFound
} from '@kpmg/common/src/testing-helpers'
import { createPinia, setActivePinia } from 'pinia'

const entities = [
  { name: 'Entity 1', accountNumber: '123' },
  { name: 'Entity 2', accountNumber: '456' }
]

vi.mock('@kpmg/common', async () => ({
  commonApi: () => ({
    $patch: vi.fn(),
    customers: {
      get: vi.fn().mockResolvedValue({ data: entities })
    }
  }),
  commonStore: () => ({
    $patch: vi.fn()
  })
}))

const pinia = createPinia()

describe('table-entities', () => {
  beforeEach(() => {
    setActivePinia(pinia)
  })

  it('renders entity table correctly', async () => {
    const wrapper = mount(TableEntities, {
      global: {
        plugins: [
          pinia
        ]
      }
    })
    const pText = await dynamicUntilFound(wrapper, '.p-text__icon')
    expect(pText.exists()).toBeTruthy()
  })

  it('set the defaut entity selected', async () => {
    const wrapper = mount(TableEntities, {
      global: {
        plugins: [
          pinia
        ]
      }
    })

    const newActiveEntity = [{
      name: 'Entity 1',
      idAccount: '123',
      icon: 'PICupHot',
      color: 'orange'
    }]
    localStorage.setItem('defaultEntity', JSON.stringify(newActiveEntity))

    const mockGetItem = vi.spyOn(Storage.prototype, 'getItem')
    const pIcon = await dynamicUntilFound(wrapper, '.el-icon')
    expect(pIcon.exists()).toBeTruthy()
    expect(mockGetItem).toHaveBeenCalledWith('defaultEntity')
  })

  it('trigger select entity action', async () => {
    const wrapper = mount(TableEntities, {
      global: {
        plugins: [
          pinia
        ]
      }
    })

    await dynamicUntilFound(wrapper, '.el-icon')
    const addIconButton = wrapper.find('.ptable-select-entity__button')
    await addIconButton.trigger('click')
    const checkIcon = await dynamicUntilFound(wrapper, 'svg[data-test="icon-check"]')
    expect(checkIcon.exists()).toBeTruthy()
  })
})

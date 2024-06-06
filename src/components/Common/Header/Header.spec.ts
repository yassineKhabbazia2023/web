import { defineStore } from 'pinia'
import wrapperFactory from '../../../../tests/utils/wrapperFactory'
import Header from '.'
import { expect, describe, it, vi } from 'vitest'
import Drawer from '@/components/CreateMandate/Drawer'
import { nextTick } from 'vue'

const createWrapper = () =>
  wrapperFactory(Header)

vi.mock('@kpmg/common', () => ({
  commonStore: defineStore('common', {
    state: () => ([]),
  }),
}))

describe('header.vue', () => {
  const wrapper = createWrapper()
  it('renders translations correctly', () => {
    expect(wrapper.find('.header__title').text()).toBe('')
    expect(wrapper.find('.header__create-mandate-button').text()).toContain('New mandate')
  })

  it('show drawer when button is clicked', async () => {
    expect(wrapper.find('.drawer-create-mandate').exists()).toBeFalsy()
    await wrapper.find('.header__create-mandate-button').trigger('click')
    expect(wrapper.find('.drawer-create-mandate').exists()).toBeTruthy()
  })

  it('show emit refresh-mandate-collection', async () => {
    await wrapper.find('.header__create-mandate-button').trigger('click')
    wrapper.findComponent(Drawer).vm.$emit('new-mandate-crated')
    const refreshMandateCollectionEvent: any = wrapper.emitted('refresh-mandate-collection')
    expect(refreshMandateCollectionEvent).toBeDefined()
  })

  describe('interactions with PFilterGroup', () => {
    it('show emit when click on PFilterGroup', async () => {
      const activeFilters = [10, 20]
      const expectedFilters = [{
        pContent: 'Incident',
        pCode: 10,
        pColor: 'danger',
        pIcon: 'PIExclamationTriangle',
      }, {
        pContent: 'To do',
        pCode: 20,
        pColor: 'warning',
        pIcon: 'PIUpload',
      }, {
        pContent: 'In progress',
        pCode: 30,
        pColor: 'amethyste',
        pIcon: 'PIArrowRepeat',
      }, {
        pContent: 'Active',
        pCode: 40,
        pColor: 'success',
        pIcon: 'PICheckCircle',
      }, {
        pContent: 'Inactive',
        pCode: 50,
        pColor: 'gray-900',
        pIcon: 'PIXCircle',
      }]
      const expectedRefreshMandateCollectionEvent = [
        [{ statusCodes: [] }],
        [{ statusCodes: activeFilters }],
      ]

      const pFilterGroup = wrapper.findComponent({ name: 'PFilterGroup' })
      expect(pFilterGroup.props('modelValue')).toStrictEqual([])

      pFilterGroup.vm.$emit('update:model-value', activeFilters)
      await nextTick()

      expect(pFilterGroup.props('modelValue')).toStrictEqual(activeFilters)
      expect(pFilterGroup.props('pFilters')).toStrictEqual(expectedFilters)

      expect(wrapper.emitted('refresh-mandate-collection')).toStrictEqual(expectedRefreshMandateCollectionEvent)
    })
  })
})

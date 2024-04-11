import { defineStore } from 'pinia'
import { nextTick } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import ScheduleDrawer from './'
import { accountsCollection } from '@/schedule/tests/mocks/Account'
import { getMockedDeadlines } from '@/schedule/tests/mocks/Deadline'

const TEST_DATE = '2024-08-14'

vi.mock('@/schedule/services', () => ({
  getScheduleModelsByKey: () => ({
    TVA: 'TVA au 21 (Taxe sur la valeur ajoutée)',
  }),
  getSchedulesCollection: () => Promise.resolve([{
    date: TEST_DATE,
    deadlines: getMockedDeadlines(),
  }]),

  getAccountsCollection: () => Promise.resolve({
    status: 'fulfilled',
    value: accountsCollection,
  }),
}),
)

vi.mock('@kpmg/common', () => ({
  commonStore: defineStore('common', {
    state: () => ({
      user: null,
    }),
    getters: {
      isAuthenticated: () => true,
    },
  }),
  commonApi: () => ({
    gateway: {
      get: () => Promise.resolve({ data: {} }),
    },
  }),
  routes: {
    value: [],
  },
  dataProvider: () => ({
    fetchUserData: vi.fn(),
  }),
}))

function createWrapper(modelValue: boolean): VueWrapper<any> {
  const props = {
    modelValue,
  }

  return mount(ScheduleDrawer, {
    props,
  })
}

describe('test ScheduleDrawer', () => {
  describe('display', () => {
    const tests = [{
      modelValue: false,
    }, {
      modelValue: true,
    }]
    it.each(tests)('should pass  when isOpen is false', ({ modelValue }) => {
      const wrapper = createWrapper(modelValue)
      const drawer = wrapper.findComponent({ name: 'PDrawer' })
      const newModelValue = drawer.props('modelValue')

      expect(newModelValue).toBe(modelValue)
    })
  })

  describe('interactions', () => {
    it('should emit update:model-value when drawer emits close-drawer-button', async () => {
      const wrapper = createWrapper(false)
      const drawer = wrapper.findComponent({ name: 'PDrawer' })
      drawer.vm.$emit('close-drawer-button')
      await nextTick()

      expect(wrapper.emitted('update:model-value')).toStrictEqual([[false]])
    })
  })
})

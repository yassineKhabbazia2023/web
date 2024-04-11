import { ScheduleServicesMock, KpmgCommontMock } from '@/schedule/tests/mocks/commonViMock'
import { nextTick } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import ScheduleDrawer from './'

vi.mock('@/schedule/services', () => ScheduleServicesMock)
vi.mock('@kpmg/common', () => KpmgCommontMock)

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

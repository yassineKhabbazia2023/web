import { describe, expect, it, vi } from 'vitest'
import { ScheduleServicesMock, KpmgCommontMock } from '@app/schedule/tests/mocks/commonViMock'
import { nextTick } from 'vue'
import type { VueWrapper } from '@vue/test-utils'
import { shallowMount } from '@vue/test-utils'
import HomeScheduleDrawer from '.'

vi.mock('@app/schedule/services', () => ScheduleServicesMock)
vi.mock('@pulse/Common', () => KpmgCommontMock)

function createWrapper(modelValue: boolean): VueWrapper<any> {
  const props = {
    modelValue,
  }

  return shallowMount(HomeScheduleDrawer, {
    props,
  })
}

describe('test HomeScheduleDrawer', () => {
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

import { describe, it, expect } from 'vitest'
import { nextTick } from 'vue'
import wrapperFactory from 'tests/utils/wrapperFactory'
import PSwitch from './'

const createWrapper = (props: any) => wrapperFactory(PSwitch, { props })

describe('pSwitch', () => {
  describe('props', () => {
    it('should update the isToggled when v-model value changes', async () => {
      // Arrange
      const propsData = { value: false }
      const wrapper = createWrapper(propsData)
      const switchElement = wrapper.findComponent({ name: 'ElSwitch' })
      expect(switchElement.props('modelValue')).toBeFalsy()

      // Act
      await wrapper.setProps({ value: true })
      await nextTick()

      // Assert
      expect(switchElement.props('modelValue')).toBeTruthy()
      expect(wrapper.vm.isToggled).toBeTruthy()
    })
  })
})

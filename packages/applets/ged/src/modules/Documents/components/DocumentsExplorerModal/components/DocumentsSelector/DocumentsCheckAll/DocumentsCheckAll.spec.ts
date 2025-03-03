
import { createPinia } from 'pinia'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import type { DocumentsCheckAllProps } from './DocumentsCheckAllTypes'
import type { ComponentWrapper } from '@ged/__mocks__/component.wrapper'

import DocumentsCheckAll from './DocumentsCheckAll.vue'

type DocumentsCheckAllWrapper = ComponentWrapper<InstanceType<typeof DocumentsCheckAll>>

const defaultProps: DocumentsCheckAllProps = {
  disabled: false,
  checked: false,
}
const pinia = createPinia()
const createWrapper = (
  props: DocumentsCheckAllProps = defaultProps,
): DocumentsCheckAllWrapper => {
  return mount(DocumentsCheckAll, {
    props,
    global: {
      plugins: [pinia],
    },
  })
}
describe('documentsCheckAll', () => {
  describe('props', () => {
    it('should render PCheckbox when props are given', async () => {
      const wrapper = createWrapper()
      await nextTick()
      const expectedProps = {
        pLabel: false,
        pRounded: false,
        pChecked: false,
      }

      const check = wrapper.findComponent({ name: 'PCheckbox' })
      expect(check.exists()).toBeTruthy()
      expect(check.props()).toStrictEqual(expectedProps)
    })
  })
  describe('event', () => {
    it('should emit check-all-documents when change event is triggered', async () => {
      const wrapper = createWrapper()
      await nextTick()
      const check = wrapper.findComponent({ name: 'PCheckbox' })
      check.vm.$emit('change', true)
      await nextTick()
      expect(wrapper.emitted('check-all-documents')).toBeTruthy()
      expect(wrapper.emitted('check-all-documents')).toStrictEqual([
        [true],
      ])
    })
  })
})

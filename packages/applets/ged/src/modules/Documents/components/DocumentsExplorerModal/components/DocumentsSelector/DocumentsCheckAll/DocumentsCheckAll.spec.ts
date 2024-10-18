/* eslint-disable max-len */
import { createPinia } from 'pinia'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { PCheckbox } from '@pulse/styleguide'
import DocumentsCheckAll
  from '@ged/modules/Documents/components/DocumentsExplorerModal/components/DocumentsSelector/DocumentsCheckAll'
import type { DocumentsCheckAllProps } from './DocumentsCheckAllTypes'
import type { ComponentWrapper } from '@/utils/testHelpers'

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

      const check = wrapper.findComponent(PCheckbox)
      expect(check.exists()).toBeTruthy()
      expect(check.props('disabled')).toBeFalsy()
      expect(check.props('v-model')).toBeFalsy()
    })
  })
  describe('event', () => {
    it('should emit check-all-documents when change event is triggered', async () => {
      const wrapper = createWrapper()
      await nextTick()
      const check = wrapper.findComponent(PCheckbox)
      check.vm.$emit('change', true)
      await nextTick()
      expect(wrapper.emitted('check-all-documents')).toBeTruthy()
      expect(wrapper.emitted('check-all-documents')).toStrictEqual([
        [true],
      ])
    })
  })
})

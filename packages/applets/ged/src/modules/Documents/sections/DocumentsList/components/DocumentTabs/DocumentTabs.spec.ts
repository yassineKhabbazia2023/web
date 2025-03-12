
import { nextTick } from 'vue'
import { beforeEach, describe, expect, it } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { documentMock } from '@ged/__mocks__/documents.mocks'
import { type DocumentTabsProps } from './DocumentTabsTypes'
import { createPinia, setActivePinia } from 'pinia'
import DocumentTabs from './DocumentTabs.vue'

const defaultProps: DocumentTabsProps = {
  document: documentMock,
  selectedEntity: '',
  accountId: 1234,
  currentService: '',
}

const pinia = createPinia()

const createWrapper = (
  props: DocumentTabsProps = defaultProps,
): VueWrapper<any> => {
  return mount(DocumentTabs, {
    props,
    global: {
      plugins: [pinia],
    },
  })
}

describe('documentTabs', () => {
  describe('props', () => {
    beforeEach(() => {
      setActivePinia(pinia)
    })

    it('should render according to the provided props', async () => {
      const wrapper = createWrapper()

      const tabs = wrapper.findComponent({ name: 'PTabs' })
      await nextTick()
      expect(tabs.props('modelValue')).toBe('1')
      expect(tabs.exists()).toBeTruthy()

      const tabPane = wrapper.findComponent({ name: 'PTabPane' })
      expect(tabPane.exists()).toBeTruthy()

      const details = wrapper.findComponent({ name: 'DocumentDetailsTabPane' })
      expect(details.exists()).toBeTruthy()

      wrapper.vm.tabSettingsActiveName = '2'

      await nextTick()

      expect(wrapper.emitted('update:modelValue')).toStrictEqual([['2']])
    })
  })
})

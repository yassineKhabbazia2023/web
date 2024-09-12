/* eslint-disable vitest/no-hooks */
import DocumentTabs from './DocumentTabs.vue'
import { type DocumentTabsProps } from './DocumentTabsTypes'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { PTabs, PTabPane } from '@kpmg/styleguide'
import DocumentDetailsTabPane from './conponents/DocumentDetailsTabPane'
import { documentMock } from '../../../../mocks/documentMock'
import { nextTick } from 'vue'

const defaultProps: DocumentTabsProps = {
  document: documentMock,
  selectedEntity: '',
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
    provide: {
      toast: vi.fn(),
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

      const tabs = wrapper.findComponent(PTabs)
      await nextTick()
      expect(tabs.props('modelValue')).toBe('1')
      expect(tabs.exists()).toBeTruthy()

      const tabPane = wrapper.findComponent(PTabPane)
      expect(tabPane.exists()).toBeTruthy()

      const details = wrapper.findComponent(DocumentDetailsTabPane)
      expect(details.exists()).toBeTruthy()

      wrapper.vm.tabSettingsActiveName = '2'

      await nextTick()

      expect(wrapper.emitted('update:modelValue')).toStrictEqual([['2']])
    })
  })
})

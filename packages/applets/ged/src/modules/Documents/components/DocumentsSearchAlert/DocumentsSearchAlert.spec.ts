import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import type { DocumentsSearchAlertProps } from './DocumentsSearchAlertTypes'
import { describe, it, expect } from 'vitest'

import DocumentsSearchAlert from './DocumentsSearchAlert.vue'

const defaultProps: DocumentsSearchAlertProps = {
  documentsCount: 10,
}

const createWrapper = (
  props: DocumentsSearchAlertProps = defaultProps,
): VueWrapper<any> => {
  return mount(DocumentsSearchAlert, {
    props,
  })
}

// finders

const findPalert = (wrapper: VueWrapper): VueWrapper => wrapper.findComponent({ name: 'PAlert' })

describe('documentsSearchAlert', () => {
  describe('binding', () => {
    it('should display palert when number of found documents > 0', () => {
      const wrapper = createWrapper()

      const alert = findPalert(wrapper)

      expect(alert.exists()).toBeTruthy()
      expect(
        alert.html().includes(`${defaultProps.documentsCount} résultats`),
      ).toBeTruthy()
    })
    it('should display the correct message when number of found documents equals 0', () => {
      const wrapper = createWrapper({ ...defaultProps, documentsCount: 0 })

      const alert = findPalert(wrapper)

      expect(alert.exists()).toBeFalsy()
    })
  })
})

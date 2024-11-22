import { mount } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import { vi, describe, it, expect } from 'vitest'
import DocumentsDropZone from '.'
import type { DocumentsDropZoneProps } from './DocumentsDropZoneTypes'
import { type ComponentPublicInstance } from 'vue'

vi.mock('@pulse/styleguide', () => ({
  AppColors: {
    RED: 'RED',
  }
}))

const defaultProps: DocumentsDropZoneProps = {
  isAllowedDropZone: false,
}

export type DocumentsDropModalWrapper = VueWrapper<
  ComponentPublicInstance<DocumentsDropZoneProps>
>
const createWrapper = (props: DocumentsDropZoneProps = defaultProps):
DocumentsDropModalWrapper => {
  return mount(DocumentsDropZone, {
    props,
  })
}

let wrapper = createWrapper()

describe('documents drop modal', () => {
  describe('props', () => {
    it('should display image when drop is allowed', () => {
      const imageWrapper = wrapper.findComponent({ name: 'PImage' })
      expect(imageWrapper.exists()).toBeFalsy()
    })

    it.each([
      {
        isAllowedDropZone: true,
        selector: '[data-testid=allowed-drop-text]',
      },
      {
        isAllowedDropZone: false,
        selector: '[data-testid=not-allowed-drop-text]',
      },
    ])('should display the appropriate state depending of drop allow state', ({ isAllowedDropZone, selector }) => {
      wrapper = createWrapper({ isAllowedDropZone })
      const dropTextWrapper = wrapper.find(selector)
      expect(dropTextWrapper.exists()).toBeTruthy()
    })
  })
})

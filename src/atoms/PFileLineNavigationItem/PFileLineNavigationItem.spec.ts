import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PFileLineNavigationItem from './'
import type { PFileLineNavigationItemTypes } from './PFileLineNavigationItemTypes'

const defaultProps: PFileLineNavigationItemTypes = {
  pSelected: false,
  pDisabled: false,
  pFolderName: 'Name of folder',
  pFolderId: 123
}

const createWrapper = (props = defaultProps) =>
  mount(PFileLineNavigationItem, {
    props
  })

describe('pFileLineNavigationItem', () => {
  describe('props', () => {
    it('should have the selected class when selected is true', () => {
      const wrapper = createWrapper({
        pSelected: true,
        pFolderId: 123
      })
      expect(wrapper.classes().includes('selected')).toBeTruthy()
    })

    it('should not have the selected class when selected is false', () => {
      const wrapper = createWrapper({
        pSelected: false,
        pFolderId: 123
      })

      expect(wrapper.classes().includes('selected')).toBeFalsy()
    })

    it('should have the disabled class when disabled is true', () => {
      const wrapper = createWrapper({
        pDisabled: true,
        pFolderId: 123
      })

      expect(wrapper.classes().includes('disabled')).toBeTruthy()
    })

    it('should not have the disabled class when disabled is false', () => {
      const wrapper = createWrapper({
        pDisabled: false,
        pFolderId: 123
      })

      expect(wrapper.classes().includes('disabled')).toBeFalsy()
    })

    it('should show the folder name', () => {
      const wrapper = createWrapper({
        pFolderName: 'name of a random folder',
        pFolderId: 123
      })
      expect(
        wrapper.find('.p-file-line-navigation-item__name').text()
      ).toBe('name of a random folder')
    })

    it('emits click event', async () => {
      const wrapper = createWrapper({
        pFolderName: 'name of a random folder',
        pFolderId: 456
      })
      await wrapper.find('.p-file-line-navigation-item').trigger('click')
      const emittedClickEvent = wrapper.emitted('on-click-file-navigation')
      expect(emittedClickEvent).toHaveLength(1)
      expect(emittedClickEvent?.shift()).toStrictEqual([456])
    })

    it('emits double click event', async () => {
      const wrapper = createWrapper({
        pFolderName: 'name of a random folder',
        pFolderId: 123
      })

      await wrapper.find('.p-file-line-navigation-item').trigger('dblclick')

      const emittedDbClickEvent = wrapper.emitted('on-db-click-file-navigation')
      expect(emittedDbClickEvent).toHaveLength(1)
      expect(emittedDbClickEvent?.shift()).toStrictEqual([123])
    })
  })
})

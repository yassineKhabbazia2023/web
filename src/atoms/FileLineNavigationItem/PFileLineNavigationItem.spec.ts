import { describe, it, expect } from 'vitest'
import wrapperFactory from 'tests/utils/wrapperFactory'
import PFileLineNavigationItem from './'
import type { FileLineNavigationItemTypes } from './FileLineNavigationItemTypes'

const defaultProps: FileLineNavigationItemTypes = {
  selected: false,
  disabled: false,
  folderName: 'Name of folder',
  folderId: 123
}

const createWrapper = (props = defaultProps) =>
  wrapperFactory(PFileLineNavigationItem, {
    props
  })

describe('fileLineNavigationItem', () => {
  describe('props', () => {
    it('should have the selected class when selected is true', () => {
      const wrapper = createWrapper({
        selected: true,
        folderId: 123
      })
      expect(wrapper.classes().includes('selected')).toBeTruthy()
    })

    it('should not have the selected class when selected is false', () => {
      const wrapper = createWrapper({
        selected: false,
        folderId: 123
      })

      expect(wrapper.classes().includes('selected')).toBeFalsy()
    })

    it('should have the disabled class when disabled is true', () => {
      const wrapper = createWrapper({
        disabled: true,
        folderId: 123
      })

      expect(wrapper.classes().includes('disabled')).toBeTruthy()
    })

    it('should not have the disabled class when disabled is false', () => {
      const wrapper = createWrapper({
        disabled: false,
        folderId: 123
      })

      expect(wrapper.classes().includes('disabled')).toBeFalsy()
    })

    it('should show the folder name', () => {
      const wrapper = createWrapper({
        folderName: 'name of a random folder',
        folderId: 123
      })
      expect(
        wrapper.find('.file-line-navigation-item__name').text()
      ).toBe('name of a random folder')
    })
  })
})

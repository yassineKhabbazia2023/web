import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PFolderLineNavigationItem from './'
import type { PFolderLineNavigationItemProps } from './PFolderLineNavigationItemTypes'
import { PIChevronRight } from '@styleguide/atoms/PIcon/components'

const defaultProps: PFolderLineNavigationItemProps = {
  pSelected: false,
  pDisabled: false,
  pFolderName: 'Name of folder',
  pFolderId: 123,
  pTooltipContent: 'Hello',
}

const createWrapper = (props = defaultProps) =>
  mount(PFolderLineNavigationItem, {
    props,
  })

describe('pFolderLineNavigationItem', () => {
  describe('rendering', () => {
    it('should render tooltip', () => {
      const wrapper = createWrapper()
      const entity = wrapper.find('[data-testid="file-line-navigation-item"] .el-tooltip__trigger')
      expect(entity.exists()).toBeTruthy()
    })
  })
  describe('props', () => {
    it('should have the selected class when selected is true', () => {
      const wrapper = createWrapper({
        pSelected: true,
        pFolderId: 123,
      })
      expect(wrapper.classes().includes('selected')).toBeTruthy()
    })

    it('should not have the selected class when selected is false', () => {
      const wrapper = createWrapper({
        pSelected: false,
        pFolderId: 123,
      })

      expect(wrapper.classes().includes('selected')).toBeFalsy()
    })

    it('should have the disabled class when disabled is true', () => {
      const wrapper = createWrapper({
        pDisabled: true,
        pFolderId: 123,
      })

      expect(wrapper.classes().includes('disabled')).toBeTruthy()
    })

    it('should not have the disabled class when disabled is false', () => {
      const wrapper = createWrapper({
        pDisabled: false,
        pFolderId: 123,
      })

      expect(wrapper.classes().includes('disabled')).toBeFalsy()
    })

    describe('should display the PIChevronRight based on the pHasArrow prop', () => {
      const cases = [
        { pHasArrow: true, expectedLength: 2 },
        { pHasArrow: false, expectedLength: 1 },
      ]

      it.each(cases)('validation with "%s"', ({ pHasArrow, expectedLength }) => {
        const wrapper = createWrapper({
          pDisabled: false,
          pFolderId: 123,
          pHasArrow,
        })

        const pIconList = wrapper.findAllComponents({ name: 'PIcon' })
        expect(pIconList).toHaveLength(expectedLength)
      })
    })
    it('should show the folder name', () => {
      const wrapper = createWrapper({
        pFolderName: 'name of a random folder',
        pFolderId: 123,
      })
      expect(
        wrapper.find('.p-folder-line-navigation-item__folder-name').text(),
      ).toBe('name of a random folder')
    })

    it('emits click event', async () => {
      const wrapper = createWrapper({
        pFolderName: 'name of a random folder',
        pFolderId: 456,
      })
      await wrapper.find('.p-folder-line-navigation-item').trigger('click')
      const emittedClickEvent = wrapper.emitted('on-click-folder-navigation')
      expect(emittedClickEvent).toHaveLength(1)
      expect(emittedClickEvent?.shift()).toStrictEqual([456])
    })

    it('emits double click event', async () => {
      const wrapper = createWrapper({
        pFolderName: 'name of a random folder',
        pFolderId: 123,
      })

      await wrapper.find('.p-folder-line-navigation-item').trigger('dblclick')

      const emittedDbClickEvent = wrapper.emitted('on-db-click-folder-navigation')
      expect(emittedDbClickEvent).toHaveLength(1)
      expect(emittedDbClickEvent?.shift()).toStrictEqual([123])
    })
  })
})

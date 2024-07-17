/* eslint-disable vitest/no-hooks */
/* eslint-disable max-len */
/* eslint-disable vitest/max-expects */
import { nextTick } from 'vue'
import { type VueWrapper, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { PFolderLineNavigationItem, PAlert, PImage } from '@kpmg/styleguide'
import FoldersList
  from '@/modules/Documents/components/DocumentsExplorerModal/components/FoldersNavigator/FoldersList'
import { type FoldersListProps }
  from './FoldersListTypes'
import { foldersData, newFolderData } from '@/modules/Treeview/mocks/treeFoldersMock'
import CreateFolderSection from '@/modules/Treeview/sections/CreateFolder'

const defaultProps: FoldersListProps = {
  currentFolder: foldersData[0][0].children[0],
  currentServiceFolder: foldersData[0],
  explorerAuthorizedGivenAction: true,
  currentService: 'service-id-compta',
  selectedEntity: 'entity',
  isCreateFolderModalVisible: true,
  explorerUnauthorizedGivenActionMessage: 'msg',
  foldersListEmptyFolderLabel: 'lab',
  explorerFolderListLineDisabledState: undefined,
}

const createWrapper = (
  props: FoldersListProps = defaultProps,
): VueWrapper<any> => {
  return mount(FoldersList, {
    props,
  })
}

describe('foldersList', () => {
  describe('props', () => {
    it('should render elements when current folder has no children', async () => {
      const props: FoldersListProps = {
        ...defaultProps,
        currentFolder: foldersData[0][0].children[0].children[0].children[0],
      }
      const wrapper = createWrapper(props)
      await nextTick()

      const div = wrapper.find('.folder-list--no-children-folder')
      expect(div.exists()).toBeTruthy()

      const alert = wrapper.findComponent(PAlert)
      expect(alert.exists()).toBeFalsy()

      const lines = wrapper.findAllComponents(PFolderLineNavigationItem)
      expect(lines).toHaveLength(0)

      const img = wrapper.findComponent(PImage)
      expect(img.exists()).toBeTruthy()
    })

    it('should render PAlert when explorerAuthorizedGivenAction is false', async () => {
      const props: FoldersListProps = {
        ...defaultProps,
        explorerAuthorizedGivenAction: false,
      }
      const wrapper = createWrapper(props)
      await nextTick()

      const alert = wrapper.findComponent(PAlert)
      expect(alert.exists()).toBeTruthy()
    })

    it('should render elements when current folder has children', async () => {
      const wrapper = createWrapper()
      await nextTick()

      const div = wrapper.find('.folder-list--no-children-folder')
      expect(div.exists()).toBeFalsy()

      const alert = wrapper.findComponent(PAlert)
      expect(alert.exists()).toBeFalsy()

      const lines = wrapper.findAllComponents(PFolderLineNavigationItem)
      expect(lines).toHaveLength(1)
      expect(lines[0].props('pHasArrow')).toBeTruthy()
      expect(lines[0].props('pLeftIcon')).toBe('PIFolder')
      expect(lines[0].props('pDisabled')).toBeFalsy()

      const img = wrapper.findComponent(PImage)
      expect(img.exists()).toBeFalsy()
    })
  })
  describe('event', () => {
    it('should emit navigate-to-folder when PFolderLineNavigationItem clicked', async () => {
      const wrapper = createWrapper()
      await nextTick()

      const lines = wrapper.findComponent(PFolderLineNavigationItem)
      lines.trigger('click')

      expect(wrapper.emitted('navigate-to-folder')).toBeTruthy()
      expect(wrapper.emitted('navigate-to-folder')).toStrictEqual([
        [foldersData[0][0].children[0].children[0]],
      ])
    })

    it('should emit update-source-folders when update-source-folders is emitted', async () => {
      const wrapper = createWrapper()
      await nextTick()

      const section = wrapper.findComponent(CreateFolderSection)
      await section.vm.$emit('update-source-folders', newFolderData)
      await nextTick()

      expect(wrapper.emitted('update-source-folders')).toBeTruthy()
      expect(wrapper.emitted('update-source-folders')).toStrictEqual([
        [newFolderData],
      ])
    })

    it('should properly disable given folder folder', () => {
      const wrapper = createWrapper({
        ...defaultProps,
        currentFolder: foldersData[0][0].children[0].children[0],
        explorerFolderListLineDisabledState: {
          data: foldersData[0][0].children[0].children[0].children[0].id,
          context: 'MOVE_FOLDER',
        },
      })

      const navigationItem = wrapper.findComponent(PFolderLineNavigationItem)
      expect(navigationItem.props('pDisabled')).toBeTruthy()
      expect(navigationItem.props('pTooltipContent')).toBeTruthy()
    })

    it('should emit close-create-folder-modal when on-close-create-folder is emitted', async () => {
      const wrapper = createWrapper()
      await nextTick()

      const section = wrapper.findComponent(CreateFolderSection)
      await section.vm.$emit('on-close-create-folder')
      await nextTick()

      expect(wrapper.emitted('close-create-folder-modal')).toBeTruthy()
    })
  })
})

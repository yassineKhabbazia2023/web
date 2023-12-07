import Treeview from '@/modules/Treeview'
import { mount, type DOMWrapper, flushPromises, VueWrapper } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { type TreeviewProps } from '@/modules/Treeview/TreeviewTypes'

import { createPinia, setActivePinia } from 'pinia'
import { Service } from '@/models/Service'
import { foldersData } from '@/modules/Treeview/mocks/treeFoldersMock'
import CreateFolderSection from '@/modules/Treeview/sections/CreateFolder'
import DeleteFolderSection from '@/modules/Treeview/sections/DeleteFolder'
import RenameFolderSection from '@/modules/Treeview/sections/RenameFolder'
import { PTree } from '@kpmg/styleguide'
import { ComponentPublicInstance, nextTick } from 'vue'
import { Folder } from '@/models/Folder'
import TreeNode from './components/TreeNode'
import { downloadFolder } from '@/services/Folder'

type TreeviewSetup = {
  currentFolderName: string
  currentFolderId: number
  defaultFolder: Folder
}

export type TreeviewWrapper = VueWrapper<
  ComponentPublicInstance<TreeviewSetup, TreeviewProps>
>
const pinia = createPinia()

const defaultProps: TreeviewProps = {
  entityServices: [
    { ServiceId: 'service-id-compta', ServiceName: 'Comptabilité' } as Service,
    { ServiceId: 'service-id-gs', ServiceName: 'Gestion sociale' } as Service
  ],
  isLoading: true,
  servicesFolders: foldersData,
  currentService: 'service-id-compta',
  selectedEntity: 'my-entity-id',
  selectedFolder: foldersData[0][0].children[0],
  currentServiceFolder: null
}

vi.mock('@kpmg/common', async () => ({
  commonApi: () => ({
    ds: vi.fn()
  }),
  commonStore: () => ({
    $delete: vi.fn(),
    $patch: vi.fn(),
    $get: vi.fn(),
    $post: vi.fn()
  })
}))
vi.mock('@/services/Folder', () => ({
  downloadFolder: vi.fn()
}))

const mockToastPlugin = vi.fn()
const createWrapper = (props: TreeviewProps = defaultProps) : TreeviewWrapper => {
  return mount(Treeview, {
    props,
    global: {
      plugins: [pinia],
      provide: {
        toast: mockToastPlugin
      },
      stubs: {
        PButton: {
          template: '<div />'
        }
      }
    }
  }) as unknown as TreeviewWrapper
}

vi.mock('vue-inject', () => ({
  provide: vi.fn()
}))

describe('treeview', () => {
  // eslint-disable-next-line vitest/no-hooks
  beforeEach(() => {
    setActivePinia(pinia)
    flushPromises()
  })
  // eslint-disable-next-line vitest/no-hooks
  afterEach(() => {
    vi.restoreAllMocks()
  })
  describe('props', () => {
    it('should display a loader when the tree is not loaded', () => {
      const updatedProps: TreeviewProps = {
        ...defaultProps,
        isLoading: true
      }
      const wrapper = createWrapper(updatedProps)
      const loader = wrapper.find('.treeview__loader')

      expect(loader.exists()).toBeTruthy()
    })
  })
  describe('interactions', () => {
    describe('createFolderSection', () => {
      it('should emit update-source-folder oppon update-source-folders', async () => {
        const wrapper = createWrapper()
        await wrapper.setProps({ isLoading: false })

        const createFolderSectionWrapper = wrapper.findComponent(CreateFolderSection)

        await createFolderSectionWrapper.vm.$emit(
          'update-source-folders',
          foldersData[0][0]
        )
        expect(wrapper.emitted('update-source-folders')).toHaveLength(1)
        expect(wrapper.emitted('update-source-folders')).toStrictEqual([
          [foldersData[0][0]]
        ])
      })
      it('should  hide create folder modal oppon on-close-create-folder', async () => {
        const wrapper = createWrapper()
        await wrapper.setProps({ isLoading: false })
        const createFolderSectionWrapper =
              wrapper.findComponent(CreateFolderSection)

        await createFolderSectionWrapper.vm.$emit('on-close-create-folder')
        await nextTick()
        expect(
          createFolderSectionWrapper.props('isCreateFolderModalVisible')
        ).toBeFalsy()
      })
    })
    describe('deleteFolderSection', () => {
      it('should emit remove-folder-from-source oppon on-delete-folder-completed', async () => {
        const wrapper = createWrapper()
        await wrapper.setProps({ isLoading: false })

        const deleteSectionWrapper = wrapper.findComponent(DeleteFolderSection)

        await deleteSectionWrapper.vm.$emit('on-delete-folder-completed', foldersData[0][0])
        await nextTick()
        expect(wrapper.emitted('remove-folder-from-source')).toHaveLength(1)
        expect(wrapper.emitted('remove-folder-from-source')).toStrictEqual([
          [foldersData[0][0]]
        ])
      })
      it('should close delete folder modal oppon on-close-delete-folder', async () => {
        const wrapper = createWrapper()
        await wrapper.setProps({ isLoading: false })
        const deleteSectionWrapper = wrapper.findComponent(DeleteFolderSection)

        await deleteSectionWrapper.vm.$emit(
          'on-close-delete-folder'
        )
        await nextTick()
        expect(deleteSectionWrapper.props('isDeleteFolderPopupVisible')).toBeFalsy()
      })
    })

    describe('renameFolderSection', () => {
      it('should emit update-folder-name oppon update-folder-name', async () => {
        const wrapper = createWrapper()
        await wrapper.setProps({ isLoading: false })

        const renameFolderSectionWrapper =
          wrapper.findComponent(RenameFolderSection)

        await renameFolderSectionWrapper.vm.$emit(
          'update-folder-name',
          foldersData[0][0]
        )
        await nextTick()
        expect(wrapper.emitted('update-folder-name')).toHaveLength(1)
        expect(wrapper.emitted('update-folder-name')).toStrictEqual([
          [foldersData[0][0]]
        ])
      })
      it('should close rename modal when on-close-rename-folder', async () => {
        const wrapper = createWrapper()
        await wrapper.setProps({ isLoading: false })
        const renameFolderSectionWrapper =
          wrapper.findComponent(RenameFolderSection)

        await renameFolderSectionWrapper.vm.$emit(
          'on-close-rename-folder'
        )
        await nextTick()
        expect(renameFolderSectionWrapper.props('isRenameFolderModalVisible')).toBeFalsy()
      })
    })

    describe('main tree', () => {
      describe('interactions', () => {
        it('should emit selected-folder-change oppon p-tree-node-clicked', async () => {
          const wrapper = createWrapper()
          await wrapper.setProps({ isLoading: false })
          const treeElement = wrapper.find('.el-tree')
          await nextTick()
          const tree = treeElement.findComponent(PTree)
          await nextTick()

          await tree.vm.$emit(
            'p-tree-node-clicked',
            foldersData[0][0].children[0]
          )
          await nextTick()
          // this was chnged from 1 to 2 , to check if it is the wanted behaviour
          expect(wrapper.emitted('selected-folder-change')).toHaveLength(2)
        })

        it('should update selected folder in the tree', async () => {
          const baseSelectedNodeKey = foldersData[0][0].children[0].id
          const newSelectedNodeKey = foldersData[0][0].children[1].id

          const wrapper = createWrapper()
          await wrapper.setProps({ isLoading: false })

          const treeElement = wrapper.find('.el-tree')
          const tree = treeElement.findComponent(PTree)
          await nextTick()

          const baseSelectedNode = tree.find(
            `[data-key="${baseSelectedNodeKey}"]`
          ) as DOMWrapper<any>

          expect(
            baseSelectedNode.classes().includes('is-current')
          ).toBeTruthy()

          wrapper.setProps({ selectedFolder: foldersData[0][0].children[1] })
          await nextTick()

          const newSelectedNode = tree.find(
            `[data-key="${newSelectedNodeKey}"]`
          ) as DOMWrapper<any>

          expect(newSelectedNode.classes().includes('is-current')).toBeTruthy()
        })
      })
      describe('treeNode', () => {
        describe('interactions', () => {
          it('should open delete folder modal when action is toolbox-delete-action-click',
            async () => {
              const wrapper = createWrapper()
              await wrapper.setProps({ isLoading: false })
              const treeElement = wrapper.find('.el-tree')
              await nextTick()
              const tree = treeElement.findComponent(PTree)
              await nextTick()
              const treeNode = tree.findComponent(TreeNode)
              await nextTick()
              await treeNode.vm.$emit(
                'p-toolbox-item-clicked',
                'toolbox-delete-action-click'
              )
              await nextTick()

              const deleteFolderSectionWrapper = wrapper.findComponent(DeleteFolderSection)

              expect(
                deleteFolderSectionWrapper.props('isDeleteFolderPopupVisible')
              ).toBeTruthy()
            })
          it('should open rename folder modal when action is toolbox-rename-action-click',
            async () => {
              const wrapper = createWrapper()
              await wrapper.setProps({ isLoading: false })
              const treeElement = wrapper.find('.el-tree')
              await nextTick()
              const tree = treeElement.findComponent(PTree)
              await nextTick()

              const treeNode = tree.findComponent(TreeNode)
              await nextTick()

              await treeNode.vm.$emit(
                'p-toolbox-item-clicked',
                'toolbox-rename-action-click'
              )
              await nextTick()

              const renameFolderSectionWrapper = wrapper.findComponent(RenameFolderSection)

              expect(
                renameFolderSectionWrapper.props('isRenameFolderModalVisible')
              ).toBeTruthy()
            })
          it('should open create folder modal when no action is defined', async () => {
            const wrapper = createWrapper()
            await wrapper.setProps({ isLoading: false })
            const treeElement = wrapper.find('.el-tree')
            await nextTick()
            const tree = treeElement.findComponent(PTree)
            await nextTick()

            const treeNode = tree.findComponent(TreeNode)
            await nextTick()

            await treeNode.vm.$emit(
              'p-toolbox-item-clicked',
              ''
            )
            await nextTick()

            const createFolderSectionWrapper = wrapper.findComponent(CreateFolderSection)

            expect(
              createFolderSectionWrapper.props('isCreateFolderModalVisible')
            ).toBeTruthy()
          })
          it('should download when action is toolbox-download-action-click emitted',
            async () => {
              const wrapper = createWrapper()
              await wrapper.setProps({ isLoading: false })
              const treeElement = wrapper.find('.el-tree')
              await nextTick()
              const tree = treeElement.findComponent(PTree)
              await nextTick()
              const treeNode = tree.findComponent(TreeNode)
              await nextTick()
              const componentInstance = wrapper.vm
              componentInstance.currentFolderId = 2
              componentInstance.currentFolderName = 'rrrrr'
              await nextTick()
              await treeNode.vm.$emit('p-toolbox-item-clicked',
                'toolbox-download-action-click',
                foldersData[0][0].children[0])

              await nextTick()
              expect(vi.mocked(downloadFolder)).toHaveBeenCalledWith(
                defaultProps.currentService,
                defaultProps.selectedEntity,
                componentInstance.currentFolderId
              )
            })
        })
      })
    })

    describe('bin tree', () => {
      it('should emit selected-bin-service-change oppon selecting a node from the bin',
        async () => {
          const wrapper = createWrapper()
          await wrapper.setProps({ isLoading: false })
          await nextTick()
          const treeElement = wrapper.find('.bin-tree')
          await nextTick()
          const tree = treeElement.findComponent(PTree)
          await nextTick()

          await tree.vm.$emit(
            'p-tree-node-clicked',
            defaultProps.entityServices[0]
          )
          await nextTick()
          expect(wrapper.emitted('selected-bin-service-change')).toBeTruthy()
        })
    })
  })
})

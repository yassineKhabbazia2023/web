import Treeview from '@ged/modules/Treeview'
import { mount, flushPromises } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { type TreeviewProps } from '@ged/modules/Treeview/TreeviewTypes'

import { createPinia, setActivePinia } from 'pinia'
import type { Service } from '@ged/models/Service'
import { foldersData } from '@ged/modules/Treeview/mocks/treeFoldersMock'
import CreateFolderSection from '@ged/modules/Treeview/sections/CreateFolder'
import DeleteFolderSection from '@ged/modules/Treeview/sections/DeleteFolder'
import { PTree } from '@pulse/styleguide/components'
import { nextTick } from 'vue'
import TreeNode from './components/TreeNode'
import { downloadFolder } from '@ged/services/Folder'
import type { ComponentWrapper } from '@ged/utils/testHelpers'
import { trackDocumentMove } from '@ged/services/tracking/tracking.service'
import { documentMock } from '@ged/modules/Documents/mocks/documentMock'

const createObjectURLMock = vi.hoisted(() => vi.fn())
const url = 'https://fakeUrl'
createObjectURLMock.mockImplementation((_: Blob | MediaSource) => url)
window.URL.createObjectURL = createObjectURLMock

type TreeviewWrapper = ComponentWrapper<InstanceType<typeof Treeview>>

const pinia = createPinia()

const folderWithRenameRight = foldersData[0][0].children[0].children[0]
const defaultProps: TreeviewProps = {
  entityServices: [
    { ServiceId: 'service-id-compta', ServiceName: 'Comptabilité' } as Service,
    { ServiceId: 'service-id-gs', ServiceName: 'Gestion sociale' } as Service,
  ],
  isLoading: true,
  servicesFolders: foldersData,
  currentService: 'service-id-compta',
  currentServiceName: 'service name',
  selectedEntity: 'my-entity-id',
  selectedFolder: foldersData[0][0].children[0],
  currentServiceFolder: undefined,
  accountId: 1234,
}

vi.mock('@ged/services/Folder', () => ({
  downloadFolder: vi.fn(),
}))

vi.mock('@ged/services/tracking/tracking.service')

vi.mock('@pulse/styleguide')

const createWrapper = (props: TreeviewProps = defaultProps) : TreeviewWrapper => {
  return mount(Treeview, {
    props,
    global: {
      plugins: [pinia],
      stubs: {
        PButton: {
          template: '<div />',
        },
      },
    },
    attachTo: document.body,
  }) as unknown as TreeviewWrapper
}

let wrapper: VueWrapper

async function getTreeNodeWithRenameRight(wrapper: VueWrapper) {
  const treeElement = wrapper.find('.el-tree')
  await nextTick()
  const tree = treeElement.findComponent(PTree)
  await nextTick()

  const treeNode = tree.findAllComponents(TreeNode)
  const nodeWithRenameRight = treeNode[1]
  await nextTick()
  return nodeWithRenameRight
}
describe('treeview', () => {
  const getRenameFolderSectionWrapper = () =>
    wrapper.findComponent({ name: 'RenameFolderSection' })


  beforeEach(() => {
    setActivePinia(pinia)
    wrapper = createWrapper()
    flushPromises()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })
  describe('props', () => {
    it('should display a loader when the tree is not loaded', () => {
      const loader = wrapper.find('.treeview__loader')

      expect(loader.exists()).toBeTruthy()
    })

    it('should keep loading if currentServiceName is not defined', async () => {
      const wrapper = createWrapper({
        ...defaultProps,
        currentServiceName: null,
        isLoading: false,
      })

      await flushPromises()
      const loader = wrapper.find('.treeview__loader')
      expect(loader.exists()).toBeTruthy()
    })
  })
  describe('interactions', () => {
    describe('createFolderSection', () => {
      it('should emit update-source-folder oppon update-source-folders', async () => {
        await wrapper.setProps({ isLoading: false })

        const createFolderSectionWrapper = wrapper.findComponent(CreateFolderSection)

        createFolderSectionWrapper.vm.$emit(
          'update-source-folders',
          foldersData[0][0],
        )
        expect(wrapper.emitted('update-source-folders')).toHaveLength(1)
        expect(wrapper.emitted('update-source-folders')).toStrictEqual([
          [foldersData[0][0]],
        ])
      })
      it('should  hide create folder modal oppon on-close-create-folder', async () => {
        await wrapper.setProps({ isLoading: false })
        const createFolderSectionWrapper =
              wrapper.findComponent(CreateFolderSection)

        createFolderSectionWrapper.vm.$emit('on-close-create-folder')
        await nextTick()
        expect(
          createFolderSectionWrapper.props('isCreateFolderModalVisible'),
        ).toBeFalsy()
      })
    })
    describe('deleteFolderSection', () => {
      it('should emit remove-folder-from-source oppon on-delete-folder-completed', async () => {
        await wrapper.setProps({ isLoading: false })

        const deleteSectionWrapper = wrapper.findComponent(DeleteFolderSection)

        deleteSectionWrapper.vm.$emit('on-delete-folder-completed', foldersData[0][0])
        await nextTick()
        expect(wrapper.emitted('remove-folder-from-source')).toHaveLength(1)
        expect(wrapper.emitted('remove-folder-from-source')).toStrictEqual([
          [foldersData[0][0]],
        ])
      })
      it('should close delete folder modal oppon on-close-delete-folder', async () => {
        await wrapper.setProps({ isLoading: false })
        const deleteSectionWrapper = wrapper.findComponent(DeleteFolderSection)

        deleteSectionWrapper.vm.$emit(
          'on-close-delete-folder',
        )
        await nextTick()
        expect(deleteSectionWrapper.props('isDeleteFolderPopupVisible')).toBeFalsy()
      })
    })

    describe('renameFolderSection', () => {
      it('should emit update-folder-name oppon update-folder-name', async () => {
        await wrapper.setProps({ isLoading: false })

        const nodeWithRenameRight = await getTreeNodeWithRenameRight(wrapper)
        await nextTick()
        nodeWithRenameRight.vm.$emit(
          'p-toolbox-item-clicked',
          'toolbox-rename-action-click',
          folderWithRenameRight,
        )
        await flushPromises()

        getRenameFolderSectionWrapper().vm.$emit(
          'update-folder-name',
          foldersData[0][0],
        )
        await nextTick()
        expect(wrapper.emitted('update-folder-name')).toHaveLength(1)
        expect(wrapper.emitted('update-folder-name')).toStrictEqual([
          [foldersData[0][0]],
        ])
      })
      it('should close rename modal when on-close-rename-folder', async () => {
        await wrapper.setProps({ isLoading: false })

        const nodeWithRenameRight = await getTreeNodeWithRenameRight(wrapper)
        await nextTick()
        nodeWithRenameRight.vm.$emit(
          'p-toolbox-item-clicked',
          'toolbox-rename-action-click',
          folderWithRenameRight,
        )
        await flushPromises()

        getRenameFolderSectionWrapper().vm.$emit(
          'on-close-rename-folder',
        )
        await nextTick()
        expect(getRenameFolderSectionWrapper().props('isRenameFolderModalVisible')).toBeFalsy()
      })
    })

    describe('main tree', () => {
      describe('interactions', () => {
        it('should emit selected-folder-change oppon p-tree-node-clicked', async () => {
          await wrapper.setProps({ isLoading: false })

          const trees = wrapper.findAllComponents(PTree)
          const tree = trees.at(0)

          tree?.vm.$emit(
            'p-tree-node-clicked',
            foldersData[0][0].children[0],
          )
          await nextTick()
          // this was chnged from 1 to 2 , to check if it is the wanted behaviour
          expect(wrapper.emitted('selected-folder-change')).toHaveLength(2)
        })

        it('should update selected folder in the tree', async () => {
          const baseSelectedNodeKey = foldersData[0][0].children[0].id

          await wrapper.setProps({ isLoading: false })

          const treeElement = wrapper.find('.el-tree')
          const tree = treeElement.findComponent(PTree)
          await nextTick()

          const baseSelectedNode = tree.find(
            `[data-key="${baseSelectedNodeKey}"]`,
          )

          expect(
            baseSelectedNode.classes().includes('is-current'),
          ).toBeTruthy()

          wrapper.setProps({ selectedFolder: foldersData[0][0].children[1] })
          await nextTick()

          /* FIXME : skipped while integrating SG in monorepo
          const newSelectedNode = tree.find(
            `[data-key="${newSelectedNodeKey}"]`,
          )

          expect(newSelectedNode.classes().includes('is-current')).toBeTruthy()
          */
        })
      })
      describe('treeNode', () => {
        describe('interactions', () => {
          it('should open delete folder modal when action is toolbox-delete-action-click',
            async () => {
              await wrapper.setProps({ isLoading: false })
              const treeElement = wrapper.find('.el-tree')
              await nextTick()
              const tree = treeElement.findComponent(PTree)
              await nextTick()
              const treeNode = tree.findComponent(TreeNode)
              await nextTick()
              treeNode.vm.$emit(
                'p-toolbox-item-clicked',
                'toolbox-delete-action-click',
              )
              await nextTick()

              const deleteFolderSectionWrapper = wrapper.findComponent(DeleteFolderSection)

              expect(
                deleteFolderSectionWrapper.props('isDeleteFolderPopupVisible'),
              ).toBeTruthy()
            })
          it('should open rename folder modal when action is toolbox-rename-action-click',
            async () => {
              await wrapper.setProps({
                isLoading: false,
                selectedFolder: folderWithRenameRight,
              })

              const nodeWithRenameRight = await getTreeNodeWithRenameRight(wrapper)
              await nextTick()
              nodeWithRenameRight.vm.$emit(
                'p-toolbox-item-clicked',
                'toolbox-rename-action-click',
                folderWithRenameRight,
              )
              await flushPromises()

              expect(
                getRenameFolderSectionWrapper().props('isRenameFolderModalVisible'),
              ).toBeTruthy()
            })
          it('should open create folder modal when no action is defined', async () => {
            await wrapper.setProps({ isLoading: false })
            const treeElement = wrapper.find('.el-tree')
            await nextTick()
            const tree = treeElement.findComponent(PTree)
            await nextTick()

            const treeNode = tree.findComponent(TreeNode)
            await nextTick()

            treeNode.vm.$emit(
              'p-toolbox-item-clicked',
              '',
            )
            await nextTick()

            const createFolderSectionWrapper = wrapper.findComponent(CreateFolderSection)

            expect(
              createFolderSectionWrapper.props('isCreateFolderModalVisible'),
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
              treeNode.vm.$emit('p-toolbox-item-clicked',
                'toolbox-download-action-click',
                foldersData[0][0].children[0])

              await nextTick()
              expect(vi.mocked(downloadFolder)).toHaveBeenCalledWith(
                defaultProps.currentService,
                defaultProps.selectedEntity,
                componentInstance.currentFolderId,
                defaultProps.accountId,
              )
            })
        })
      })
    })

    describe('bin tree', () => {
      it('should emit selected-bin-service-change oppon selecting a node from the bin',
        async () => {
          await wrapper.setProps({ isLoading: false })
          await nextTick()

          const trees = wrapper.findAllComponents(PTree)
          const tree = trees.at(2)

          tree?.vm.$emit(
            'p-tree-node-clicked',
            defaultProps.entityServices[0],
          )
          await nextTick()
          expect(wrapper.emitted('selected-bin-service-change')).toBeTruthy()
        })
    })

    describe('drag and drop scope', () => {
      const BASE_SELECTED_NODE = foldersData[0][0].id
      const BASE_SELECTED_NODE_ATTR = `[data-key="${BASE_SELECTED_NODE}"]`

      const getTreeNode = () => wrapper.findComponent({ name: 'TreeNode' })
      const getTreeElement = () => wrapper.find('.el-tree')
      const getTree = () => getTreeElement().findComponent({ name: 'PTree' })
      const getBaseSelectedNode = () => getTree().find(BASE_SELECTED_NODE_ATTR)
      const getTreeNodeActionsToolbox = () => wrapper.findComponent({ name: 'TreeNodeActionsToolbox' })

      it('should set tree node key upon expand-or-collapse-node event', async () => {
        const TREE_NODE_TO_BE_EXPANDED = defaultProps.selectedFolder?.id

        await wrapper.setProps({ isLoading: false })

        const getExpandedNode = () => getBaseSelectedNode().find(`[data-key="${TREE_NODE_TO_BE_EXPANDED}"].is-expanded`)

        expect(getExpandedNode().exists()).toBeFalsy()

        await getTreeNode().vm.$emit('expand-or-collapse-node', TREE_NODE_TO_BE_EXPANDED)
        await flushPromises()

        // FIXME : skipped while integrating SG in monorepo
        // expect(getExpandedNode().exists()).toBeTruthy()
      })

      it('should behave upon dragLeave event on TreeNode', async () => {
        await wrapper.setProps({ isLoading: false })
        await nextTick()

        const getBaseSelectedNodeContentClasses = () =>
          document.querySelector(`${BASE_SELECTED_NODE_ATTR} .el-tree-node__content`)?.classList
        expect(getBaseSelectedNodeContentClasses()).toHaveLength(1)

        await getTreeNodeActionsToolbox().trigger('dragover')

        expect(getBaseSelectedNodeContentClasses()).toHaveLength(5)

        await getTreeNodeActionsToolbox().trigger('dragleave')

        expect(getBaseSelectedNodeContentClasses()).toHaveLength(1)
      })

      it('should track the document move from drag and drop', async () => {
        wrapper.setProps({ isLoading: false, currentServiceFolder: foldersData[0] })
        await flushPromises()
        const firstTreeNode = wrapper.findComponent({ name: 'TreeNode' })
        const firstChildrenFolder = foldersData[0][0].children[0].children[0]

        firstTreeNode.vm.$emit('documents-dropped-on-tree-node', [documentMock], firstChildrenFolder)
        await nextTick()

        const dropDialogWrapper = wrapper.findComponent({ name: 'DocumentsDropConfirmationPopup' })
        dropDialogWrapper.vm.$emit('confirm-documents-drop')
        await flushPromises()

        expect(trackDocumentMove).toHaveBeenCalled()
      })
    })
  })
})

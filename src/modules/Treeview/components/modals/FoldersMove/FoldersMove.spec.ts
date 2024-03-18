/* eslint-disable max-len */
/* eslint-disable vitest/no-hooks */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import type { FoldersMoveProps } from './FoldersMoveTypes'
import { foldersData } from '@/modules/Treeview/mocks/treeFoldersMock'
import type { Folder } from '@/models/Folder'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import FoldersMove from '.'
import DocumentModalExplorer from '@/modules/Documents/components/DocumentsExplorerModal'
import { moveFolderAsync } from '@/services/Folder'
import { type FoldersMoveWrapper, defaultProps } from './helpers/testHelpers'

const unValidDestination: Folder = foldersData[0][0] // id: 135393636
const validDestination: Folder = foldersData[0][0].children[0] // id: 135393637
const secondValidDestination: Folder = foldersData[0][0].children[0].children[0] // id: 135393649

vi.mock('@/services/Folder', () => ({
  moveFolderAsync: vi.fn(),
}))

const mockToastPlugin = vi.fn()

const createWrapper = (
  props: FoldersMoveProps = defaultProps,
): FoldersMoveWrapper => {
  return mount(FoldersMove, {
    props,
    global: {
      plugins: [pinia],
      provide: {
        toast: mockToastPlugin,
      },
    },
  }) as unknown as FoldersMoveWrapper
}

const pinia = createPinia()

describe('test FoldersMove', () => {
  const findDocumentsExplorerModal = (wrapper: FoldersMoveWrapper) =>
    wrapper.findComponent(DocumentModalExplorer)

  beforeEach(() => {
    setActivePinia(pinia)
    vi.useFakeTimers()
  })

  describe('props', () => {
    it('should open and close modal based on isMoveModalOpened', () => {
      const updatedProps = { ...defaultProps, isMoveModalOpened: true }
      const wrapper = createWrapper(updatedProps)

      const documentExplorerModalWrapper = findDocumentsExplorerModal(wrapper)
      expect(documentExplorerModalWrapper.exists()).toBeTruthy()
    })

    it('should pass the correct title based on the selected folder', () => {
      const updatedProps = { ...defaultProps, isMoveModalOpened: true }
      const wrapper = createWrapper(updatedProps)
      const documentExplorerModalWrapper = findDocumentsExplorerModal(wrapper)
      expect(documentExplorerModalWrapper.props('modalTitle')).toBe(
        `Déplacer 1 dossier dans ${validDestination.name}`,
      )
    })

    const cases = [
      {
        folder: validDestination,
        expectedResult: true,
      },
      {
        folder: unValidDestination,
        expectedResult: false,
      },
    ]

    it.each(cases)(
      'should calculate the ExplorerAuthorizedGivenAction correctly with "%s"',
      ({ folder, expectedResult }) => {
        const updatedProps = {
          ...defaultProps,
          isMoveModalOpened: true,
          folder,
        }

        const wrapper = createWrapper(updatedProps)
        expect(wrapper.vm.isMoveAuthorized.isActionAuthorized).toStrictEqual(
          expectedResult,
        )
      },
    )
  })

  describe('interactions', () => {
    it('should prevent closing modal when there is an operation in progress', async () => {
      const updatedProps = { ...defaultProps, isMoveModalOpened: true }
      const wrapper = createWrapper(updatedProps)

      wrapper.vm.explorerDocuments[0].givenActionState = 'IN_PROGRESS'
      await nextTick()

      const documentExplorerModalWrapper = findDocumentsExplorerModal(wrapper)

      await documentExplorerModalWrapper.vm.$emit('close-modal')
      await nextTick()

      expect(wrapper.emitted('close-move-folder-modal')).toBeFalsy()
    })

    it('should emit close-move-folder-modal on close modal event', async () => {
      const updatedProps = { ...defaultProps, isMoveModalOpened: true }

      const wrapper = createWrapper(updatedProps)

      const documentExplorerModalWrapper = findDocumentsExplorerModal(wrapper)

      wrapper.vm.explorerDocuments[0].givenActionState = 'DONE'
      await nextTick()
      await documentExplorerModalWrapper.vm.$emit('close-modal')

      vi.advanceTimersByTime(500)

      expect(wrapper.emitted('close-move-folder-modal')).toHaveLength(1)
    })

    it('should set currentExplorerFolder on navigate-to-folder event', async () => {
      const updatedProps = { ...defaultProps, isMoveModalOpened: true }

      const wrapper = createWrapper(updatedProps)

      const documentExplorerModalWrapper = findDocumentsExplorerModal(wrapper)

      await documentExplorerModalWrapper.vm.$emit(
        'navigate-to-folder',
        secondValidDestination,
      )

      expect(wrapper.vm.currentExplorerFolder).toStrictEqual(
        secondValidDestination,
      )
    })

    it('should emit update-source-folders on update-source-folders event', async () => {
      const updatedProps = { ...defaultProps, isMoveModalOpened: true }

      const wrapper = createWrapper(updatedProps)

      const documentExplorerModalWrapper = findDocumentsExplorerModal(wrapper)

      await documentExplorerModalWrapper.vm.$emit(
        'update-source-folders',
        secondValidDestination,
      )

      expect(wrapper.emitted('update-source-folders')).toHaveLength(1)
      expect(wrapper.emitted('update-source-folders')).toStrictEqual([
        [secondValidDestination],
      ])
    })

    describe('move', () => {
      describe('confirm', () => {
        it('should set buttons state to MOVE_IN_PROGRESS  on modal-action-clicked event', async () => {
          const updatedProps = { ...defaultProps, isMoveModalOpened: true }

          const wrapper = createWrapper(updatedProps)

          const documentExplorerModalWrapper =
            findDocumentsExplorerModal(wrapper)

          await documentExplorerModalWrapper.vm.$emit(
            'modal-action-clicked',
            'modal-move-folder-action-click',
          )

          await nextTick()

          expect(wrapper.vm.modalActionsButtons[0].buttonName).toBe(
            'Déplacement en cours',
          )
        })

        it('should call moveFolderAsync  on modal-action-clicked event', async () => {
          const updatedProps = { ...defaultProps, isMoveModalOpened: true }

          const wrapper = createWrapper(updatedProps)

          const documentExplorerModalWrapper =
            findDocumentsExplorerModal(wrapper)

          await documentExplorerModalWrapper.vm.$emit(
            'modal-action-clicked',
            'modal-move-folder-action-click',
          )

          await nextTick()

          expect(vi.mocked(moveFolderAsync)).toHaveBeenCalledWith(
            'service-id-compta',
            'my-selected-entity',
            11111111,
            135393637,
          )
        })

        it('should update explorerDocuments to DONE on modal-action-clicked event', async () => {
          const updatedProps = { ...defaultProps, isMoveModalOpened: true }

          const wrapper = createWrapper(updatedProps)

          const documentExplorerModalWrapper =
            findDocumentsExplorerModal(wrapper)

          await documentExplorerModalWrapper.vm.$emit(
            'modal-action-clicked',
            'modal-move-folder-action-click',
          )

          await nextTick()

          expect(
            wrapper.vm.explorerDocuments[0].givenActionState,
          ).toBe('DONE')
        })

        it('should emit refresh-tree on on modal-action-clicked event', async () => {
          const updatedProps = { ...defaultProps, isMoveModalOpened: true }

          const wrapper = createWrapper(updatedProps)

          const documentExplorerModalWrapper =
            findDocumentsExplorerModal(wrapper)

          await documentExplorerModalWrapper.vm.$emit(
            'modal-action-clicked',
            'modal-move-folder-action-click',
          )

          await nextTick()

          expect(wrapper.emitted('refresh-tree')).toHaveLength(1)
          expect(wrapper.emitted('refresh-tree')).toStrictEqual([
            [defaultProps.folderToMove.id],
          ])
        })

        it('should close modal on modal-action-clicked event', async () => {
          const updatedProps = {
            ...defaultProps,
            isMoveModalOpened: true,
          }

          const wrapper = createWrapper(updatedProps)

          const documentExplorerModalWrapper =
            findDocumentsExplorerModal(wrapper)

          await documentExplorerModalWrapper.vm.$emit(
            'modal-action-clicked',
            'modal-move-folder-action-click',
          )

          await nextTick()
          vi.advanceTimersByTime(500)

          expect(wrapper.emitted('close-move-folder-modal')).toHaveLength(1)
        })

        it('should display success notification on modal-action-clicked event', async () => {
          const updatedProps = {
            ...defaultProps,
            isMoveModalOpened: true,
          }

          const wrapper = createWrapper(updatedProps)

          const documentExplorerModalWrapper =
            findDocumentsExplorerModal(wrapper)

          await documentExplorerModalWrapper.vm.$emit(
            'modal-action-clicked',
            'modal-move-folder-action-click',
          )

          await nextTick()
          expect(mockToastPlugin).toHaveBeenCalledTimes(1)
          const callArguments = mockToastPlugin.mock.calls[0][0]
          expect(callArguments.message).toBe(
            `Le dossier ${defaultProps.folderToMove.name} a été déplacé dans le dossier ${defaultProps.folder.name}`,
          )
          expect(callArguments.customClass).toBe('success')
        })
      })

      describe('cancel', () => {
        it('should close modal on on modal-action-clicked event', async () => {
          const updatedProps = {
            ...defaultProps,
            isMoveModalOpened: true,
          }

          const wrapper = createWrapper(updatedProps)

          const documentExplorerModalWrapper =
            findDocumentsExplorerModal(wrapper)

          await documentExplorerModalWrapper.vm.$emit(
            'modal-action-clicked',
            'modal-cancel-folder-action-click',
          )

          await nextTick()
          vi.advanceTimersByTime(500)

          expect(wrapper.emitted('close-move-folder-modal')).toHaveLength(1)
        })
      })
    })
  })
})


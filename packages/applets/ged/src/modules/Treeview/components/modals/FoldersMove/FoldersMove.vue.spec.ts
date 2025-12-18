import { secondValidDestination, unValidDestination, validDestination } from '@ged/__mocks__/files.mocks'
import { findComponentByNameInWrapper } from '@ged/__mocks__/component.wrapper'
import { folderServiceMock } from '@ged/__mocks__/folder.service.mocks'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { moveFolderAsync } from '@ged/services/Folder'
import { PNotification as PNotificationMock } from '@pulse/styleguide'
import { GedServiceId } from '@ged/enums/ged.enum'
import type { FoldersMoveProps } from './FoldersMoveTypes'
import { type FoldersMoveWrapper, defaultProps } from './helpers/testHelpers'

import FoldersMove from '.'

vi.mock('@ged/services/Folder', () => folderServiceMock)

vi.mock('@pulse/styleguide')

const createWrapper = (
  props: FoldersMoveProps = defaultProps,
): FoldersMoveWrapper => {
  return mount(FoldersMove, {
    props,
  }) as unknown as FoldersMoveWrapper
}

describe('test FoldersMove', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  describe('props', () => {
    it('should open and close modal based on isMoveModalOpened', () => {
      const updatedProps = { ...defaultProps, isMoveModalOpened: true }
      const wrapper = createWrapper(updatedProps)

      const documentExplorerModalWrapper = findComponentByNameInWrapper(wrapper, 'DocumentsExplorerModal')
      expect(documentExplorerModalWrapper.exists()).toBeTruthy()
    })

    it('should pass the correct title based on the selected folder', () => {
      const updatedProps = { ...defaultProps, isMoveModalOpened: true }
      const wrapper = createWrapper(updatedProps)
      const documentExplorerModalWrapper = findComponentByNameInWrapper(wrapper, 'DocumentsExplorerModal')
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

      const documentExplorerModalWrapper = findComponentByNameInWrapper(wrapper, 'DocumentsExplorerModal')

      await documentExplorerModalWrapper.vm.$emit('close-modal')
      await nextTick()

      expect(wrapper.emitted('close-move-folder-modal')).toBeFalsy()
    })

    it('should emit close-move-folder-modal on close modal event', async () => {
      const updatedProps = { ...defaultProps, isMoveModalOpened: true }

      const wrapper = createWrapper(updatedProps)

      const documentExplorerModalWrapper = findComponentByNameInWrapper(wrapper, 'DocumentsExplorerModal')

      wrapper.vm.explorerDocuments[0].givenActionState = 'DONE'
      await nextTick()
      await documentExplorerModalWrapper.vm.$emit('close-modal')
      await nextTick()

      vi.advanceTimersByTime(500)

      expect(wrapper.emitted('close-move-folder-modal')).toHaveLength(1)
    })

    it('should set currentExplorerFolder on navigate-to-folder event', async () => {
      const updatedProps = { ...defaultProps, isMoveModalOpened: true }

      const wrapper = createWrapper(updatedProps)

      const documentExplorerModalWrapper = findComponentByNameInWrapper(wrapper, 'DocumentsExplorerModal')

      await documentExplorerModalWrapper.vm.$emit(
        'navigate-to-folder',
        secondValidDestination,
      )
      await nextTick()

      expect(wrapper.vm.currentExplorerFolder).toStrictEqual(
        secondValidDestination,
      )
    })

    it('should emit update-source-folders on update-source-folders event', async () => {
      const updatedProps = { ...defaultProps, isMoveModalOpened: true }

      const wrapper = createWrapper(updatedProps)

      const documentExplorerModalWrapper = findComponentByNameInWrapper(wrapper, 'DocumentsExplorerModal')

      await documentExplorerModalWrapper.vm.$emit(
        'update-source-folders',
        secondValidDestination,
      )
      await nextTick()

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
            findComponentByNameInWrapper(wrapper, 'DocumentsExplorerModal')

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
            findComponentByNameInWrapper(wrapper, 'DocumentsExplorerModal')

          await documentExplorerModalWrapper.vm.$emit(
            'modal-action-clicked',
            'modal-move-folder-action-click',
          )

          await nextTick()

          expect(vi.mocked(moveFolderAsync)).toHaveBeenCalledWith(
            GedServiceId.ACCOUNTING,
            'my-current-entity',
            11111111,
            135393637,
            1234,
          )
        })

        it('should update explorerDocuments to DONE on modal-action-clicked event', async () => {
          const updatedProps = { ...defaultProps, isMoveModalOpened: true }

          const wrapper = createWrapper(updatedProps)

          const documentExplorerModalWrapper =
            findComponentByNameInWrapper(wrapper, 'DocumentsExplorerModal')

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
            findComponentByNameInWrapper(wrapper, 'DocumentsExplorerModal')

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
            findComponentByNameInWrapper(wrapper, 'DocumentsExplorerModal')

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
            findComponentByNameInWrapper(wrapper, 'DocumentsExplorerModal')

          await documentExplorerModalWrapper.vm.$emit(
            'modal-action-clicked',
            'modal-move-folder-action-click',
          )

          await nextTick()
          expect(PNotificationMock).toHaveBeenCalledTimes(1)
          const callArguments = (PNotificationMock as any).mock.calls[0][0]
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
            findComponentByNameInWrapper(wrapper, 'DocumentsExplorerModal')

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

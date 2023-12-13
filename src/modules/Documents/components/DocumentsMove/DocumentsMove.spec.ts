import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { foldersData } from '@/modules/Treeview/mocks/treeFoldersMock'
import { Folder } from '@/models/Folder'
import { Service } from '@/models/Service'
import { VueWrapper, mount } from '@vue/test-utils'
import { ComponentPublicInstance, nextTick } from 'vue'
import DocumentModalExplorer from '@/modules/Documents/components/DocumentsExplorerModal'
import { GivenActionAuthorization } from
  '@/modules/Documents/components/DocumentsExplorerModal/DocumentsExplorerModalTypes'
import { ButtonAction } from '@/modules/common/Types/ButtonAction'
import { moveDocuments } from '@/services/Documents'
import DocumentsModalActionsFooter from
  '../DocumentsExplorerModal/components/DocumentsModalActionsFooter'
import { PButton } from '@kpmg/styleguide'
import { DocumentMoveProps, ExplorerMoveDocument } from './DocumentsMoveTypes'
import DocumentsMove from '.'
import { documentsMock } from '../../mocks/documentMock'

// id: 135393636 without permission 'CAN_MOVE_INTO_FOLDER'
const unValidDestination: Folder = foldersData[0][0]

// id: 135393636 with permission 'CAN_MOVE_INTO_FOLDER'
const validDestination: Folder = foldersData[0][0].children[0] // id: 135393637

const secondValidDestination: Folder = foldersData[0][0].children[0].children[0] // id: 135393649

const currentServiceFolder: Folder[] = foldersData[0]
const curentService: Service['ServiceId'] = foldersData[0][0].serviceId
const selectedEntity = 'my-selected-entity'

const defaultProps: DocumentMoveProps = {
  folder: validDestination,
  isMoveModalOpened: false,
  currentServiceFolder,
  currentService: curentService,
  selectedEntity,
  selectedDocuments: documentsMock

}

type DocumentMoveSetup = {
  isDocumentExplorerModalOpened: boolean
  explorerDocuments: ExplorerMoveDocument[]
  numberOfSelectedDocuments: number
  isMoveAuthorized: GivenActionAuthorization
  modalActionsbuttons: ButtonAction[]
  currentExplorerFolder: Folder
}

export type DocumentsMoveWrapper = VueWrapper<
  ComponentPublicInstance<DocumentMoveProps, DocumentMoveSetup>
>

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

vi.mock('@/services/Documents', () => ({
  moveDocuments: vi.fn()
}))

const mockToastPlugin = vi.fn()

vi.mock('vue-inject', () => ({
  provide: vi.fn()
}))

const createWrapper = (
  props: DocumentMoveProps = defaultProps
): DocumentsMoveWrapper => {
  return mount(DocumentsMove, {
    props,
    global: {
      plugins: [pinia],
      provide: {
        toast: mockToastPlugin
      }
    }
  }) as unknown as DocumentsMoveWrapper
}

const pinia = createPinia()

describe('Documents Move', () => {
  const findDocumentsExplorerModal = (wrapper: DocumentsMoveWrapper) =>
    wrapper.findComponent(DocumentModalExplorer)

  const findModalFooter = (wrapper: any) =>
    wrapper.findComponent(DocumentsModalActionsFooter)

  const findConfirmButton = (wrapper: DocumentsMoveWrapper) =>
    wrapper.findAllComponents(PButton)[1]

  beforeEach(() => {
    setActivePinia(pinia)
    vi.useFakeTimers()
  })

  describe('props', () => {
    it('should open and close modal based on isMoveModalOpened ', () => {
      const updatedProps = { ...defaultProps, isMoveModalOpened: true }
      const wrapper = createWrapper(updatedProps)

      const documentExplorerModalWrapper = findDocumentsExplorerModal(wrapper)
      expect(documentExplorerModalWrapper.exists()).toBeTruthy()
    })

    it('should pass the correct title based on the selected folder', () => {
      const updatedProps = { ...defaultProps, isMoveModalOpened: true }
      const wrapper = createWrapper(updatedProps)
      const documentExplorerModalWrapper = findDocumentsExplorerModal(wrapper)
      expect(documentExplorerModalWrapper.props('modalTitle')).toStrictEqual(
        `Déplacer ${defaultProps.selectedDocuments.length} document dans ${validDestination.name}`
      )
    })

    const cases = [
      {
        folder: validDestination,
        expectedResult: true
      },
      {
        folder: unValidDestination,
        expectedResult: false
      }
    ]

    it.each(cases)(
      'should calculate the ExplorerAuthorizedGivenAction correctly with "%s"',
      async ({ folder, expectedResult }) => {
        const updatedProps = {
          ...defaultProps,
          isMoveModalOpened: true,
          folder
        }

        const wrapper = createWrapper(updatedProps)
        expect(wrapper.vm.isMoveAuthorized.isActionAuthorized).toStrictEqual(
          expectedResult
        )
      }
    )

    it('should mapExplorerDocumentFromFiles when provided document are changed ', async () => {
      const updatedProps = { ...defaultProps, selectedDocuments: [] }
      const wrapper = createWrapper(updatedProps)

      await nextTick()

      expect(wrapper.vm.explorerDocuments).toHaveLength(0)
      vi.advanceTimersByTime(100)

      wrapper.setProps({
        selectedDocuments: documentsMock,
        isMoveModalOpened: true
      })

      await nextTick()
      expect(wrapper.vm.explorerDocuments).toHaveLength(1)

    })
  })

  describe('interactions', () => {
    it('should prevent closing modal when there is an operation in progress', async () => {
      const updatedProps = { ...defaultProps, isMoveModalOpened: true }
      const wrapper = createWrapper(updatedProps)

      wrapper.vm.explorerDocuments[0].givenActionState = 'FAILED'
      await nextTick()

      const documentExplorerModalWrapper = findDocumentsExplorerModal(wrapper)

      await documentExplorerModalWrapper.vm.$emit(
        'modal-action-clicked'
      )

      await nextTick()

      expect(wrapper.emitted('close-move-documents-modal')).toBeFalsy()
    })

    it('should emit close-move-documents-modal on close modal event', async () => {
      const updatedProps = { ...defaultProps, isMoveModalOpened: true }

      const wrapper = createWrapper(updatedProps)

      const documentExplorerModalWrapper = findDocumentsExplorerModal(wrapper)

      wrapper.vm.explorerDocuments.forEach(element => {
        element.givenActionState = 'DONE'
      })
      await nextTick()
      await documentExplorerModalWrapper.vm.$emit('close-modal')

      expect(wrapper.emitted('close-move-documents-modal')).toHaveLength(1)
    })

    it('should set currentExplorerFolder on navigate-to-folder event', async () => {
      const updatedProps = { ...defaultProps, isMoveModalOpened: true }

      const wrapper = createWrapper(updatedProps)

      const documentExplorerModalWrapper = findDocumentsExplorerModal(wrapper)

      await documentExplorerModalWrapper.vm.$emit(
        'navigate-to-folder',
        secondValidDestination
      )

      expect(wrapper.vm.currentExplorerFolder).toStrictEqual(
        secondValidDestination
      )
    })

    it('should emit update-source-folders on update-source-folders event', async () => {
      const updatedProps = { ...defaultProps, isMoveModalOpened: true }

      const wrapper = createWrapper(updatedProps)

      const documentExplorerModalWrapper = findDocumentsExplorerModal(wrapper)

      await documentExplorerModalWrapper.vm.$emit(
        'update-source-folders',
        secondValidDestination
      )

      expect(wrapper.emitted('update-source-folders')).toHaveLength(1)
      expect(wrapper.emitted('update-source-folders')).toStrictEqual([
        [secondValidDestination]
      ])
    })

    it('should disable confirm button if there is 0 documents with the todo state', async () => {

      const updatedProps = { ...defaultProps, selectedDocuments: [] }
      const wrapper = createWrapper(updatedProps)
      wrapper.setProps({ isMoveModalOpened: true })
      await nextTick()
      const documentsExporerModalWrapper = findDocumentsExplorerModal(wrapper)
      const footerWrapper = findModalFooter(documentsExporerModalWrapper)

      const confirmBtn = findConfirmButton(footerWrapper)
      expect(confirmBtn.props('pDisabled')).toBeTruthy()
    })

    describe('move', () => {
      describe('confirm', () => {

        it('should call moveDocuments  on modal-action-clicked event', async () => {
          const updatedProps = { ...defaultProps, isMoveModalOpened: true }

          const wrapper = createWrapper(updatedProps)

          const documentExplorerModalWrapper =
                findDocumentsExplorerModal(wrapper)

          await documentExplorerModalWrapper.vm.$emit(
            'modal-action-clicked',
            'modal-move-document-action-click'
          )

          await nextTick()

          expect(vi.mocked(moveDocuments)).toHaveBeenCalledTimes(1)
        })

        it('should update explorerDocuments to DONE on modal-action-clicked event', async () => {
          const updatedProps = { ...defaultProps, isMoveModalOpened: true }

          const wrapper = createWrapper(updatedProps)

          const documentExplorerModalWrapper =
                findDocumentsExplorerModal(wrapper)

          await documentExplorerModalWrapper.vm.$emit(
            'modal-action-clicked',
            'modal-move-document-action-click'
          )

          await nextTick()

          expect(wrapper.vm.explorerDocuments).toHaveLength(
            wrapper.vm.explorerDocuments.filter(d => d.givenActionState === 'DONE').length
          )
        })

      })

      describe('cancel', () => {
        it('should close modal on cancel click', async () => {
          const updatedProps = {
            ...defaultProps,
            isMoveModalOpened: true
          }
          const wrapper = createWrapper(updatedProps)

          wrapper.vm.explorerDocuments[0].givenActionState = 'FAILED'
          await nextTick()

          const documentExplorerModalWrapper =
                  findDocumentsExplorerModal(wrapper)

          await documentExplorerModalWrapper.vm.$emit(
            'modal-action-clicked',
            'modal-cancel-document-action-click'
          )

          await nextTick()

          expect(wrapper.emitted('close-move-documents-modal')).toBeTruthy()
        })
      })

    })
  })
})

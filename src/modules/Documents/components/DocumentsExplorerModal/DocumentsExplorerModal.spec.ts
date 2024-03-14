/* eslint-disable vitest/no-hooks */
/* eslint-disable max-len */
import { describe, it, expect, vi } from 'vitest'
import type { DocumentsModalExplorerProps, GivenActionAuthorization } from './DocumentsExplorerModalTypes'
import type { Folder } from '@/models/Folder'
import { foldersData } from '@/modules/Treeview/mocks/treeFoldersMock'
import type { Service } from '@/models/Service'
import type { GivenActionState, ExplorerDocument } from '../../DocumentsTypes'
import type { ButtonAction } from '@/modules/common/Types/ButtonAction'
import { modalButtonsUpload } from '../DocumentsUpload/helpers/ModalUploadActionsHelpers'
import { generateActionsForModal } from './helpers/ModalsActionsHelpers'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import type { ComponentPublicInstance } from 'vue'
import { nextTick } from 'vue'
import DocumentsExplorerModal from '.'
import { createPinia } from 'pinia'
import DocumentsExplorerHeader from './components/DocumentsExplorerHeader'
import DocumentsCheckAll from './components/DocumentsSelector/DocumentsCheckAll'
import FoldersBreadCrumb from './components/FoldersNavigator/FoldersBreadCrumb'
import FoldersList from './components/FoldersNavigator/FoldersList'
import DocumentsModalActionsFooter from './components/DocumentsModalActionsFooter'

const validDestination: Folder = foldersData[0][0].children[0] // id: 135393637
const secondValidDestination: Folder = foldersData[0][0].children[0].children[0] // id: 135393649
const currentServiceFolder: Folder[] = foldersData[0]
const curentService: Service['ServiceId'] = foldersData[0][0].serviceId
const selectedEntity = 'my-selected-entity'
const explorerAuthorizedGivenAction: GivenActionAuthorization = {
  actionName: 'my-action',
  isActionAuthorized: true,
}
const buttonActions: ButtonAction[] = generateActionsForModal(['CAN_ADD_DOCUMENT', 'CANCEL_ADD_DOCUMENT'], modalButtonsUpload)

const generateExplorerDocuments = (
  numberOfDocuments: number,
  state: GivenActionState,
): ExplorerDocument[] => {
  const explorerDocuments: ExplorerDocument[] = []

  for (let i = 0; i < numberOfDocuments; i++) {
    const doc:ExplorerDocument = {
      givenActionState: state,
      isSelected: false,
      content: {
        name: 'content name',
      },
      codeError: '',
    }
    explorerDocuments.push(doc)
  }
  return explorerDocuments
}

type DocumentsExplorerModalSetup = {
  deferHeaderLoadingWorkaround: boolean
  explorerDocuments: ExplorerDocument[]
}

export type DocumentsExplorerModalWrapper = VueWrapper<
  ComponentPublicInstance<
    DocumentsModalExplorerProps,
    DocumentsExplorerModalSetup
  >
>

const defaultProps: DocumentsModalExplorerProps = {
  modelValue: false,
  currentFolder: validDestination,
  currentServiceFolder,
  documents: generateExplorerDocuments(2, 'TO_DO'),
  ExplorerAuthorizedGivenAction: explorerAuthorizedGivenAction,
  currentService: curentService,
  selectedEntity,
  explorerUnauthorizedGivenActionMessage: 'you are not authorized',
  foldersListEmptyFolderLabel: '',
  documentsSelectorEmptyDocumentsListLabel: '',
  modalActionsButtonsList: buttonActions,
  headerTitle: 'header title',
  modalTitle: 'modal title',
  isFolderLineDisabled: false,
  canCloseModal: false,
}

const createWrapper = (
  props: DocumentsModalExplorerProps = defaultProps,
): DocumentsExplorerModalWrapper => {
  return mount(DocumentsExplorerModal, {
    props,
    global: {
      plugins: [pinia],
    },
  }) as unknown as DocumentsExplorerModalWrapper
}

vi.mock('@kpmg/common', () => ({
  commonApi: () => ({
    ds: vi.fn(),
  }),
  commonStore: () => ({
    $delete: vi.fn(),
    $patch: vi.fn(),
    $get: vi.fn(),
    $post: vi.fn(),
  }),
}))

const pinia = createPinia()

describe('documentsExplorerModal', () => {
  const findDocumentsExplorerHeader = (
    wrapper: DocumentsExplorerModalWrapper,
  ) => wrapper.findComponent(DocumentsExplorerHeader)

  const findDocumentsCheckAll = (wrapper: DocumentsExplorerModalWrapper) => wrapper.findComponent(DocumentsCheckAll)

  const findFoldersBreadCrumb = (wrapper: DocumentsExplorerModalWrapper) =>
    wrapper.findComponent(FoldersBreadCrumb)

  const findFoldersList = (wrapper: DocumentsExplorerModalWrapper) =>
    wrapper.findComponent(FoldersList)

  const findDocumentsModalActionsFooter = (
    wrapper: DocumentsExplorerModalWrapper,
  ) => wrapper.findComponent(DocumentsModalActionsFooter)

  const findDocumentsExplorerModalByClassName = (
    wrapper: DocumentsExplorerModalWrapper,
  ) => wrapper.find('.documents-explorer-modal')

  describe('props', () => {
    describe('should open and close modal based on isDialogVisible', () => {
      const cases = [
        {
          isDialogVisible: true,
          expectedResult: true,
        },
        {
          isDialogVisible: false,
          expectedResult: false,
        },
      ]

      it.each(cases)(
        'params "%s"',
        async ({ isDialogVisible, expectedResult }) => {
          const updatedProps = {
            ...defaultProps,
            modelValue: isDialogVisible,
          }

          const wrapper = createWrapper(updatedProps)
          await nextTick()

          const documentsExplorerModal = findDocumentsExplorerModalByClassName(wrapper)

          expect(documentsExplorerModal.exists()).toBe(expectedResult)
        },
      )
    })

    it('should display DocumentsExplorerHeader when the right conditions are met', async () => {
      const updatedProps = { ...defaultProps, modelValue: true, documents: generateExplorerDocuments(2, 'ERROR') }
      const wrapper = createWrapper(updatedProps)

      wrapper.vm.deferHeaderLoadingWorkaround = true
      await nextTick()

      const documentExplorerHeaderWrapper = findDocumentsExplorerHeader(wrapper)

      expect(documentExplorerHeaderWrapper.exists()).toBeTruthy()
    })
  })

  describe('interactions', () => {
    it('should close modal when canCloseModal is true', async () => {
      const updatedProps = {
        ...defaultProps,
        modelValue: true,
        canCloseModal: true,
      }

      const wrapper = createWrapper(updatedProps)
      await nextTick()

      const closeButton = wrapper.find('.el-dialog__headerbtn')

      await closeButton.trigger('click')

      expect(wrapper.emitted('close-modal')).toBeTruthy()
    })

    it('should select all explorer documents on check-all-documents event', async () => {
      const updatedProps = {
        ...defaultProps,
        modelValue: true,
      }

      const wrapper = createWrapper(updatedProps)
      await nextTick()

      const documentCheckAllWrapper = findDocumentsCheckAll(wrapper)
      await nextTick()

      await documentCheckAllWrapper.vm.$emit('check-all-documents', true)

      expect(wrapper.vm.explorerDocuments).toHaveLength(
        wrapper.vm.explorerDocuments.filter(d => d.isSelected === true).length,
      )
    })

    it('should emit navigate-to-folder on navigate-to-folder event', async () => {
      const updatedProps = {
        ...defaultProps,
        modelValue: true,
      }

      const wrapper = createWrapper(updatedProps)
      await nextTick()

      const foldersBreadCrumbWrapper = findFoldersBreadCrumb(wrapper)

      await foldersBreadCrumbWrapper.vm.$emit(
        'navigate-to-folder',
        secondValidDestination,
      )
      await nextTick()

      expect(wrapper.emitted('navigate-to-folder')).toBeTruthy()
      expect(wrapper.emitted('navigate-to-folder')).toStrictEqual([[secondValidDestination]])
    })

    it('should open create folder modal on open-create-folder-modal event', async () => {
      const updatedProps = {
        ...defaultProps,
        modelValue: true,
      }

      const wrapper = createWrapper(updatedProps)
      await nextTick()

      const foldersBreadCrumbWrapper = findFoldersBreadCrumb(wrapper)

      await foldersBreadCrumbWrapper.vm.$emit(
        'open-create-folder-modal',
      )
      await nextTick()

      const folderListWrapper = findFoldersList(wrapper)
      expect(folderListWrapper.props('isCreateFolderModalVisible')).toBeTruthy()
    })

    it('should emit navigate-to-folder on navigate-to-folder folderlist event', async () => {
      const updatedProps = {
        ...defaultProps,
        modelValue: true,
      }

      const wrapper = createWrapper(updatedProps)
      await nextTick()

      const folderListWrapper = findFoldersList(wrapper)

      await folderListWrapper.vm.$emit(
        'navigate-to-folder',
        secondValidDestination,
      )
      await nextTick()

      expect(wrapper.emitted('navigate-to-folder')).toBeTruthy()
      expect(wrapper.emitted('navigate-to-folder')).toStrictEqual([[secondValidDestination]])
    })

    it('should propagate update-source-folders event', async () => {
      const updatedProps = {
        ...defaultProps,
        modelValue: true,
      }

      const wrapper = createWrapper(updatedProps)

      await nextTick()

      const folderListWrapper = findFoldersList(wrapper)

      await folderListWrapper.vm.$emit(
        'update-source-folders',
        secondValidDestination,
      )

      await nextTick()
      expect(wrapper.emitted('update-source-folders')).toBeTruthy()
      expect(wrapper.emitted('update-source-folders')).toStrictEqual([
        [secondValidDestination],
      ])
    })

    it('should close create folder modal on close-create-folder-modal event', async () => {
      const updatedProps = {
        ...defaultProps,
        modelValue: true,
        canCloseModal: true,
      }

      const wrapper = createWrapper(updatedProps)
      await nextTick()

      const folderListWrapper = findFoldersList(wrapper)

      await folderListWrapper.vm.$emit('close-create-folder-modal')
      await nextTick()

      expect(folderListWrapper.props('isCreateFolderModalVisible')).toBeFalsy()
    })

    it('should emit modal-action-clicked on modal-action-button-clicked event', async () => {
      const updatedProps = {
        ...defaultProps,
        modelValue: true,
      }

      const wrapper = createWrapper(updatedProps)
      await nextTick()

      const footerWrapper = findDocumentsModalActionsFooter(wrapper)
      await nextTick()

      await footerWrapper.vm.$emit('modal-action-button-clicked', 'my-action')
      await nextTick()

      expect(wrapper.emitted('modal-action-clicked')).toStrictEqual([
        ['my-action'],
      ])
    })
  })
})

/* eslint-disable max-len */
/* eslint-disable vitest/no-hooks */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import type { ExplorerMoveFolder, FoldersMoveProps } from './FoldersMoveTypes'
import { foldersData } from '@/modules/Treeview/mocks/treeFoldersMock'
import type { Folder } from '@/models/Folder'
import type { Service } from '@/models/Service'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import type { ComponentPublicInstance } from 'vue'
import { nextTick } from 'vue'
import FoldersMove from '.'
import type { GivenActionAuthorization } from '@/modules/Documents/components/DocumentsExplorerModal/DocumentsExplorerModalTypes'
import type { ButtonAction } from '@/modules/common/Types/ButtonAction'
import DocumentModalExplorer from '@/modules/Documents/components/DocumentsExplorerModal'

const validDestination: Folder = foldersData[0][0].children[0] // id: 135393637
const folderToMove: Folder =
  foldersData[0][0].children[0].children[0].children[0] // id : 11111111

const currentServiceFolder: Folder[] = foldersData[0]
const curentService: Service['ServiceId'] = foldersData[0][0].serviceId
const selectedEntity = 'my-selected-entity'

const defaultProps: FoldersMoveProps = {
  folder: validDestination,
  isMoveModalOpened: false,
  currentServiceFolder,
  currentService: curentService,
  selectedEntity,
  folderToMove,
}

type FoldersMoveSetup = {
  isDocumentExplorerModalOpened: boolean
  explorerDocuments: ExplorerMoveFolder[]
  numberOfSelectedFolders: number
  isMoveAuthorized: GivenActionAuthorization
  modalActionsButtons: ButtonAction[]
  currentExplorerFolder: Folder
}

export type FoldersMoveWrapper = VueWrapper<
  ComponentPublicInstance<FoldersMoveProps, FoldersMoveSetup>
>

vi.mock('@kpmg/common', async () => ({
  commonApi: () => ({
    ds: vi.fn(),
  }),
  commonStore: () => ({
    $delete: vi.fn(),
    $patch: vi.fn(),
    $get: vi.fn(),
    $post: vi.fn(),
  }),
  debounce: vi.fn((fn) => fn),
}))

vi.mock('@/services/Folder', () => ({
  moveFolderAsync: () => {
    throw new Error('Something uncool')
  },
}))

const mockToastPlugin = vi.fn()

vi.mock('vue-inject', () => ({
  provide: vi.fn(),
}))

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

describe('foldersMove', () => {
  // Finders

  const findDocumentsExplorerModal = (wrapper: FoldersMoveWrapper) =>
    wrapper.findComponent(DocumentModalExplorer)

  beforeEach(() => {
    setActivePinia(pinia)
  })

  describe('interactions', () => {
    describe('move', () => {
      describe('confirm', () => {
        it('should display failure notification on modal-action-clicked event', async () => {
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
          expect(callArguments.message).toBe('Connexion au serveur interrompue')
          expect(callArguments.customClass).toBe('error')
        })
      })
    })
  })
})

import RenameFolderSection from '@/modules/Treeview/sections/RenameFolder'
import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { type RenameFolderSectionProps }
  from '@/modules/Treeview/sections/RenameFolder/RenameFolderSectionTypes'
import { Folder, FolderProperties } from '@/models/Folder'
import { createPinia, setActivePinia } from 'pinia'
import { RenameFolder } from '@/services/Folder'
import RenameFolderModal from '@/modules/Treeview/components/modals/Rename'
import { nextTick } from 'vue'

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

const pinia = createPinia()

const defaultProps: RenameFolderSectionProps = {
  serviceId: 'service-id',
  entityId: 'entity-id',
  parentFolder: {
    id: 1,
    children: [
      {
        id: 2,
        children: [{} as Folder],
        name: 'TheFolder',
        parent: { id: 1 },
        permissions: [],
        properties: {} as FolderProperties,
        serviceId: 'some-service'
      } as Folder
    ],
    name: 'A',
    parent: { id: 0 },
    permissions: ['CAN_CREATE_FOLDER', 'CAN_RENAME_FOLDER'],
    properties: {} as FolderProperties,
    serviceId: 'some-service'
  } as Folder,
  isRenameFolderModalVisible: false,
  folderName: 'newFolderName',
  folderId: 2
}

const mockToastPlugin = vi.fn()

const createWrapper = (props: RenameFolderSectionProps = defaultProps) => {
  return mount(RenameFolderSection, {
    props,
    global: {
      plugins: [pinia],
      provide: {
        toast: mockToastPlugin
      }
    }
  })
}

vi.mock('vue-inject', () => ({
  provide: vi.fn()
}))

vi.mock('@/services/Folder', () => ({
  RenameFolder: vi.fn()
}))

describe('renameFolderSection', () => {
  beforeEach(() => {
    setActivePinia(pinia)
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('props', () => {
    describe('binding with create folder modal', () => {
      const validTranslationCases = [
        {
          prop: 'modalTitle',
          expectedText: 'Renommer'
        },
        {
          prop: 'inputLabel',
          expectedText: 'Renommer votre dossier'
        },
        {
          prop: 'inputPlaceHolder',
          expectedText: 'Entrez le nom de votre dossier'
        },
        {
          prop: 'cancelBtnLabel',
          expectedText: 'Annuler'
        },
        {
          prop: 'confirmBtnabel',
          expectedText: 'Modifier'
        }
      ]
      it.each(validTranslationCases)(
        'elements content validation with "%s"',
        async ({ prop, expectedText }) => {
          const updatedProps: RenameFolderSectionProps = {
            ...defaultProps,
            isRenameFolderModalVisible: true
          }
          const wrapper = createWrapper(updatedProps)

          const renameFolderModalWrapper = wrapper.findComponent(RenameFolderModal)

          expect(renameFolderModalWrapper.props(prop).trim()).toBe(
            expectedText.trim()
          )
        }
      )
    })
  })

  describe('interactions', () => {
    it(
      'should call RenameFolder method of the folder service when confirm button click',
      async () => {
        const updatedProps: RenameFolderSectionProps = {
          ...defaultProps,
          isRenameFolderModalVisible: true
        }

        const wrapper = createWrapper(updatedProps)

        const modal = wrapper.findComponent(RenameFolderModal)

        await modal.vm.$emit('on-confirm-rename-folder', 'theNewFolderName')
        await nextTick()

        expect(vi.mocked(RenameFolder)).toHaveBeenCalledWith(
          defaultProps.folderId,
          'theNewFolderName',
          defaultProps.entityId,
          defaultProps.serviceId
        )
      }
    )

    it('should close modal when api call is completed', async () => {
      const updatedProps: RenameFolderSectionProps = {
        ...defaultProps,
        isRenameFolderModalVisible: true
      }

      const wrapper = createWrapper(updatedProps)

      const modal = wrapper.findComponent(RenameFolderModal)

      await modal.vm.$emit('on-confirm-rename-folder', 'theNewFolderName')
      await nextTick()

      expect(modal.props('isRenameFolderModalVisible')).toBeFalsy()

    })

    it('should emit update-folder-name on success rename folder', async () => {
      const updatedProps: RenameFolderSectionProps = {
        ...defaultProps,
        isRenameFolderModalVisible: true
      }

      const wrapper = createWrapper(updatedProps)

      const modal = wrapper.findComponent(RenameFolderModal)

      await modal.vm.$emit('on-confirm-rename-folder', 'theNewFolderName')
      await nextTick()

      expect(wrapper.emitted('update-folder-name')).toBeTruthy()

    })

    it('should display success notification correctly on success rename', async () => {
      const updatedProps: RenameFolderSectionProps = {
        ...defaultProps,
        isRenameFolderModalVisible: true
      }

      const wrapper = createWrapper(updatedProps)

      const modal = wrapper.findComponent(RenameFolderModal)

      await modal.vm.$emit('on-confirm-rename-folder', 'theNewFolderName')
      await nextTick()

      expect(mockToastPlugin).toHaveBeenCalledTimes(1)
      const callArguments = mockToastPlugin.mock.calls[0][0]
      expect(callArguments.message).toBe(
        'Le dossier a été renommé avec succès.'
      )
      expect(callArguments.customClass).toBe('success')
    })

    describe('cancel and close action', () => {
      const cases = [
        {
          action: 'on-cancel-rename-folder',
          expectedEvent: 'on-close-rename-folder'
        },
        {
          action: 'on-close-rename-folder',
          expectedEvent: 'on-close-rename-folder'
        }
      ]

      it.each(cases)(
        'close event validation with "%s"',
        async ({ action, expectedEvent }) => {
          const updatedProps: RenameFolderSectionProps = {
            ...defaultProps,
            isRenameFolderModalVisible: true
          }
          const wrapper = createWrapper(updatedProps)

          const renameFolderModalWrapper =
                  wrapper.findComponent(RenameFolderModal)
          await renameFolderModalWrapper.vm.$emit(action)
          await nextTick()

          expect(wrapper.emitted(expectedEvent)).toBeTruthy()
        }
      )
    })
  })
})

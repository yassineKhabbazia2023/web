import CreateFolderSection from '@/modules/Treeview/sections/CreateFolder'
import { VueWrapper, mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { type CreateFolderSectionProps }
  from '@/modules/Treeview/sections/CreateFolder/CreateFolderSectionTypes'
import {
  dynamicUntilFound, dynamicUntilFoundComponent
} from '@kpmg/common/src/testing-helpers'
import { Folder, FolderProperties } from '@/models/Folder'
import { createPinia, setActivePinia } from 'pinia'
import { CreateFolder } from '@/services/Folder'
import CreateFolderModal from '@/modules/Treeview/components/modals/Create'
import { ComponentPublicInstance, nextTick } from 'vue'

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

const defaultProps: CreateFolderSectionProps = {
  serviceId: 'service-id',
  entityId: 'entity-id',
  selectedFolder: {
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
    permissions: ['CAN_CREATE_FOLDER'],
    properties: {} as FolderProperties,
    serviceId: 'some-service'
  } as Folder,
  isCreateFolderModalVisible: false
}

type CreateFolderSectionSetup = {
  isDialogVisible: boolean
}

export type CreateFolderSectionWrapper = VueWrapper<
  ComponentPublicInstance<CreateFolderSectionSetup, CreateFolderSectionProps>
>

const mockToastPlugin = vi.fn()

const createWrapper = (
  props: CreateFolderSectionProps = defaultProps
): CreateFolderSectionWrapper => {
  return mount(CreateFolderSection, {
    props,
    global: {
      plugins: [pinia],
      provide: {
        toast: mockToastPlugin
      }
    }
  }) as unknown as CreateFolderSectionWrapper
}

vi.mock('vue-inject', () => ({
  provide: vi.fn()
}))

vi.mock('@/services/Folder', () => ({
  CreateFolder: vi.fn()
}))

describe('createFolderSection', () => {
  // eslint-disable-next-line vitest/no-hooks
  beforeEach(() => {
    setActivePinia(pinia)
  })
  // eslint-disable-next-line vitest/no-hooks
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('props', () => {
    it('should disable main create folder button when permission is not available', async () => {
      const updatedSelectedFolder = {
        ...defaultProps.selectedFolder,
        permissions: []
      }
      const updatedProps: CreateFolderSectionProps = {
        ...defaultProps,
        selectedFolder: updatedSelectedFolder
      }

      const wrapper = createWrapper(updatedProps)

      const mainCreateButton = await dynamicUntilFound(
        wrapper,
        '.treeview__new-folder'
      )

      expect(mainCreateButton.attributes('ariadisabled')).toBe('true')
    })

    it('should enable main create folder button when permission  available', async () => {

      const wrapper = createWrapper()

      const mainCreateButton = await dynamicUntilFound(
        wrapper,
        '.treeview__new-folder'
      )

      expect(mainCreateButton.attributes('ariadisabled')).toBe('false')
    })

    describe('binding with create folder modal', async () => {
      const validTranslationCases = [
        {
          prop: 'modalTitle',
          expectedText: 'Nouveau dossier'
        },
        {
          prop: 'inputLabel',
          expectedText: 'Nom du dossier'
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
          expectedText: 'Créer'
        }
      ]
      it.each(validTranslationCases)(
        'elements content validation with "%s"',
        async ({ prop, expectedText }) => {
          const updatedProps: CreateFolderSectionProps = {
            ...defaultProps,
            isCreateFolderModalVisible: true
          }
          const wrapper = createWrapper(updatedProps)

          const createFolderModalWrapper = await dynamicUntilFoundComponent(
            wrapper,
            CreateFolderModal
          )

          expect(createFolderModalWrapper.props(prop).trim()).toBe(expectedText.trim())
        }
      )
    })

    it('should set the correct create folder text', async () => {
      const wrapper = createWrapper()
      const mainCreateButton = await dynamicUntilFound(
        wrapper,
        '.treeview__new-folder'
      )

      expect(mainCreateButton.element.textContent).toContain('Nouveau dossier')
    })
  })

  describe('interactions', () => {
    it('should call CreateFolder method of the folder service when confirm button click',
      async () => {
        const updatedProps: CreateFolderSectionProps = {
          ...defaultProps,
          isCreateFolderModalVisible: true
        }

        const wrapper = createWrapper(updatedProps)

        const modal = await dynamicUntilFoundComponent(wrapper, CreateFolderModal)

        await modal.vm.$emit('on-confirm-create-folder', 'theNewFolder')
        await nextTick()

        expect(vi.mocked(CreateFolder)).toHaveBeenCalledWith(
          'service-id',
          'entity-id',
          1,
          'theNewFolder'
        )
      })
    it('should close modal when api call is completed', async () => {
      const updatedProps: CreateFolderSectionProps = {
        ...defaultProps,
        isCreateFolderModalVisible: true
      }

      const wrapper = createWrapper(updatedProps)

      const modal = await dynamicUntilFoundComponent(
        wrapper,
        CreateFolderModal
      )

      await modal.vm.$emit('on-confirm-create-folder', 'theNewFolder')
      await nextTick()

      expect(modal.props('isCreateFolderModalVisible')).toBeFalsy()
    })
    it('should emit update-source-folders on success create folder', async () => {
      const updatedProps: CreateFolderSectionProps = {
        ...defaultProps,
        isCreateFolderModalVisible: true
      }

      const wrapper = createWrapper(updatedProps)

      const modal = await dynamicUntilFoundComponent(wrapper, CreateFolderModal)

      await modal.vm.$emit('on-confirm-create-folder', 'theNewFolder')
      await nextTick()

      expect(wrapper.emitted('update-source-folders')).toBeTruthy()
    })
    it('should display success notification correctly on success create', async () => {
      const updatedProps: CreateFolderSectionProps = {
        ...defaultProps,
        isCreateFolderModalVisible: true
      }

      const wrapper = createWrapper(updatedProps)

      const modal = await dynamicUntilFoundComponent(wrapper, CreateFolderModal)

      await modal.vm.$emit('on-confirm-create-folder', 'theNewFolder')
      await nextTick()

      expect(mockToastPlugin).toHaveBeenCalledTimes(1)
      const callArguments = mockToastPlugin.mock.calls[0][0]
      expect(callArguments.message).toBe(
        'Le dossier a été créé avec succès.'
      )
      expect(callArguments.customClass).toBe('success')
    })

    it('should should open create folder modal when new button is clicked', async () => {
      const updatedProps: CreateFolderSectionProps = {
        ...defaultProps
      }

      const wrapper = createWrapper(updatedProps)

      const button = await dynamicUntilFound(wrapper, '.treeview__new-folder')

      await button.trigger('click')
      await nextTick()

      expect(wrapper.vm.isDialogVisible).toBeTruthy()
    })
    describe('cancel and close action', () => {
      const cases = [
        {
          action: 'on-cancel-create-folder',
          expectedEvent: 'on-close-create-folder'
        },
        {
          action: 'on-close-create-folder',
          expectedEvent: 'on-close-create-folder'
        }
      ]

      it.each(cases)(
        'close event validation with "%s"',
        async ({ action, expectedEvent }) => {
          const updatedProps: CreateFolderSectionProps = {
            ...defaultProps
          }
          const wrapper = createWrapper(updatedProps)

          const modal = await dynamicUntilFoundComponent(
            wrapper,
            CreateFolderModal
          )

          await modal.vm.$emit(action)
          await nextTick()

          expect(wrapper.emitted(expectedEvent)).toBeTruthy()
        }
      )
    })
  })
})


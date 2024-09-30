import CreateFolderSection from '@ged/modules/Treeview/sections/CreateFolder'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { type CreateFolderSectionProps }
  from '@ged/modules/Treeview/sections/CreateFolder/CreateFolderSectionTypes'
import type { Folder, FolderProperties } from '@ged/models/Folder'
import { createPinia, setActivePinia } from 'pinia'
import { CreateFolder } from '@ged/services/Folder'
import CreateFolderModal from '@ged/modules/Treeview/components/modals/Create'
import type { ComponentPublicInstance } from 'vue'
import { nextTick } from 'vue'

const pinia = createPinia()

const defaultProps: CreateFolderSectionProps = {
  serviceId: 'service-id',
  entityId: 'entity-id',
  hasCreateFolderButton: true,
  isCreateFolderModalCentered: false,
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
        serviceId: 'some-service',
        iconName: '',
      } as Folder,
    ],
    name: 'A',
    parent: { id: 0 },
    permissions: ['CAN_CREATE_FOLDER'],
    properties: {} as FolderProperties,
    serviceId: 'some-service',
  } as Folder,
  isCreateFolderModalVisible: false,
  isInBinContext: false,
}

type CreateFolderSectionSetup = {
  isDialogVisible: boolean
}

export type CreateFolderSectionWrapper = VueWrapper<
  ComponentPublicInstance<CreateFolderSectionSetup, CreateFolderSectionProps>
>

const mockToastPlugin = vi.fn()

const createWrapper = (
  props: CreateFolderSectionProps = defaultProps,
): CreateFolderSectionWrapper => {
  return mount(CreateFolderSection, {
    props,
    global: {
      plugins: [pinia],
      provide: {
        toast: mockToastPlugin,
      },
    },
  }) as unknown as CreateFolderSectionWrapper
}

vi.mock('@ged/services/Folder', () => ({
  CreateFolder: vi.fn(),
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
        permissions: [],
      }
      const updatedProps: CreateFolderSectionProps = {
        ...defaultProps,
        selectedFolder: updatedSelectedFolder,
      }

      const wrapper = createWrapper(updatedProps)

      const mainCreateButton = await wrapper.find('[data-testid=treeview__new-folder]')

      expect(mainCreateButton.attributes('ariadisabled')).toBe('true')
    })

    it('should disable main create folder button when opening bin tree', async () => {
      const updatedProps: CreateFolderSectionProps = {
        ...defaultProps,
        isInBinContext: true,
      }

      const wrapper = createWrapper(updatedProps)

      const mainCreateButton = await wrapper.find('[data-testid=treeview__new-folder]')

      expect(mainCreateButton.attributes('ariadisabled')).toBe('true')
    })

    it('should enable main create folder button when permission  available', async () => {
      const wrapper = createWrapper()

      const mainCreateButton = await wrapper.find('[data-testid=treeview__new-folder]')

      expect(mainCreateButton.attributes('ariadisabled')).toBe('false')
    })

    describe('binding with create folder modal', () => {
      const validTranslationCases = [
        {
          prop: 'modalTitle',
          expectedText: 'Nouveau dossier',
        },
        {
          prop: 'inputLabel',
          expectedText: 'Nom du dossier',
        },
        {
          prop: 'inputPlaceHolder',
          expectedText: 'Entrez le nom de votre dossier',
        },
        {
          prop: 'cancelBtnLabel',
          expectedText: 'Annuler',
        },
        {
          prop: 'confirmBtnabel',
          expectedText: 'Créer',
        },
      ]
      it.each(validTranslationCases)(
        'elements content validation with "%s"',
        ({ prop, expectedText }) => {
          const updatedProps: CreateFolderSectionProps = {
            ...defaultProps,
            isCreateFolderModalVisible: true,
          }
          const wrapper = createWrapper(updatedProps)

          const createFolderModalWrapper = wrapper.findComponent(
            CreateFolderModal,
          )
          // @ts-expect-error // TO CHECK: monorepo build issue, quick fix
          expect(createFolderModalWrapper.props(prop).trim()).toBe(expectedText.trim())
        },
      )
    })

    it('should set the correct create folder text', () => {
      const wrapper = createWrapper()
      const mainCreateButton = wrapper.find(
        '[data-testid=treeview__new-folder]',
      )

      expect(mainCreateButton.element.textContent).toContain('Nouveau dossier')
    })
  })

  describe('interactions', () => {
    it('should call CreateFolder method of the folder service when confirm button click',
      async () => {
        const updatedProps: CreateFolderSectionProps = {
          ...defaultProps,
          isCreateFolderModalVisible: true,
        }

        const wrapper = createWrapper(updatedProps)

        const modal = wrapper.findComponent(CreateFolderModal)

        modal.vm.$emit('on-confirm-create-folder', 'theNewFolder')
        await nextTick()

        expect(vi.mocked(CreateFolder)).toHaveBeenLastCalledWith(
          'service-id',
          'entity-id',
          1,
          'theNewFolder',
        )
      })
    it('should close modal when api call is completed', async () => {
      const updatedProps: CreateFolderSectionProps = {
        ...defaultProps,
        isCreateFolderModalVisible: true,
      }

      const wrapper = createWrapper(updatedProps)

      const modal = wrapper.findComponent(
        CreateFolderModal,
      )

      modal.vm.$emit('on-confirm-create-folder', 'theNewFolder')
      await nextTick()

      expect(modal.props('isCreateFolderModalVisible')).toBeFalsy()
    })
    it('should emit update-source-folders on success create folder', async () => {
      const updatedProps: CreateFolderSectionProps = {
        ...defaultProps,
        isCreateFolderModalVisible: true,
      }

      const wrapper = createWrapper(updatedProps)

      const modal = wrapper.findComponent(CreateFolderModal)

      modal.vm.$emit('on-confirm-create-folder', 'theNewFolder')
      await nextTick()

      expect(wrapper.emitted('update-source-folders')).toBeTruthy()
    })
    it('should display success notification correctly on success create', async () => {
      const updatedProps: CreateFolderSectionProps = {
        ...defaultProps,
        isCreateFolderModalVisible: true,
      }

      const wrapper = createWrapper(updatedProps)

      const modal = wrapper.findComponent(CreateFolderModal)

      modal.vm.$emit('on-confirm-create-folder', 'theNewFolder')
      await nextTick()

      expect(mockToastPlugin).toHaveBeenCalledTimes(1)
      const callArguments = mockToastPlugin.mock.calls[0][0]
      expect(callArguments.message).toBe(
        'Le dossier a été créé avec succès.',
      )
      expect(callArguments.customClass).toBe('success')
    })

    it('should should open create folder modal when new button is clicked', async () => {
      const updatedProps: CreateFolderSectionProps = {
        ...defaultProps,
      }

      const wrapper = createWrapper(updatedProps)

      const button = await wrapper.find('[data-testid=treeview__new-folder]')

      await button.trigger('click')
      await nextTick()

      expect(wrapper.vm.isDialogVisible).toBeTruthy()
    })
    describe('cancel and close action', () => {
      const cases = [
        {
          action: 'on-cancel-create-folder',
          expectedEvent: 'on-close-create-folder',
        },
        {
          action: 'on-close-create-folder',
          expectedEvent: 'on-close-create-folder',
        },
      ]

      it.each(cases)(
        'close event validation with "%s"',
        async ({ action, expectedEvent }) => {
          const updatedProps: CreateFolderSectionProps = {
            ...defaultProps,
          }
          const wrapper = createWrapper(updatedProps)

          const modal = wrapper.findComponent(
            CreateFolderModal,
          )

          modal.vm.$emit(action)
          await nextTick()

          expect(wrapper.emitted(expectedEvent)).toBeTruthy()
        },
      )
    })
  })
})


import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import { type CreateFolderSectionProps }
  from '@ged/modules/Treeview/sections/CreateFolder/CreateFolderSectionTypes'
import type { Folder, FolderProperties } from '@ged/models/Folder'
import { CreateFolder } from '@ged/services/Folder'
import type { ComponentPublicInstance } from 'vue'
import { nextTick } from 'vue'
import { PNotification as PNotificationMock } from '@pulse/styleguide'
import { armGedServiceDefaults } from '@ged/__mocks__/arm-ged-services.mocks'
import CreateFolderSection from '@ged/modules/Treeview/sections/CreateFolder'

const defaultProps: CreateFolderSectionProps = {
  serviceId: 'service-id',
  entityId: 'entity-id',
  accountId: 1234,
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


const createWrapper = (
  props: CreateFolderSectionProps = defaultProps,
): CreateFolderSectionWrapper => {
  return mount(CreateFolderSection, {
    props,
  }) as unknown as CreateFolderSectionWrapper
}

beforeEach(() => {
  armGedServiceDefaults()
})

describe('createFolderSection', () => {
  describe('props', () => {
    it('should disable main create folder button when permission is not available', () => {
      const updatedSelectedFolder = {
        ...defaultProps.selectedFolder,
        permissions: [],
      }
      const updatedProps: CreateFolderSectionProps = {
        ...defaultProps,
        selectedFolder: updatedSelectedFolder,
      }

      const wrapper = createWrapper(updatedProps)

      const mainCreateButton = wrapper.find('[data-testid=treeview__new-folder]')

      expect(mainCreateButton.attributes('aria-disabled')).toBe('true')
    })

    it('should disable main create folder button when opening bin tree', () => {
      const updatedProps: CreateFolderSectionProps = {
        ...defaultProps,
        isInBinContext: true,
      }

      const wrapper = createWrapper(updatedProps)

      const mainCreateButton = wrapper.find('[data-testid=treeview__new-folder]')

      expect(mainCreateButton.attributes('aria-disabled')).toBe('true')
    })

    it('should enable main create folder button when permission  available', () => {
      const wrapper = createWrapper()

      const mainCreateButton = wrapper.find('[data-testid=treeview__new-folder]')

      expect(mainCreateButton.attributes('aria-disabled')).toBe('false')
    })

    describe('binding with create folder modal', () => {
      it('should contain proper props', () => {
        const expectedProps = {
          cancelBtnLabel: 'Annuler',
          confirmBtnabel: 'Créer',
          inputLabel: 'Nom du dossier',
          inputPlaceHolder: 'Entrez le nom de votre dossier',
          isCentered: false,
          isConfirmButtonLoading: false,
          isCreateFolderModalVisible: false,
          modalTitle: 'Nouveau dossier',
          selectedFolder: {
            children: [
              {
                children: [
                  {},
                ],
                iconName: '',
                id: 2,
                name: 'TheFolder',
                parent: {
                  id: 1,
                },
                permissions: [],
                properties: {},
                serviceId: 'some-service',
              },
            ],
            id: 1,
            name: 'A',
            parent: {
              id: 0,
            },
            permissions: [
              'CAN_CREATE_FOLDER',
            ],
            properties: {},
            serviceId: 'some-service',
          },
        }
        const updatedProps: CreateFolderSectionProps = {
          ...defaultProps,
          isCreateFolderModalVisible: true,
        }
        const wrapper = createWrapper(updatedProps)

        const createFolderModalWrapper = wrapper.findComponent({ name: 'CreateFolderModal' })

        expect(createFolderModalWrapper.props()).toStrictEqual(expectedProps)
      })
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

        const modal = wrapper.findComponent({ name: 'CreateFolderModal' })

        modal.vm.$emit('on-confirm-create-folder', 'theNewFolder')
        await nextTick()

        expect(vi.mocked(CreateFolder)).toHaveBeenLastCalledWith(
          'service-id',
          'entity-id',
          1,
          'theNewFolder',
          1234,
        )
      })
    it('should close modal when api call is completed', async () => {
      const updatedProps: CreateFolderSectionProps = {
        ...defaultProps,
        isCreateFolderModalVisible: true,
      }

      const wrapper = createWrapper(updatedProps)

      const modal = wrapper.findComponent({ name: 'CreateFolderModal' })

      modal.vm.$emit('on-confirm-create-folder', 'theNewFolder')
      await flushPromises()

      expect(wrapper.findComponent({ name: 'CreateFolderModal' }).props('isCreateFolderModalVisible')).toBeFalsy()
    })
    it('should emit update-source-folders on success create folder', async () => {
      const updatedProps: CreateFolderSectionProps = {
        ...defaultProps,
        isCreateFolderModalVisible: true,
      }

      const wrapper = createWrapper(updatedProps)

      const modal = wrapper.findComponent({ name: 'CreateFolderModal' })

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

      const modal = wrapper.findComponent({ name: 'CreateFolderModal' })

      modal.vm.$emit('on-confirm-create-folder', 'theNewFolder')
      await nextTick()

      expect(PNotificationMock).toHaveBeenCalledTimes(1)
      const callArguments = (vi.mocked(PNotificationMock)).mock.calls[0][0]
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

      const button = wrapper.find('[data-testid=treeview__new-folder]')

      await button.trigger('click')
      await nextTick()

      expect(wrapper.vm.isDialogVisible).toBeTruthy()
      expect(wrapper.findComponent({ name: 'CreateFolderModal' }).exists()).toBeTruthy()
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
        'close event validation with $action',
        async ({ action, expectedEvent }) => {
          const updatedProps: CreateFolderSectionProps = {
            ...defaultProps,
            isCreateFolderModalVisible: true,
          }
          const wrapper = createWrapper(updatedProps)

          const modal = wrapper.findComponent({ name: 'CreateFolderModal' })

          modal.vm.$emit(action)
          await nextTick()

          expect(wrapper.emitted(expectedEvent)).toBeTruthy()
          expect(wrapper.findComponent({ name: 'CreateFolderModal' }).props('isCreateFolderModalVisible')).toBeFalsy()
        },
      )
    })
  })
})

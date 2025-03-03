import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, vi, afterEach, type Mock } from 'vitest'
import { folderServiceMock } from '@ged/__mocks__/folder.service.mocks'
import { type RenameFolderSectionProps }
  from '@ged/modules/Treeview/sections/RenameFolder/RenameFolderSectionTypes'
import type { Folder, FolderProperties } from '@ged/models/Folder'
import { createPinia, setActivePinia } from 'pinia'
import { RenameFolder } from '@ged/services/Folder'
import { nextTick } from 'vue'
import { PNotification as PNotificationMock } from '@pulse/styleguide'

import RenameFolderSection from '@ged/modules/Treeview/sections/RenameFolder'

vi.mock('@pulse/styleguide')

const pinia = createPinia()

const defaultProps: RenameFolderSectionProps = {
  serviceId: 'service-id',
  entityId: 'entity-id',
  accountId: 1234,
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
        serviceId: 'some-service',
      } as Folder,
    ],
    name: 'A',
    parent: { id: 0 },
    permissions: ['CAN_CREATE_FOLDER', 'CAN_RENAME_FOLDER'],
    properties: {} as FolderProperties,
    serviceId: 'some-service',
  } as Folder,
  isRenameFolderModalVisible: false,
  folderName: 'newFolderName',
  folderId: 2,
}

const createWrapper = (props: RenameFolderSectionProps = defaultProps) => {
  return mount(RenameFolderSection, {
    props,
    global: {
      plugins: [pinia],
    },
  })
}

vi.mock('@ged/services/Folder', () => folderServiceMock)

describe('renameFolderSection', () => {
  beforeEach(() => {
    setActivePinia(pinia)
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('props', () => {
    describe('binding with create folder modal', () => {
      it('should contain propser props',
        () => {
          const expectedProps = {
            cancelBtnLabel: 'Annuler',
            confirmBtnabel: 'Modifier',
            inputContentDefault: 'newFolderName',
            inputLabel: 'Renommer votre dossier',
            inputPlaceHolder: 'Entrez le nom de votre dossier',
            isConfirmButtonLoading: false,
            isRenameFolderModalVisible: false,
            modalTitle: 'Renommer',
            parentFolder: {
              children: [{
                children: [{}],
                id: 2,
                name: 'TheFolder',
                parent: {
                  id: 1,
                },
                permissions: [],
                properties: {},
                serviceId: 'some-service',
              }],
              id: 1,
              name: 'A',
              parent: {
                id: 0,
              },
              permissions: [
                'CAN_CREATE_FOLDER',
                'CAN_RENAME_FOLDER',
              ],
              properties: {},
              serviceId: 'some-service',
            },
          }
          const updatedProps: RenameFolderSectionProps = {
            ...defaultProps,
            isRenameFolderModalVisible: true,
          }
          const wrapper = createWrapper(updatedProps)

          const renameFolderModalWrapper = wrapper.findComponent({ name: 'RenameFolderModal' })

          expect(renameFolderModalWrapper.props()).toStrictEqual(expectedProps)
        },
      )
    })
  })

  describe('interactions', () => {
    it(
      'should call RenameFolder method of the folder service when confirm button click',
      async () => {
        const updatedProps: RenameFolderSectionProps = {
          ...defaultProps,
          isRenameFolderModalVisible: true,
        }

        const wrapper = createWrapper(updatedProps)

        const modal = wrapper.findComponent({ name: 'RenameFolderModal' })

        await modal.vm.$emit('on-confirm-rename-folder', 'theNewFolderName')
        await nextTick()

        expect(vi.mocked(RenameFolder)).toHaveBeenCalledWith(
          defaultProps.folderId,
          'theNewFolderName',
          defaultProps.entityId,
          defaultProps.accountId,
          defaultProps.serviceId,
        )
      },
    )

    it('should close modal when api call is completed', async () => {
      const updatedProps: RenameFolderSectionProps = {
        ...defaultProps,
        isRenameFolderModalVisible: true,
      }

      const wrapper = createWrapper(updatedProps)

      const modal = wrapper.findComponent({ name: 'RenameFolderModal' })

      await modal.vm.$emit('on-confirm-rename-folder', 'theNewFolderName')
      await nextTick()

      expect(modal.props('isRenameFolderModalVisible')).toBeFalsy()
    })

    it('should emit update-folder-name on success rename folder', async () => {
      const updatedProps: RenameFolderSectionProps = {
        ...defaultProps,
        isRenameFolderModalVisible: true,
      }

      const wrapper = createWrapper(updatedProps)

      const modal = wrapper.findComponent({ name: 'RenameFolderModal' })

      await modal.vm.$emit('on-confirm-rename-folder', 'theNewFolderName')
      await nextTick()

      expect(wrapper.emitted('update-folder-name')).toBeTruthy()
    })

    it('should display success notification correctly on success rename', async () => {
      const updatedProps: RenameFolderSectionProps = {
        ...defaultProps,
        isRenameFolderModalVisible: true,
      }

      const wrapper = createWrapper(updatedProps)

      const modal = wrapper.findComponent({ name: 'RenameFolderModal' })

      await modal.vm.$emit('on-confirm-rename-folder', 'theNewFolderName')
      await nextTick()

      expect(PNotificationMock).toHaveBeenCalledTimes(1)
      const callArguments = (PNotificationMock as Mock).mock.calls[0][0]
      expect(callArguments.message).toBe(
        'Le dossier a été renommé avec succès.',
      )
      expect(callArguments.customClass).toBe('success')
    })

    describe('cancel and close action', () => {
      const cases = [
        {
          action: 'on-cancel-rename-folder',
          expectedEvent: 'on-close-rename-folder',
        },
        {
          action: 'on-close-rename-folder',
          expectedEvent: 'on-close-rename-folder',
        },
      ]

      it.each(cases)(
        'close event validation with "%s"',
        async ({ action, expectedEvent }) => {
          const updatedProps: RenameFolderSectionProps = {
            ...defaultProps,
            isRenameFolderModalVisible: true,
          }
          const wrapper = createWrapper(updatedProps)

          const renameFolderModalWrapper = wrapper.findComponent({ name: 'RenameFolderModal' })
          await renameFolderModalWrapper.vm.$emit(action)
          await nextTick()

          expect(wrapper.emitted(expectedEvent)).toBeTruthy()
        },
      )
    })
  })
})

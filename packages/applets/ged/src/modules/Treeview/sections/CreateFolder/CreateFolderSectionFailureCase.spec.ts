
import { describe, it, expect, beforeEach, vi, afterEach, type Mock } from 'vitest'
import { mount } from '@vue/test-utils'
import { loggerMock } from '@pulse/core/mocks'
import { getMockedFolder } from '@ged/__mocks__/treeview.mocks'
import { createFolderFailMock, tokenValueMock } from '@ged/__mocks__/folder.service.mocks'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import { PNotification as PNotificationMock } from '@pulse/styleguide'
import type { Folder } from '@ged/models/Folder'
import { type CreateFolderSectionProps } from './CreateFolderSectionTypes'

import CreateFolderSection from './CreateFolderSection.vue'

vi.mock('@pulse/styleguide')
vi.mock('@pulse/core', () => ({ logger: loggerMock }))

const pinia = createPinia()

const child = getMockedFolder(1, 2, 'TheFolder', {
  children: [{} as Folder],
  serviceId: 'some-service',
})
const selectedFolder = getMockedFolder(0, 1, 'A', {
  children: [child],
  permissions: ['CAN_CREATE_FOLDER'],
  serviceId: 'some-service',
})

const defaultProps: CreateFolderSectionProps = {
  serviceId: 'service-id',
  entityId: 'entity-id',
  accountId: 1234,
  isCreateFolderModalCentered: false,
  hasCreateFolderButton: true,
  selectedFolder,
  isCreateFolderModalVisible: false,
}

const createWrapper = (props: CreateFolderSectionProps = defaultProps) => {
  return mount(CreateFolderSection, {
    props,
    global: {
      plugins: [pinia],
    },
  })
}

vi.mock('@ged/services/Folder', () => ({
  tokenValue: tokenValueMock,
  CreateFolder: createFolderFailMock,
}))

describe('createFolderSection', () => {
  beforeEach(() => {
    setActivePinia(pinia)
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('interactions', () => {
    it('should display success notification correctly on success create', async () => {
      const updatedProps: CreateFolderSectionProps = {
        ...defaultProps,
        isCreateFolderModalVisible: true,
      }

      const wrapper = createWrapper(updatedProps)

      const modal = wrapper.findComponent({ name: 'CreateFolderModal' })

      await modal.vm.$emit('on-confirm-create-folder', 'theNewFolder')
      await nextTick()

      expect(PNotificationMock).toHaveBeenCalledTimes(1)
      const callArguments = (PNotificationMock as Mock).mock.calls[0][0]
      expect(callArguments.message).toBe('Connexion au serveur interrompue.')
      expect(callArguments.customClass).toBe('error')
    })
  })
})

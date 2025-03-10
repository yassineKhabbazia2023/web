
import type { VueWrapper } from '@vue/test-utils'
import { shallowMount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import { defaultEntityMock } from '@ged/__mocks__/common.import.mocks'
import { fetchServicesFoldersFailMock, fetchServicesFoldersSuccessMock } from './__mocks__/folder.service.mocks'
import { accountingHubConnectionServiceMock } from '@ged/__mocks__/accounting-hub-connection.service.mocks'
import { servicesDataMock } from '@ged/__mocks__/services.mocks'
import { foldersData } from '@ged/__mocks__/tree-folders.mocks'
import { documentsServiceMock } from './__mocks__/documents.service.mocks'
import { fetchUserEntityServices } from '@ged/services/Services'
import { fetchServicesFolders } from '@ged/services/Folder'
import type { ComponentPublicInstance } from 'vue'
import { nextTick } from 'vue'
import type { Folder, FolderProperties } from './models/Folder'
import type { Service } from './models/Service'
import {
  appendChildFolder,
  sortFolderByName,
  deleteFolder,
  renameFolder,
  findFolderDeepById,
} from '@ged/modules/Treeview/helpers/folderArrayHelper'
import { createMemoryHistory, createRouter } from 'vue-router'

import Ged from './'


vi.mock('@ged/models/AccountingHubConnection', () => accountingHubConnectionServiceMock)

const spyPNotification = vi.hoisted(() => vi.fn())
vi.mock('@pulse/styleguide', () => ({
  PNotification: spyPNotification,
  AppColors: {
    RED: 'RED',
    PRIMARY: 'PRIMARY',
    GREY_300: 'GREY_300',
  },
}))

vi.mock('@ged/services/Folder', () => ({
  fetchServicesFolders: fetchServicesFoldersSuccessMock,
}))

vi.mock('@ged/services/Services', () => ({
  fetchUserEntityServices: vi.fn(() => {
    return servicesDataMock
  }),
}))

vi.mock('@ged/services/Documents', () => documentsServiceMock)

vi.mock('@ged/services/BinDocuments', () => ({
  fetchBinDocuments: vi.fn(),
}))

vi.mock('@ged/modules/Treeview/helpers/folderArrayHelper', async (importActual) => {
  const actual = await importActual()
  return {
    // @ts-ignore
    ...actual,
    appendChildFolder: vi.fn(() => {
      return true
    }),
    sortFolderByName: vi.fn(),
    deleteFolder: vi.fn(),
    renameFolder: vi.fn(() => {
      return true
    }),
    findFolderDeepById: vi.fn(),
  }
})

type AppSetup = {
  selectedEntity: string
  currentBinService: Service['ServiceId']
  currentService: Service['ServiceId']
  isCreateFolderModalVisible: boolean
  currentBinServiceName: string
}

export type AppWrapper = VueWrapper<ComponentPublicInstance<AppSetup>>


const router = createRouter(
  {
    history: createMemoryHistory(),
    routes:
    [
      { path: '/mon-chemin',
        name: 'TestRoute',
        component: Ged,
      },
      { path: '',
        name: 'home',
        component: Ged,
      },
    ],
  },
)
const createWrapper = (): AppWrapper => {
  return shallowMount(Ged, {
    global: {
      stubs: {
        BinDocuments: true,
        Treeview: true,
        Documents: true,
        PRow: { template: '<div><slot /></div>' },
        PCol: { template: '<div><slot /></div>' },
      },
      plugins: [router],
    },
  }) as AppWrapper
}

const folder = {
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
} as Folder

describe('ged', () => {
  it('renders correctly', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBeTruthy()
  })

  it('call fetch services folders on entity change', async () => {
    createWrapper()
    await flushPromises()
    expect(vi.mocked(fetchServicesFolders)).toHaveBeenCalledTimes(1)
  })
  describe('treeview', () => {
    describe('interactions', () => {
      it('should fetch user entity services when ged is rendered', async () => {
        createWrapper()

        await nextTick()

        expect(vi.mocked(fetchUserEntityServices)).toHaveBeenCalledTimes(1)
      })

      it('should fetch services folders when ged is rendered', async () => {
        createWrapper()

        await nextTick()

        expect(vi.mocked(fetchServicesFolders)).toHaveBeenCalledTimes(1)
      })

      it('should set the current folder and current service on selected-folder-change event', async () => {
        const wrapper = createWrapper()
        await nextTick()
        await flushPromises()

        const tree = wrapper.findComponent({ name: 'Treeview' })
        await tree.vm.$emit('selected-folder-change', folder)
        await nextTick()

        expect(tree.props('selectedFolder')).toStrictEqual(folder)
        expect(tree.props('currentService')).toBe('some-service')
      })

      it('should set the current folder and current service on selected-folder-change event when currentBinService', async () => {
        const wrapper = createWrapper()
        const componentInstance = wrapper.vm
        componentInstance.currentBinService = foldersData[0][0].serviceId
        await nextTick()
        await flushPromises()

        const tree = wrapper.findComponent({ name: 'Treeview' })
        await nextTick()
        await tree.vm.$emit(
          'selected-folder-change',
          foldersData[0][0].children[0],
        )
        await nextTick()

        const bin = wrapper.findComponent({ name: 'BinDocuments' })
        await nextTick()
        expect(bin.exists()).toBeTruthy()
        expect(vi.mocked(fetchUserEntityServices)).toHaveBeenCalledTimes(2)
        expect(vi.mocked(fetchServicesFolders)).toHaveBeenCalledTimes(2)
        expect(tree.props('selectedFolder')).toStrictEqual(null)
        expect(tree.props('currentService')).toBe('service-id-compta')
      })

      it('should set the trash serviceId on selected-bin-service-change', async () => {
        const wrapper = createWrapper()
        await nextTick()
        await flushPromises()

        const tree = wrapper.findComponent({ name: 'Treeview' })
        await nextTick()

        await tree.vm.$emit(
          'selected-bin-service-change',
          servicesDataMock[0].ServiceId,
        )
        await nextTick()

        const componentInstance = wrapper.vm

        expect(componentInstance.currentBinService).toStrictEqual(
          servicesDataMock[0].ServiceId,
        )

        const bin = wrapper.findComponent({ name: 'BinDocuments' })
        await nextTick()
        expect(bin.exists()).toBeTruthy()
        expect(bin.props('currentBinService')).toBe(foldersData[0][0].serviceId)
        expect(bin.props('selectedServiceName')).toBe(
          servicesDataMock[0].ServiceName,
        )
      })

      it('should set isCreateFolderModalVisible when open-create-folder-modal', async () => {
        const wrapper = createWrapper()
        await nextTick()

        const tree = wrapper.findComponent({ name: 'Treeview' })
        await tree.vm.$emit('open-create-folder-modal')
        await nextTick()

        const componentInstance = wrapper.vm

        expect(componentInstance.isCreateFolderModalVisible).toBeTruthy()
      })

      it('should append folder in tree and sort when update-source-folders', async () => {
        const wrapper = createWrapper()
        await nextTick()

        const tree = wrapper.findComponent({ name: 'Treeview' })
        await nextTick()

        await tree.vm.$emit(
          'update-source-folders',
          foldersData[0][0].children[0],
        )
        await nextTick()

        expect(vi.mocked(appendChildFolder)).toHaveBeenCalledTimes(1)
        expect(vi.mocked(sortFolderByName)).toHaveBeenCalledTimes(1)
        expect(vi.mocked(findFolderDeepById)).toHaveBeenCalledTimes(1)
      })

      it('should remove folder from tree when remove-folder-from-source', async () => {
        const wrapper = createWrapper()
        await nextTick()

        const tree = wrapper.findComponent({ name: 'Treeview' })
        await nextTick()

        await tree.vm.$emit(
          'remove-folder-from-source',
          foldersData[0][0].children[0],
        )
        await nextTick()

        expect(vi.mocked(deleteFolder)).toHaveBeenCalledTimes(1)
        expect(vi.mocked(findFolderDeepById)).toHaveBeenCalledTimes(1)
      })

      it('should rename folder in tree and sort when update-folder-name', async () => {
        const wrapper = createWrapper()
        await nextTick()

        const tree = wrapper.findComponent({ name: 'Treeview' })
        await nextTick()

        await tree.vm.$emit('update-folder-name', foldersData[0][0].children[0])
        await nextTick()

        expect(vi.mocked(renameFolder)).toHaveBeenCalledTimes(1)
        expect(vi.mocked(sortFolderByName)).toHaveBeenCalledTimes(1)
        expect(vi.mocked(findFolderDeepById)).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('documents', () => {
    describe('rendering', () => {
      it("should display notification if service didn't load correctly", async () => {
        fetchServicesFoldersSuccessMock.mockReturnValue(fetchServicesFoldersFailMock())
        createWrapper()
        await flushPromises()
        expect(spyPNotification).toHaveBeenCalledOnce()
      })
    })
    describe('props', () => {
      it('should display documents component when currentService is set', async () => {
        const wrapper = createWrapper()
        await flushPromises()
        const documentComponent = wrapper.findComponent({ name: 'Documents' })
        await nextTick()
        expect(documentComponent.exists()).toBeTruthy()
      })
      it('should hide documents component when currentBinService is set', async () => {
        const wrapper = createWrapper()
        const componentInstance = wrapper.vm
        componentInstance.currentBinService = 'bin-service-id'
        await nextTick()
        const document = wrapper.findComponent({ name: 'Documents' })
        await nextTick()
        expect(document.exists()).toBeFalsy()
      })
    })
    describe('events', () => {
      it('should update selected folder in documents when change-selected-folder', async () => {
        const wrapper = createWrapper()
        await nextTick()
        await flushPromises()

        const documentComponent = wrapper.findComponent({ name: 'Documents' })
        await nextTick()
        await documentComponent.vm.$emit(
          'change-selected-folder',
          foldersData[0][0].children[0],
        )
        await nextTick()

        expect(documentComponent.props('selectedFolder')).toStrictEqual(
          foldersData[0][0].children[0],
        )
        expect(documentComponent.props('currentService')).toBe(
          'service-id-compta',
        )
      })
    })
  })

  describe('bin', () => {
    describe('props', () => {
      it('should display bin component when currentBinService is set', async () => {
        const wrapper = createWrapper()
        const componentInstance = wrapper.vm
        componentInstance.currentBinService = foldersData[0][0].serviceId
        componentInstance.currentBinServiceName = foldersData[0][0].name
        await nextTick()
        const bin = wrapper.findComponent({ name: 'BinDocuments' })
        await nextTick()
        expect(bin.exists()).toBeTruthy()
        expect(bin.props('currentBinService')).toBe(foldersData[0][0].serviceId)
        expect(bin.props('selectedServiceName')).toBe(foldersData[0][0].name)
        expect(bin.props('selectedEntity')).toBe(defaultEntityMock.accountNumber)
      })

      it('should set the prop that will disable the create folder button when currentBinService is set', async () => {
        const wrapper = createWrapper()
        const componentInstance = wrapper.vm
        componentInstance.currentBinService = foldersData[0][0].serviceId
        componentInstance.currentBinServiceName = foldersData[0][0].name
        await nextTick()
        const tree = wrapper.findComponent({ name: 'Treeview' })

        expect(tree.props('isInBinContext')).toBeTruthy()
      })

      it('should hide bin component when currentBinService is not set', async () => {
        const wrapper = createWrapper()
        await nextTick()
        const bin = wrapper.findComponent({ name: 'BinDocuments' })
        await nextTick()
        expect(bin.exists()).toBeFalsy()
      })
    })
    describe('events', () => {
      it('should update selected folder in documents when navigate-to-folder is emitted', async () => {
        const wrapper = createWrapper()
        await flushPromises()
        const componentInstance = wrapper.vm
        componentInstance.currentBinService = foldersData[0][0].serviceId
        await nextTick()
        const bin = wrapper.findComponent({ name: 'BinDocuments' })

        bin.vm.$emit('navigate-to-folder', foldersData[0][0].children[0])
        await nextTick()

        expect(vi.mocked(fetchUserEntityServices)).toHaveBeenCalledTimes(2)
        expect(vi.mocked(fetchServicesFolders)).toHaveBeenCalledTimes(2)

        const treeview = wrapper.findComponent({ name: 'Treeview' })

        expect(treeview.props('currentService')).toBe(
          foldersData[0][0].serviceId,
        )
        expect(treeview.props('selectedFolder')).toStrictEqual(null)
      })
    })
  })
})

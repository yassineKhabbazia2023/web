/* eslint-disable max-len */
import { VueWrapper, mount, flushPromises } from '@vue/test-utils'
import Ged from './'
import { createPinia, setActivePinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { fetchUserEntityServices } from '@/services/Services'
import { fetchServicesFolders } from '@/services/Folder'
import { ComponentPublicInstance, nextTick } from 'vue'
import { Folder, FolderProperties } from './models/Folder'
import { foldersData } from './modules/Treeview/mocks/treeFoldersMock'
import { servicesData } from './modules/Treeview/mocks/servicesDataMock'
import Treeview from './modules/Treeview'
import { Service } from './models/Service'
import {
  appendChildFolder,
  sortFolderByName,
  deleteFolder,
  renameFolder,
  findFolderDeepById
} from '@/modules/Treeview/helpers/folderArrayHelper'
import Documents from '@/modules/Documents'
import BinDocuments from '@/modules/Bin'

const pinia = createPinia()

vi.mock('@kpmg/common', async () => ({
  commonApi: () => ({
    ds: vi.fn()
  }),
  commonStore: () => ({
    $delete: vi.fn(),
    $patch: vi.fn(),
    $get: vi.fn(),
    $post: vi.fn(),
    defaultEntity: {
      name: 'JEAN LÉVAGE',
      idAccount: '93012cc8-77b9-4161-8dbd-61915d935e21'
    }
  }),
  DataStreamHubConnection: vi.fn(() => ({
    startConnection: vi.fn(() => {
      return Promise.resolve()
    }),
    getConnection: vi.fn(() => {
      return {
        invoke: vi.fn(),
        on: vi.fn(),
        stop: vi.fn()
      }
    }),
    destroyConnection: vi.fn()
  })),
  debounce: vi.fn((fn) => fn)
}))

vi.mock('@/models/AccountingHubConnection', () => ({
  initializedAccountingDataStreamInstance: Promise.resolve({
    OnConnectedAsync: vi.fn(),
    OnDisconnectedAsync: vi.fn(),
    getConnection: vi.fn(() => ({
      on: vi.fn()
    }))
  })
}))

vi.mock('@/services/Folder', () => ({
  fetchServicesFolders: vi.fn(() => {
    return foldersData
  })
}))

vi.mock('@/services/Services', () => ({
  fetchUserEntityServices: vi.fn(() => {
    return servicesData
  })
}))

vi.mock('@/services/Documents', () => ({
  fetchFolderDocuments: vi.fn()
}))

vi.mock('@/services/BinDocuments', () => ({
  fetchBinDocuments: vi.fn()
}))

vi.mock('@/modules/Treeview/helpers/folderArrayHelper', async () => {
  const actual = await vi.importActual('@/modules/Treeview/helpers/folderArrayHelper')
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
    findFolderDeepById: vi.fn()
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

const createWrapper = (): AppWrapper => {
  return mount(Ged, {
    global: {
      plugins: [pinia]
    }
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
        iconName: ''
      } as Folder
  ],
  name: 'A',
  parent: { id: 0 },
  permissions: ['CAN_CREATE_FOLDER'],
  properties: {} as FolderProperties,
  serviceId: 'some-service'
} as Folder

describe('ged', () => {
  // eslint-disable-next-line vitest/no-hooks
  beforeEach(() => {
    setActivePinia(pinia)
  })
  it('renders correctly', () => {
    expect.hasAssertions()
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBeTruthy()
  })
  describe('treeview', () => {
    describe('interactions', () => {
      it('should ftech user entity services when ged is rendered', async () => {
        expect.hasAssertions()
        createWrapper()

        await nextTick()

        expect(vi.mocked(fetchUserEntityServices)).toHaveBeenCalledTimes(1)
      })

      it('should ftech services folders when ged is rendered', async () => {
        expect.hasAssertions()
        createWrapper()

        await nextTick()

        expect(vi.mocked(fetchServicesFolders)).toHaveBeenCalledTimes(1)
      })

      it(
        'should set the current folder and current service on selected-folder-change event',
        async () => {
          expect.hasAssertions()
          const wrapper = createWrapper()
          await nextTick()
          await flushPromises()

          const tree = wrapper.findComponent(Treeview)
          await tree.vm.$emit('selected-folder-change', folder)
          await nextTick()

          expect(tree.props('selectedFolder')).toStrictEqual(folder)
          expect(tree.props('currentService')).toBe('some-service')
        }
      )

      it(
        'should set the current folder and current service on selected-folder-change event when currentBinService',
        async () => {
          expect.hasAssertions()
          const wrapper = createWrapper()
          const componentInstance = wrapper.vm
          componentInstance.currentBinService = foldersData[0][0].serviceId
          await nextTick()
          await flushPromises()

          const tree = wrapper.findComponent(Treeview)
          await nextTick()
          await tree.vm.$emit('selected-folder-change', foldersData[0][0].children[0])
          await nextTick()

          const bin = wrapper.findComponent(BinDocuments)
          await nextTick()
          expect(bin.exists()).toBeFalsy()
          expect(vi.mocked(fetchUserEntityServices)).toHaveBeenCalledTimes(2)
          expect(vi.mocked(fetchServicesFolders)).toHaveBeenCalledTimes(2)
          expect(tree.props('selectedFolder')).toStrictEqual(foldersData[0][0].children[0])
          expect(tree.props('currentService')).toBe('service-id-compta')
        }
      )

      it('should set the trash serviceId on selected-bin-service-change', async () => {
        expect.hasAssertions()
        const wrapper = createWrapper()
        await nextTick()
        await flushPromises()

        const tree = wrapper.findComponent(Treeview)
        await nextTick()

        await tree.vm.$emit('selected-bin-service-change', servicesData[0].ServiceId)
        await nextTick()

        const componentInstance = wrapper.vm

        expect(componentInstance.currentBinService).toStrictEqual(
          servicesData[0].ServiceId
        )

        const bin = wrapper.findComponent(BinDocuments)
        await nextTick()
        expect(bin.exists()).toBeTruthy()
        expect(bin.props('currentBinService')).toBe(foldersData[0][0].serviceId)
        expect(bin.props('selectedServiceName')).toBe(servicesData[0].ServiceName)
      })

      it('should set isCreateFolderModalVisible when open-create-folder-modal', async () => {
        expect.hasAssertions()
        const wrapper = createWrapper()
        await nextTick()

        const tree = wrapper.findComponent(Treeview)
        await tree.vm.$emit(
          'open-create-folder-modal'
        )
        await nextTick()

        const componentInstance = wrapper.vm

        expect(componentInstance.isCreateFolderModalVisible).toBeTruthy()
      })

      it('should append folder in tree and sort when update-source-folders', async () => {
        expect.hasAssertions()
        const wrapper = createWrapper()
        await nextTick()

        const tree = wrapper.findComponent(Treeview)
        await nextTick()

        await tree.vm.$emit('update-source-folders', foldersData[0][0].children[0])
        await nextTick()

        expect(vi.mocked(appendChildFolder)).toHaveBeenCalledTimes(1)
        expect(vi.mocked(sortFolderByName)).toHaveBeenCalledTimes(1)
        expect(vi.mocked(findFolderDeepById)).toHaveBeenCalledTimes(3)
      })

      it('should remove folder from tree when remove-folder-from-source', async () => {
        expect.hasAssertions()
        const wrapper = createWrapper()
        await nextTick()

        const tree = wrapper.findComponent(Treeview)
        await nextTick()

        await tree.vm.$emit(
          'remove-folder-from-source',
          foldersData[0][0].children[0]
        )
        await nextTick()

        expect(vi.mocked(deleteFolder)).toHaveBeenCalledTimes(1)
        expect(vi.mocked(findFolderDeepById)).toHaveBeenCalledTimes(3)

      })

      it('should rename folder in tree and sort when update-folder-name', async () => {
        expect.hasAssertions()
        const wrapper = createWrapper()
        await nextTick()

        const tree = wrapper.findComponent(Treeview)
        await nextTick()

        await tree.vm.$emit('update-folder-name', foldersData[0][0].children[0])
        await nextTick()

        expect(vi.mocked(renameFolder)).toHaveBeenCalledTimes(1)
        expect(vi.mocked(sortFolderByName)).toHaveBeenCalledTimes(1)
        expect(vi.mocked(findFolderDeepById)).toHaveBeenCalledTimes(3)

      })
    })
  })

  describe('documents', () => {
    describe('props', () => {
      it('should display documents component when currentService is set', async () => {
        expect.hasAssertions()
        const wrapper = createWrapper()
        await flushPromises()
        const documentComponent = wrapper.findComponent(Documents)
        await nextTick()
        expect(documentComponent.exists()).toBeTruthy()
      })
      it('should hide documents component when currentBinService is set', async () => {
        expect.hasAssertions()
        const wrapper = createWrapper()
        const componentInstance = wrapper.vm
        componentInstance.currentBinService = 'bin-service-id'
        await nextTick()
        const document = wrapper.findComponent(Documents)
        await nextTick()
        expect(document.exists()).toBeFalsy()
      })
    })
    describe('events', () => {
      it('should update selected folder in documents when change-selected-folder', async () => {
        expect.hasAssertions()
        const wrapper = createWrapper()
        await nextTick()
        await flushPromises()

        const documentComponent = wrapper.findComponent(Documents)
        await nextTick()
        await documentComponent.vm.$emit('change-selected-folder', foldersData[0][0].children[0])
        await nextTick()

        expect(documentComponent.props('selectedFolder')).toStrictEqual(foldersData[0][0].children[0])
        expect(documentComponent.props('currentService')).toBe('service-id-compta')
      })
    })
  })

  describe('bin', () => {
    describe('props', () => {
      it('should display bin component when currentBinService is set', async () => {
        expect.hasAssertions()
        const wrapper = createWrapper()
        const componentInstance = wrapper.vm
        componentInstance.currentBinService = foldersData[0][0].serviceId
        componentInstance.selectedEntity = 'ent'
        componentInstance.currentBinServiceName = foldersData[0][0].name
        await nextTick()
        const bin = wrapper.findComponent(BinDocuments)
        await nextTick()
        expect(bin.exists()).toBeTruthy()
        expect(bin.props('currentBinService')).toBe(foldersData[0][0].serviceId)
        expect(bin.props('selectedServiceName')).toBe(foldersData[0][0].name)
        expect(bin.props('selectedEntity')).toBe(
          '93012cc8-77b9-4161-8dbd-61915d935e21'
        )
      })
      it('should hide bin component when currentBinService is not set', async () => {
        expect.hasAssertions()
        const wrapper = createWrapper()
        await nextTick()
        const bin = wrapper.findComponent(BinDocuments)
        await nextTick()
        expect(bin.exists()).toBeFalsy()
      })
    })
    describe('events', () => {
      it('should update selected folder in documents when navigate-to-folder is emitted', async () => {
        expect.hasAssertions()
        const wrapper = createWrapper()
        await flushPromises()
        const componentInstance = wrapper.vm
        componentInstance.currentBinService = foldersData[0][0].serviceId
        await nextTick()
        const bin = wrapper.findComponent(BinDocuments)

        bin.vm.$emit('navigate-to-folder', foldersData[0][0].children[0])
        await nextTick()

        expect(vi.mocked(fetchUserEntityServices)).toHaveBeenCalledTimes(2)
        expect(vi.mocked(fetchServicesFolders)).toHaveBeenCalledTimes(2)

        const treeview = wrapper.findComponent(Treeview)
        await nextTick()
        expect(treeview.props('currentService')).toBe(foldersData[0][0].serviceId)
        expect(treeview.props('selectedFolder')).toStrictEqual(foldersData[0][0].children[0])
        await nextTick()
        expect(bin.exists()).toBeFalsy()
      })
    })
  })
})

import type { VueWrapper } from '@vue/test-utils'
import { shallowMount, flushPromises } from '@vue/test-utils'
import { defaultEntityMock } from '@ged/__mocks__/entity.mocks'
import { fetchServicesFoldersFailMock, fetchServicesFoldersSuccessMock } from './__mocks__/folder.service.mocks'
import { servicesDataMock } from '@ged/__mocks__/services.mocks'
import { foldersData } from '@ged/__mocks__/tree-folders.mocks'
import { fetchUserEntityServices } from '@ged/services/Services'
import { fetchServicesFolders } from '@ged/services/Folder'
import { GedServiceId } from '@ged/enums/ged.enum'
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
import { createMemoryHistory, createRouter, onBeforeRouteUpdate } from 'vue-router'
import { PNotification } from '@pulse/styleguide'
import { armGedServiceDefaults } from '@ged/__mocks__/arm-ged-services.mocks'
import * as FolderService from '@ged/services/Folder'
import * as ServicesService from '@ged/services/Services'
import * as BinDocumentsService from '@ged/services/BinDocuments'

import { getMockedEntitySummary } from '@pulse/common/mocks'
import { getStoreMock } from '@pulse/common/mocks/vitest'
import { useCurrentEntityStore } from '@pulse/common/stores'

import Ged from './Ged.vue'

const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)

const spyPNotification = vi.mocked(PNotification)

beforeEach(() => {
  armGedServiceDefaults()
  vi.mocked(onBeforeRouteUpdate).mockImplementation(() => undefined)
  vi.mocked(FolderService.fetchServicesFolders).mockImplementation(fetchServicesFoldersSuccessMock)
  vi.mocked(ServicesService.fetchUserEntityServices).mockResolvedValue(servicesDataMock)
  vi.mocked(BinDocumentsService.fetchBinDocuments).mockImplementation(
    () => undefined as unknown as ReturnType<typeof BinDocumentsService.fetchBinDocuments>,
  )
  vi.mocked(appendChildFolder).mockImplementation(() => true)
  vi.mocked(sortFolderByName).mockImplementation(() => undefined as unknown as boolean)
  vi.mocked(deleteFolder).mockImplementation(() => undefined as unknown as boolean)
  vi.mocked(renameFolder).mockImplementation(() => true)
  vi.mocked(findFolderDeepById).mockImplementation(() => undefined)
})

type AppSetup = {
  currentEntity: string
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
        {
          path: '/mon-chemin',
          name: 'TestRoute',
          component: Ged,
        },
        {
          path: '',
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

const currentEntityMock = getMockedEntitySummary(defaultEntityMock)

describe('ged', () => {
  beforeEach(() => {
    currentEntityStoreMock.currentEntity = currentEntityMock
  })
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
        expect(tree.props('currentService')).toBe(GedServiceId.ACCOUNTING)
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
          GedServiceId.ACCOUNTING,
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
        expect(bin.props('currentEntity')).toBe(defaultEntityMock.accountNumber)
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

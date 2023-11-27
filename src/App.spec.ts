import { VueWrapper, mount } from '@vue/test-utils'
import Ged from './'
import { createPinia, setActivePinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { fetchUserEntityServices } from '@/services/Services'
import { fetchServicesFolders } from '@/services/Folder'
import { ComponentPublicInstance, nextTick } from 'vue'
import { dynamicUntilFoundComponent } from '@kpmg/common/src/testing-helpers'
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

const pinia = createPinia()

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
}

type AppProps = any
export type AppWrapper = VueWrapper<ComponentPublicInstance<AppSetup, AppProps>>

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
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBeTruthy()
  })
  describe('treeview', () => {
    describe('interactions', () => {
      it('should ftech user entity services when ged is rendered', async () => {
        createWrapper()

        await nextTick()

        expect(vi.mocked(fetchUserEntityServices)).toHaveBeenCalledTimes(1)
      })

      it('should ftech services folders when ged is rendered', async () => {
        createWrapper()

        await nextTick()

        expect(vi.mocked(fetchServicesFolders)).toHaveBeenCalledTimes(1)
      })

      it(
        'should set the current folder and current service on selected-folder-change event',
        async () => {
          const wrapper = createWrapper()
          await nextTick()

          const tree = await dynamicUntilFoundComponent(wrapper, Treeview)
          await tree.vm.$emit('selected-folder-change', folder)
          await nextTick()

          expect(tree.props('selectedFolder')).toStrictEqual(folder)
          expect(tree.props('currentService')).toStrictEqual('some-service')
        }
      )

      it('should set the trash serviceId on selected-bin-service-change', async () => {
        const wrapper = createWrapper()
        await nextTick()

        const tree = await dynamicUntilFoundComponent(wrapper, Treeview)
        await tree.vm.$emit('selected-bin-service-change', servicesData[0].ServiceId)
        await nextTick()

        const componentInstance = wrapper.vm

        expect(componentInstance.currentBinService).toStrictEqual(
          servicesData[0].ServiceId
        )
      })

      it('should set isCreateFolderModalVisible when open-create-folder-modal', async () => {
        const wrapper = createWrapper()
        await nextTick()

        const tree = await dynamicUntilFoundComponent(wrapper, Treeview)
        await tree.vm.$emit(
          'open-create-folder-modal'
        )
        await nextTick()

        const componentInstance = wrapper.vm

        expect(componentInstance.isCreateFolderModalVisible).toBeTruthy()
      })

      it('should append folder in tree and sort when update-source-folders', async () => {
        const wrapper = createWrapper()
        await nextTick()

        const tree = await dynamicUntilFoundComponent(wrapper, Treeview)
        await tree.vm.$emit('update-source-folders', foldersData[0][0].children[0])
        await nextTick()

        expect(vi.mocked(appendChildFolder)).toHaveBeenCalledTimes(1)
        expect(vi.mocked(sortFolderByName)).toHaveBeenCalledTimes(1)
        expect(vi.mocked(findFolderDeepById)).toHaveBeenCalledTimes(3)
      })

      it('should remove folder from tree when remove-folder-from-source', async () => {
        const wrapper = createWrapper()
        await nextTick()

        const tree = await dynamicUntilFoundComponent(wrapper, Treeview)
        await tree.vm.$emit(
          'remove-folder-from-source',
          foldersData[0][0].children[0]
        )
        await nextTick()

        expect(vi.mocked(deleteFolder)).toHaveBeenCalledTimes(1)
        expect(vi.mocked(findFolderDeepById)).toHaveBeenCalledTimes(3)

      })

      it('should rename folder in tree and sort when update-folder-name', async () => {
        const wrapper = createWrapper()
        await nextTick()

        const tree = await dynamicUntilFoundComponent(wrapper, Treeview)
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
        const wrapper = createWrapper()

        const documentComponent = await dynamicUntilFoundComponent(wrapper, Documents)
        await nextTick()
        expect(documentComponent.exists()).toBeTruthy()
      })
    })
    it('should update selected folder in documents when change-selected-folder', async () => {
      const wrapper = createWrapper()
      await nextTick()

      const documentComponent = await dynamicUntilFoundComponent(wrapper, Documents)
      await documentComponent.vm.$emit('change-selected-folder', foldersData[0][0].children[0])
      await nextTick()

      expect(documentComponent.props('selectedFolder')).toStrictEqual(foldersData[0][0].children[0])
      expect(documentComponent.props('currentService')).toStrictEqual('service-id-compta')

    })
  })
})

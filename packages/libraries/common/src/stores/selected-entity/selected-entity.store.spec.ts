import { setActivePinia, createPinia } from 'pinia'
import { useSelectedEntityStore } from './selected-entity.store'
import { getMockedEntity } from '@common/__mocks__'

const selectedEntityMock = getMockedEntity()

describe('test selectedEntityStore', () => {
  let selectedEntityStore: ReturnType<typeof useSelectedEntityStore>

  beforeEach(() => {
    setActivePinia(createPinia())

    selectedEntityStore = useSelectedEntityStore()
  })

  it('should set selectedEntity properly when call setSelectedEntity()', () => {
    selectedEntityStore.setSelectedEntity(selectedEntityMock)

    expect(selectedEntityStore.selectedEntity).toStrictEqual(selectedEntityMock)
  })
})

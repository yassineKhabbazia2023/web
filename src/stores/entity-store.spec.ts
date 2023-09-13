import { createTestingPinia } from '@pinia/testing'
import { describe, expect, it, vi } from 'vitest'
import { useEntityStore } from './entity-store'

const pinia = createTestingPinia()
const entities = [
  { name: 'Entity 1', accountNumber: '123' },
  { name: 'Entity 2', accountNumber: '456' }
]
vi.mock('@kpmg/common', async () => ({
  commonApi: () => ({
    customers: {
      get: () => Promise.resolve({ data: entities })
    }
  })
}))

describe('entities table Store', () => {

  it('that gets account is called', async () => {
    const store = useEntityStore(pinia)
    await store.getEntities()
    store.entities = entities
    expect(store.entities).toStrictEqual(entities)
  })
})

import { createPinia, setActivePinia } from 'pinia'
import { useKeyMomentsEditionStore } from './key-moments-edition.store'

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('useKeyMomentsEditionStore', () => {
  it('should read no edition open at first', () => {
    const store = useKeyMomentsEditionStore()

    expect(store.hasOpenEdition).toBe(false)
  })

  /** Two encarts open at once: closing one must not read the report as free. */
  it('should count the editions rather than flag them', () => {
    const store = useKeyMomentsEditionStore()

    store.openEdition()
    store.openEdition()
    store.closeEdition()

    expect(store.hasOpenEdition).toBe(true)

    store.closeEdition()

    expect(store.hasOpenEdition).toBe(false)
  })

  it('should never count below nothing', () => {
    const store = useKeyMomentsEditionStore()

    store.closeEdition()

    expect(store.openEditionCount).toBe(0)
  })
})

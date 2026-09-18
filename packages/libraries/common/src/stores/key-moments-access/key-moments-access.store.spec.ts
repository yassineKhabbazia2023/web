import { setActivePinia, createPinia } from 'pinia'
import { useKeyMomentsAccessStore } from './key-moments-access.store'

describe('useKeyMomentsAccessStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should hide the key moments by default', () => {
    const store = useKeyMomentsAccessStore()

    expect(store.canShowKeyMoments).toBe(false)
  })

  it.each([true, false])('should hold the value it is given (%s)', (canShow) => {
    const store = useKeyMomentsAccessStore()

    store.setCanShowKeyMoments(canShow)

    expect(store.canShowKeyMoments).toBe(canShow)
  })

  it('should hide the key moments again on reset', () => {
    const store = useKeyMomentsAccessStore()
    store.setCanShowKeyMoments(true)

    store.reset()

    expect(store.canShowKeyMoments).toBe(false)
  })
})

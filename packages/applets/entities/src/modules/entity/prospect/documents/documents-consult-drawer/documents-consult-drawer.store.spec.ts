import { createPinia, setActivePinia } from 'pinia'
import { useDocumentsConsultDrawerStore } from './documents-consult-drawer.store'

describe('documents-consult-drawer.store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should be closed by default', () => {
    const store = useDocumentsConsultDrawerStore()

    expect(store.isOpen).toBe(false)
  })

  it('should open the drawer when open is called', () => {
    const store = useDocumentsConsultDrawerStore()

    store.open()

    expect(store.isOpen).toBe(true)
  })

  it('should close the drawer when close is called', () => {
    const store = useDocumentsConsultDrawerStore()
    store.open()

    store.close()

    expect(store.isOpen).toBe(false)
  })
})

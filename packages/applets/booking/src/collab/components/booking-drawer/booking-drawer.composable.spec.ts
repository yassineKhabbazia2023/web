import { createPinia, setActivePinia } from 'pinia'
import { useBookingCollabStore } from '@pulse/common/stores'
import { useBookingDrawer } from './booking-drawer.composable'

vi.mock('vue-i18n', () => ({
  createI18n: vi.fn(() => ({})),
  useI18n: () => ({
    t: (key: string) => key,
  }),
}))

describe('booking-drawer.composable', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('initial state', () => {
    it('should return isLoading as false initially', () => {
      const { isLoading } = useBookingDrawer()

      expect(isLoading.value).toBe(false)
    })

    it('should return drawerTitle with translation key', () => {
      const { drawerTitle } = useBookingDrawer()

      expect(drawerTitle.value).toBe('booking-drawer.drawerTitle')
    })

    it('should return isBookingDrawerOpened as false initially', () => {
      const { isBookingDrawerOpened } = useBookingDrawer()

      expect(isBookingDrawerOpened.value).toBe(false)
    })

    it('should return isBookingDrawerOpened as true when store drawer is opened', () => {
      const store = useBookingCollabStore()
      store.openBookingDrawer()

      const { isBookingDrawerOpened } = useBookingDrawer()

      expect(isBookingDrawerOpened.value).toBe(true)
    })
  })

  describe('closeBookingDrawer', () => {
    it('should expose closeBookingDrawer from store', () => {
      const { closeBookingDrawer } = useBookingDrawer()

      expect(closeBookingDrawer).toBeDefined()
      expect(typeof closeBookingDrawer).toBe('function')
    })

    it('should close the drawer when called', () => {
      const store = useBookingCollabStore()
      store.openBookingDrawer()

      const { closeBookingDrawer, isBookingDrawerOpened } = useBookingDrawer()

      expect(isBookingDrawerOpened.value).toBe(true)
      closeBookingDrawer()
      expect(isBookingDrawerOpened.value).toBe(false)
    })
  })

  describe('updateDrawerTitle', () => {
    it('should update drawerTitle when called with new title', () => {
      const { drawerTitle, updateDrawerTitle } = useBookingDrawer()

      updateDrawerTitle('New Title')

      expect(drawerTitle.value).toBe('New Title')
    })

    it('should update drawerTitle multiple times', () => {
      const { drawerTitle, updateDrawerTitle } = useBookingDrawer()

      updateDrawerTitle('First Title')
      expect(drawerTitle.value).toBe('First Title')

      updateDrawerTitle('Second Title')
      expect(drawerTitle.value).toBe('Second Title')
    })

    it('should allow empty string as title', () => {
      const { drawerTitle, updateDrawerTitle } = useBookingDrawer()

      updateDrawerTitle('')

      expect(drawerTitle.value).toBe('')
    })
  })
})

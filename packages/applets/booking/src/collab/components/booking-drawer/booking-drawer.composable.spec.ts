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

    it('should return isBookingCreationDrawerOpened as false initially', () => {
      const { isBookingCreationDrawerOpened } = useBookingDrawer()

      expect(isBookingCreationDrawerOpened.value).toBe(false)
    })

    it('should return isBookingCreationDrawerOpened as true when store drawer is opened', () => {
      const store = useBookingCollabStore()
      store.openBookingCreationDrawer()

      const { isBookingCreationDrawerOpened } = useBookingDrawer()

      expect(isBookingCreationDrawerOpened.value).toBe(true)
    })
  })

  describe('closeBookingCreationDrawer', () => {
    it('should expose closeBookingCreationDrawer from store', () => {
      const { closeBookingCreationDrawer } = useBookingDrawer()

      expect(closeBookingCreationDrawer).toBeDefined()
      expect(typeof closeBookingCreationDrawer).toBe('function')
    })

    it('should close the drawer when called', () => {
      const store = useBookingCollabStore()
      store.openBookingCreationDrawer()

      const { closeBookingCreationDrawer, isBookingCreationDrawerOpened } = useBookingDrawer()

      expect(isBookingCreationDrawerOpened.value).toBe(true)
      closeBookingCreationDrawer()
      expect(isBookingCreationDrawerOpened.value).toBe(false)
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

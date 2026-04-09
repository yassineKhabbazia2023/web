import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useBookingCollabStore } from '@pulse/common/stores'

export function useBookingDrawer() {
  const { t } = useI18n()
  const bookingCollabStore = useBookingCollabStore()
  const { isBookingDrawerOpened } = storeToRefs(bookingCollabStore)
  const { closeBookingDrawer } = bookingCollabStore

  // State
  const isLoading = ref(false)

  const drawerTitle = ref(t('booking-drawer.drawerTitle'))
  function updateDrawerTitle(newTitle: string) {
    drawerTitle.value = newTitle
  }

  return {
    // State
    drawerTitle,
    isBookingDrawerOpened,
    isLoading,
    // Methods
    closeBookingDrawer,
    updateDrawerTitle,
  }
}

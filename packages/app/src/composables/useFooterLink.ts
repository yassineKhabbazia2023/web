import { ref } from 'vue'

export const useFooterLink = () => {
  const isCopyrightDrawerOpened = ref(false)
  const handleCopyrightLink = () => {
    isCopyrightDrawerOpened.value = true
  }
  const handleCloseDrawer = () => {
    isCopyrightDrawerOpened.value = false
  }

  return {
    handleCopyrightLink,
    handleCloseDrawer,
    isCopyrightDrawerOpened,
  }
}

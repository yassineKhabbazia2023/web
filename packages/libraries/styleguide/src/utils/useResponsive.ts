import { computed, onMounted, onUnmounted, ref } from 'vue'
import { BREAKPOINT_SIZES } from '../guidelines/Layout/constants'

export function useResponsive() {
  const { sm, md } = BREAKPOINT_SIZES

  const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 0)

  const isMobile = computed(() => windowWidth.value <= sm)
  const isTablet = computed(() => windowWidth.value > sm && windowWidth.value <= md)
  const isDesktop = computed(() => windowWidth.value > md)

  function handleResize() {
    windowWidth.value = window.innerWidth
  }

  onMounted(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize)
    }
  })

  onUnmounted(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', handleResize)
    }
  })

  return {
    windowWidth,
    isMobile,
    isTablet,
    isDesktop,
  }
}

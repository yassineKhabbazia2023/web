import { computed } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { getIsMobile } from '../utils/breakpoints'

export function useBreakpoint() {
  const { width } = useWindowSize()

  const isMobile = computed(() => getIsMobile(width.value))

  return {
    isMobile,
  }
}

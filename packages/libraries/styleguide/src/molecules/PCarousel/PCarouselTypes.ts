import type { PCarouselItemProps } from '@/atoms/PCarouselItem/PCarouselItemTypes'

export interface PCarouselProps {
  pItems: PCarouselItemProps[]
  pHeight?: string
  pInitialIndex?: number
  pTrigger?: 'hover' | 'click'
  pAutoplay?: boolean
  pInterval?: number
  pArrow?: 'always' | 'hover' | 'never'
  pLoop?: boolean
  pDirection?: 'vertical' | 'horizontal'
  pPauseOnHover?: boolean
}

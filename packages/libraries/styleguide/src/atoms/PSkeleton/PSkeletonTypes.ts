export interface PSkeletonProps {
  pAnimated?: boolean
  pCount?: number
  pRows?: number
  pLoading?: boolean
  pThrottle?: number
}

export interface PSkeletonItemProps {
  pVariant?: 'text' | 'button' | 'circle' | 'caption' | 'image' | 'rect' | 'h1' | 'h3' | 'p'
}

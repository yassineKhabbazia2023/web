export interface ThumbsRatingProps {
  label?: string
}

export interface ThumbsRatingEmits {
  (event: 'rate', value: boolean): void
}

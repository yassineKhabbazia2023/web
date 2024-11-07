export type Prefix = 'bg' | 'text-color' | 'hover-bg' | 'hover-text-color'
export type Color = {
  colorKey: string
  className: string
  color: string
}
export type ColorGroup = {
  groupKey: string
  colors: Color[]
}

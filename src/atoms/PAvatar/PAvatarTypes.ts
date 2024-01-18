export interface PAvatarProps {
  pType?: '' | 'default' | 'small' | 'large' | 'xsmall' | 'xlarge'
  pColor?: ''
    | 'persian-gradient'
    | 'orange'
    | 'persian'
    | 'cyan'
    | 'amethyste'
    | 'teal'
    | 'green'
    | 'fuschia'
    | 'gray'
    | 'white'
    | 'bordered-persian'
  pFit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'
  pSrc?: string
  pShape? : 'circle' | 'square',
  pSelected?: boolean
}

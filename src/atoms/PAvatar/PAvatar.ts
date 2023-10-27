export interface PAvatarProps {
  pType?: '' | 'default' | 'small' | 'large' | 'xsmall' | 'xlarge',
  pColor?: ''
    |'persian-gradient'
    | 'orange'
    | 'persian'
    | 'teal'
    | 'green'
    | 'fuschia'
    | 'gray'
    | 'white',
  pFit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down',
  pSrc?: string
  pShape? : 'circle' | 'square'
}

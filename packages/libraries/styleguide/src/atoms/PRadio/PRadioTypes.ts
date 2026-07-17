export type PRadioValue = string | number | boolean

export interface PRadioProps {
  pLabel?: PRadioValue
  pDisabled?: boolean
  pBorder?: boolean
  pSize?: 'large' | 'default' | 'small'
  pName?: string
}

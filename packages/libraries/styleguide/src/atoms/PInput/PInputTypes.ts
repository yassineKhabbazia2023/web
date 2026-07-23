import type { CSSProperties } from 'vue'
import type { IconName } from '../../types/IconName.types'

export interface PInputProps {
  pType?: string
  pMaxlength?: string | number
  pMinlength?: number
  pShowWordLimit?: boolean
  pPlaceholder?: string
  pClearable?: boolean
  pFormatter?: (_value?: string | number) => string
  pParser?: (_value?: string) => string
  pShowPassword?: boolean
  pDisabled?: boolean
  pSize?: 'large' | 'default' | 'small'
  pPrefixIconName?: IconName
  pSuffixIconName?: IconName
  pRows?: number
  pAutosize?: boolean | { minRows?: number, maxRows?: number }
  pAutocomplete?: string
  pName?: string
  pReadonly?: boolean
  pMax?: number | Date
  pMin?: number | Date
  pStep?: number
  pResize?: 'none' | 'both' | 'horizontal' | 'vertical'
  pAutofocus?: boolean
  pForm?: string
  pLabel?: string
  pTabindex?: number | string
  pValidateEvent?: boolean
  pInputStyle?: string | CSSProperties | CSSProperties[] | string[]
  pTestId?: string
}

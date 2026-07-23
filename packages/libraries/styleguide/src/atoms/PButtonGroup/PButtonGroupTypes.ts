import type { PButtonProps } from '../../atoms/PButton/PButtonTypes'
import type { InjectionKey } from 'vue'

export interface PButtonGroupProps {
  pType: PButtonProps['pType']
  pSize: PButtonProps['pSize']
  pTestId?: string
}

export const injectionButtonKey: InjectionKey<PButtonGroupProps> = Symbol(
  'injectionButtonKey',
)

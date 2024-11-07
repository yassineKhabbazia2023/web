import type { GlobalStates } from '@/utils/types/states'

export type PAlertProps = {
  pType?: Omit<'default', GlobalStates> | 'main'
  pIcon?: string
  pClosable?: boolean
}

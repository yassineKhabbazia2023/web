import type { GlobalStates } from '@/utils/types/states'

export type PAlertProps = {
  type?: Omit<'default', GlobalStates> | 'main'
}

import type { IconName } from '../../types/IconName.types'

export type PNoticeCardHeaderColor =
  | ''
  | 'dark-green'
  | 'dark-blue'
  | 'teal'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'
  | 'purple'
  | 'red'
  | 'orange'
  | 'pennylane'

export type PNoticeCardBodyColor =
  | ''
  | 'default'
  | 'light-green'
  | 'green-lighter'
  | 'light-blue'
  | 'lighter-gray'
  | 'light-gray'
  | 'tranquil'

export interface PNoticeCardProps {
  pTitle: string
  pIcon?: IconName
  pHeaderColor?: PNoticeCardHeaderColor
  pBodyColor?: PNoticeCardBodyColor
}

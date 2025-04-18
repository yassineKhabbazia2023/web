import type { Mandate } from '@mandate/pages/mandate/Models'

export interface ListMandateProps {
  currentPage: number
  data: Mandate[]
}

export type ActionEvent = 'download-pre-filled-mandate' |
  'submit-signed-mandate' | 'download-signed-mandate' | 'cancel-telecollection'

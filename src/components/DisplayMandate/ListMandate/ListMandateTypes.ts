import type { Mandate } from '@/pages/home/Models'

export interface ListMandateProps {
  data: Mandate[]
}

export type ActionEvent = 'download-pre-filled-mandate' |
  'submit-signed-mandate' | 'download-signed-mandate' | 'cancel-telecollection'

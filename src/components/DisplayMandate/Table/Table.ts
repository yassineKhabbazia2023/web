import { Mandate } from '@/pages/home/Models'

export interface TableProps {
  data: Mandate[]
}

export type ActionEvent = 'download-pre-filled-mandate' |
  'submit-signed-mandate' | 'download-signed-mandate' | 'cancel-telecollection'

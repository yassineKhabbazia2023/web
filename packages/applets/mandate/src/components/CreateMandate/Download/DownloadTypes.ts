import type { Mandate } from '@mandate/types/mandate.types'

export interface DownloadProps {
  mandateId: Mandate['id']
}

export interface TrackedMandate {
  status: number
  errorMessage?: string
}

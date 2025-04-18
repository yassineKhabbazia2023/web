import type { Mandate } from '@mandate/pages/mandate/Models'

export interface DownloadProps {
  mandateId: Mandate['id']
}

export interface TrackedMandate {
  status: number
  errorMessage?: string
}

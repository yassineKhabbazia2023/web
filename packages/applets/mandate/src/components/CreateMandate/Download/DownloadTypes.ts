import type { Mandate } from '@mandate/pages/home/Models'

export interface DownloadProps {
  mandateId: Mandate['id']
}

export interface TrackedMandate {
  status: number
  errorMessage?: string
}

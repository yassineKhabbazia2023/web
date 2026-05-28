export enum InvoicesTabState {
  FORM_START = 'form-start',
  FORM_SUBMITTED = 'form-submitted',
  CONNECTION_READY_LOCKED = 'connection-ready-locked',
  CONNECTION_READY_UNLOCKED = 'connection-ready-unlocked',
}

export interface InvoicesAccessApiResponse {
  'tab-state': InvoicesTabState
  contactWithAccess: string | null
  externalDematMail: string | null
}

export interface InvoicesAccessResponse {
  tabState: InvoicesTabState
  contactWithAccess: string | null
  externalDematMail: string | null
}

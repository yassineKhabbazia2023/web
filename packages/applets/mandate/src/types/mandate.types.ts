export enum MandateActions {
  CAN_DOWNLOAD_PREFILLED_MANDATE = 'CAN_DOWNLOAD_PREFILLED_MANDATE',
  CAN_UPLOAD_SIGNED_MANDATE = 'CAN_UPLOAD_SIGNED_MANDATE',
  CAN_DOWNLOAD_SIGNED_MANDATE = 'CAN_DOWNLOAD_SIGNED_MANDATE',
  CAN_TERMINATE_TELECOLLECT = 'CAN_TERMINATE_TELECOLLECT',
}

export interface Mandate {
  id: string
  erpId: string
  companyName: string
  accountNumber: string
  bankName: string
  jdcPartnership: string | number
  creationDate: string
  modificationDate: string
  statusCode: string
  jdcStatusCode: string | number
  jdcStatusDescription: string
  permittedActions: MandateActions[]
}

export interface MandateCounters {
  all: number
  status10: number
  status20: number
  status30: number
  status40: number
  status50: number
}

export interface MandateCollection {
  counters: MandateCounters
  data: Mandate[]
}

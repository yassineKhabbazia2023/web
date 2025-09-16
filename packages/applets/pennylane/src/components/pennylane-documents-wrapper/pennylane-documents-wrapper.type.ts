import type { FormattedPennylaneDocument } from '@pennylane/types/pennylane-documents.type'
import { APICallStatus } from '@pulse/common/enums'
import { PennylaneDocumentWrapperDisplayMode } from '@pennylane/enums/pennylane-documents-wrapper.enum'

export interface PennylaneDocumentWrapperProps {
  apiCallStatus: APICallStatus
  pennylaneDocuments: FormattedPennylaneDocument[]
  pennylaneLastSynchroDate?: Date
  displayMode: PennylaneDocumentWrapperDisplayMode
  accountName: string
  amplitudeLocalisation: 'homepage' | 'documents rydge conseil'
  accountNumber: string
  accountId: number
}

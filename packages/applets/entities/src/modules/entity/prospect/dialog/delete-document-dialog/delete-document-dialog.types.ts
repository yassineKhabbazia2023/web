export interface DeleteDocumentDialogProps {
  pProspectId: number
  pDocumentId: number | string | undefined
  pFileName?: string
}

export type DeleteDocumentDialogEmits = {
  deleted: []
}

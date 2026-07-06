export interface DeleteDocumentDialogProps {
  accountId: number
  pDocumentId: number | string | undefined
  pFileName?: string
}

export type DeleteDocumentDialogEmits = {
  deleted: []
}

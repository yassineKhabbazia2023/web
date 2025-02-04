import type { Document } from '@ged/models/Document'

export function getIsDocumentCertified(document: Document) {
  return document.properties?.HasSubscribedToVault !== undefined
}

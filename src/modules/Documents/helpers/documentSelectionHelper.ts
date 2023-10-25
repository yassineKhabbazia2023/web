import { Document } from '@/models/Document'
export function getPermissionsFromDocuments(documents: Document[]): string[] {
  const permissions = new Set<string>()
  for (const document of documents) {
    const documentPermissions = document.permissions

    for (const permission of documentPermissions) {
      permissions.add(permission)
    }
  }
  // Check if there is more than one document to rename.
  if (documents.length > 1) {
    // If the condition is met, remove the 'CAN_RENAME_DOCUMENT' permission from the set.
    permissions.delete('CAN_RENAME_DOCUMENT')
  }
  return Array.from(permissions)
}

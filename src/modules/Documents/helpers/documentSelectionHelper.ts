import { Document } from '@/models/Document'
export function getPermissionsFromDocuments(documents: Document[]): string[] {
  const permissions = new Set<string>()
  for (const document of documents) {
    const documentPermissions = document.permissions

    for (const permission of documentPermissions) {
      permissions.add(permission)
    }
  }
  return Array.from(permissions)
}

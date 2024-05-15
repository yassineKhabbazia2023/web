/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import type { Folder } from '@/models/Folder'
import type { Document } from '@/models/Document'
import { ServicesIds } from '@/modules/common/constants/services'

// move to module

const findParentAndOperate = (
  folders: Folder[],
  operation: (folder: Folder) => boolean,
): boolean => {
  for (const folder of folders) {
    if (operation(folder)) {
      return true
    }
    if (
      folder.children.length > 0 &&
      findParentAndOperate(folder.children, operation)
    ) {
      return true
    }
  }
  return false
}

export const findFolderDeepById = (
  array: Folder[],
  folderId: number | null,
): Folder | undefined => {
  for (let i = 0; i < array.length; i++) {
    const element = array[i]

    if (element.id === folderId) {
      return element
    }
    const found = findFolderDeepById(element.children, folderId)

    if (found) return found
  }
}

export const findCurrentServiceFolder = (
  array: Folder[][],
  serviceId: string,
): Folder[] | undefined => {
  return array.find((innerArry) => {
    if (innerArry.some((x) => x.serviceId === serviceId)) {
      return innerArry
    }
    return [] as Folder[]
  })
}

export const appendChildFolder = (
  servicesFolders: Folder[][],
  parentId: number,
  newFolder: Folder,
  serviceId: string,
): boolean => {
  return servicesFolders.some((serviceFolder) => {
    if (serviceFolder[0].serviceId === serviceId) {
      return findParentAndOperate(serviceFolder, (folder) => {
        if (folder.id === parentId) {
          folder.children.push(newFolder)
          return true
        }
        return false
      })
    }
    return false
  })
}
export const renameFolder = (
  servicesFolders: Folder[][],
  serviceId: string,
  folderUpdated: Folder,
): boolean => {
  return servicesFolders.some((serviceFolder) => {
    if (serviceFolder[0].serviceId === serviceId) {
      return findParentAndOperate(serviceFolder, (folder) => {
        if (folder.id === folderUpdated.id) {
          folder.name = folderUpdated.name
          return true
        }
        return false
      })
    }
    return false
  })
}
export const sortFolderByName = (
  array: Folder[][],
  serviceId: string,
  folderToSortId: number,
) => {
  return array.some((serviceFolder) => {
    if (serviceFolder[0].serviceId === serviceId) {
      return findParentAndOperate(serviceFolder, (folder) => {
        if (folder.id === folderToSortId) {
          folder.children.sort((a, b) => a.name.localeCompare(b.name))
          return true
        }
        return false
      })
    }
    return false
  })
}

export const deleteFolder = (
  array: Folder[][],
  serviceId: string,
  parentFolderId: Folder['id'],
  folderIdToDelete: Folder['id'],
) => {
  return array.some((serviceFolder) => {
    if (serviceFolder[0].serviceId === serviceId) {
      return findParentAndOperate(serviceFolder, (folder) => {
        if (folder.id === parentFolderId) {
          const folderIndex = folder.children.findIndex(
            (child) => child.id === folderIdToDelete,
          )
          if (folderIndex !== -1) {
            folder.children.splice(folderIndex, 1)
            return true
          }
        }
        return false
      })
    }
    return false
  })
}

export const getFolderPath = (folders: Folder[], folder: Folder): string[] => {
  // Vérifier si le serviceId du dossier correspond à l'un des IDs dans l'enum
  if (folder.serviceId === ServicesIds.ACCOUNTING || folder.serviceId === ServicesIds.SOCIAL) {
    return [folder.name] // Commencez le chemin ici, ne remontez pas plus loin
  }

  // Si le dossier n'a pas de parent, on commence le chemin avec son propre nom
  if (!folder.parent) {
    return [folder.name]
  }

  // Trouver le parent du dossier actuel dans la liste des dossiers
  const parentFolder = folders.find(f => f.id === folder.parent.id)

  if (!parentFolder) {
    // Si le parent n'est pas trouvé, commencez simplement avec le nom du dossier actuel
    return [folder.name]
  }

  // Récursion: obtenir le chemin du parent et ajouter le nom du dossier actuel
  return [...getFolderPath(folders, parentFolder), folder.name]
}

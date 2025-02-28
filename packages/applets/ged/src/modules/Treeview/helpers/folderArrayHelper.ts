
import type { Folder } from '@ged/models/Folder'

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

    if (found) {
      return found
    }
  }
}

export const findCurrentServiceFolder = (
  array: Folder[][],
  serviceId: string,
): Folder[] | undefined => {
  return array.find((innerArray) => innerArray.some((x) => x.serviceId === serviceId))
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

export function getFolderPath(folders: Folder[], targetFolder: Folder): string[] | null {
  for (const folder of folders) {
    if (folder.id === targetFolder.id) {
      // The target folder is found, return the path to it consisting of its name
      return [folder.name]
    }

    if (folder.children.length > 0) {
      // Recursively search for the target folder in the children of the current folder
      const pathInChildren = getFolderPath(folder.children, targetFolder)

      if (pathInChildren !== null) {
        // The target folder is found in the children, return the complete path to it
        // by prefixing the path in the children with the name of the current folder
        return [folder.name, ...pathInChildren]
      }
    }
  }

  // The target folder is not found, return null
  return null
}

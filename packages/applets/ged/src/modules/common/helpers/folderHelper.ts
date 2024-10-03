import type { Folder } from '@ged/models/Folder'
import { type BreadcrumbItems }
  from '@pulse/styleguide' // FIXME it was this on TPME: /dist/types/src/molecules/PBreadcrumb/PBreadcrumbTypes
import {
  findFolderDeepById,
} from '@ged/modules/Treeview/helpers/folderArrayHelper'

export const getBreadcrumbItems = (
  root: Folder[],
  id: number,
  acc: BreadcrumbItems[] = [],
): BreadcrumbItems[] | undefined => {
  if (root.length === 0) {
    return []
  }

  const folder = findFolderDeepById(root, id)
  if (folder && folder.id) {
    const item: BreadcrumbItems = {
      pId: folder.id,
      pText: folder.name,
    }
    acc.push(item)

    if (folder.parent.id === 0) {
      return acc.reverse()
    }

    return getBreadcrumbItems(root, folder.parent.id, acc)
  }
}


// eslint-disable-next-line max-len
import type { PToolboxItemProps } from '@kpmg/styleguide/dist/types/src/atoms/PToolboxItem/PToolboxItemTypes'

interface ToolboxLineWithOrder {
  toolboxLine: PToolboxItemProps
  order: number
}

const foldersMappingRecord: Record<string, ToolboxLineWithOrder> = {
  CAN_DELETE_FOLDER: {
    toolboxLine: {
      pIconName: 'PITrash',
      pValue: 'Supprimer',
      pActionName: 'toolbox-delete-action-click'
    },
    order: 4
  },
  CAN_CREATE_FOLDER: {
    toolboxLine: {
      pIconName: 'PIFolderPlus',
      pValue: 'Nouveau dossier',
      pActionName: 'toolbox-create-action-click'
    },
    order: 1
  },
  CAN_RENAME_FOLDER: {
    toolboxLine: {
      pIconName: 'PIInputCursorText',
      pValue: 'Renommer dossier',
      pActionName: 'toolbox-rename-action-click'
    },
    order: 2
  },
  CAN_DOWNLOAD_FOLDER: {
    toolboxLine: {
      pIconName: 'PIDownload',
      pValue: 'Télécharger',
      pActionName: 'toolbox-download-action-click'
    },
    order: 3
  },
  CAN_MOVE_FOLDER: {
    toolboxLine: {
      pIconName: 'PIFolderMove',
      pValue: 'Déplacer vers',
      pActionName: 'move-folder'
    },
    order: 4
  }
}

const documentsMappingRecord: Record<string, ToolboxLineWithOrder> = {
  CAN_RENAME_DOCUMENT: {
    toolboxLine: {
      pIconName: 'PIInputCursorText',
      pValue: 'Renommer',
      pActionName: 'rename-document'
    },
    order: 1
  },
  CAN_TRANSMIT_DOCUMENT: {
    toolboxLine: {
      pIconName: 'PIRocket',
      pValue: 'Envoi immédiat',
      pActionName: 'transmit-document'
    },
    order: 2
  },

  CAN_DOWNLOAD_DOCUMENT: {
    toolboxLine: {
      pIconName: 'PIDownload',
      pValue: 'Télécharger',
      pActionName: 'download-document'
    },
    order: 3
  },
  CAN_MOVE_DOCUMENT: {
    toolboxLine: {
      pIconName: 'PIFolderMove',
      pValue: 'Déplacer vers',
      pActionName: 'move-document'
    },
    order: 4
  },
  CAN_DELETE_DOCUMENT: {
    toolboxLine: {
      pIconName: 'PITrash',
      pValue: 'Supprimer',
      pActionName: 'delete-document'
    },
    order: 5
  }
}

export function generateToolboxBasicData(
  target: string,
  permissions: string[]
): PToolboxItemProps[] {
  const toolboxBasicData: ToolboxLineWithOrder[] = []
  const mappingRecord =
    target === 'Documents' ? documentsMappingRecord : foldersMappingRecord
  if (target === 'Documents') {
    toolboxBasicData.push(mappingRecord.CAN_DOWNLOAD_DOCUMENT)
  } else {
    toolboxBasicData.push(mappingRecord.CAN_DOWNLOAD_FOLDER)
  }
  for (const permission of permissions) {
    if (mappingRecord[permission]) {
      toolboxBasicData.push(mappingRecord[permission])
    }
  }
  return toolboxBasicData
    .sort((a, b) => (a.order > b.order ? 1 : -1))
    ?.map((e) => e?.toolboxLine)
}

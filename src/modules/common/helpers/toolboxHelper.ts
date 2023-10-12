interface ToolboxLine {
  iconName: string
  value: string
  actionName: string
}
interface ToolboxLineWithOrder {
  toolboxLine: ToolboxLine
  order: number
}

const foldersMappingRecord: Record<string, ToolboxLineWithOrder> = {
  CAN_DELETE_FOLDER: {
    toolboxLine: {
      iconName: 'PITrash',
      value: 'Supprimer',
      actionName: 'toolbox-delete-action-click'
    },
    order: 3
  },
  CAN_CREATE_FOLDER: {
    toolboxLine: {
      iconName: 'PIFolderPlus',
      value: 'Nouveau dossier',
      actionName: 'toolbox-create-action-click'
    },
    order: 1
  },
  CAN_RENAME_FOLDER: {
    toolboxLine: {
      iconName: 'PIInputCursorText',
      value: 'Renommer dossier',
      actionName: 'toolbox-rename-action-click'
    },
    order: 2
  }
}

const documentsMappingRecord: Record<string, ToolboxLineWithOrder> = {
  CAN_RENAME_DOCUMENT: {
    toolboxLine: {
      iconName: 'PIInputCursorText',
      value: 'Renommer',
      actionName: 'rename-document-action-click'
    },
    order: 1
  },
  CAN_TRANSMIT_DOCUMENT: {
    toolboxLine: {
      iconName: 'PIRocket',
      value: 'Envoi immédiat',
      actionName: 'ransmit-doucment-action-click'
    },
    order: 2
  },

  CAN_DOWNLOAD_DOCUMENT: {
    toolboxLine: {
      iconName: 'PIDownload',
      value: 'Télécharger',
      actionName: 'download-document-action-click'
    },
    order: 3
  },
  CAN_MOVE_DOCUMENT: {
    toolboxLine: {
      iconName: 'PIFolderMove',
      value: 'Déplacer vers',
      actionName: 'move-document-action-click'
    },
    order: 4
  },
  CAN_DELETE_DOCUMENT: {
    toolboxLine: {
      iconName: 'PITrash',
      value: 'Supprimer',
      actionName: 'delete-document-action-click'
    },
    order: 5
  }
}

export function generateToolboxBasicData(
  target: string,
  permissions: string[]
): ToolboxLine[] {
  const toolboxBasicData: ToolboxLineWithOrder[] = []
  const mappingRecord =
    target === 'Documents' ? documentsMappingRecord : foldersMappingRecord
  if (target === 'Documents') {
    toolboxBasicData.push(mappingRecord.CAN_DOWNLOAD_DOCUMENT)
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

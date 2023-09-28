interface ToolboxLine {
  iconName: string
  value: string
  actionName: string
}
interface ToolboxLineWithOrder {
  toolboxLine: ToolboxLine
  order: number
}

const mappingRecord: Record<string, ToolboxLineWithOrder> = {
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

export function generateToolboxBasicData(permissions: string[]): ToolboxLine[] {
  const toolboxBasicData: ToolboxLineWithOrder[] = []
  for (const permission of permissions) {
    if (mappingRecord[permission]) {
      toolboxBasicData.push(mappingRecord[permission])
    }
  }
  return (toolboxBasicData.sort((a, b) => (a.order > b.order) ? 1 : -1)?.map(e => e?.toolboxLine))
}

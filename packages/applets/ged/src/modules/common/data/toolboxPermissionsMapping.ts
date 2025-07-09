import type { ToolboxLineWithOrder } from '@ged/modules/common/Types/toolbox.types'

export const foldersMappingRecord: Record<string, ToolboxLineWithOrder> = {
  CAN_DELETE_FOLDER: {
    toolboxLine: {
      pIconName: 'trash',
      pValue: 'Supprimer',
      pActionName: 'toolbox-delete-action-click',
    },
    order: 4,
  },
  CAN_CREATE_FOLDER: {
    toolboxLine: {
      pIconName: 'folderPlus',
      pValue: 'Nouveau dossier',
      pActionName: 'toolbox-create-action-click',
    },
    order: 1,
  },
  CAN_RENAME_FOLDER: {
    toolboxLine: {
      pIconName: 'inputCursorText',
      pValue: 'Renommer dossier',
      pActionName: 'toolbox-rename-action-click',
    },
    order: 2,
  },
  CAN_DOWNLOAD_FOLDER: {
    toolboxLine: {
      pIconName: 'download',
      pValue: 'Télécharger',
      pActionName: 'toolbox-download-action-click',
    },
    order: 3,
  },
  CAN_MOVE_FOLDER: {
    toolboxLine: {
      pIconName: 'folderMove',
      pValue: 'Déplacer vers',
      pActionName: 'move-folder',
    },
    order: 4,
  },
}

export const documentsMappingRecord: Record<string, ToolboxLineWithOrder> = {
  CAN_RENAME_DOCUMENT: {
    toolboxLine: {
      pIconName: 'inputCursorText',
      pValue: 'Renommer',
      pActionName: 'rename-document',
    },
    order: 1,
  },
  CAN_TRANSMIT_DOCUMENT: {
    toolboxLine: {
      pIconName: 'rocket',
      pValue: 'Envoi immédiat',
      pActionName: 'transmit-document',
    },
    order: 2,
  },

  CAN_DOWNLOAD_DOCUMENT: {
    toolboxLine: {
      pIconName: 'download',
      pValue: 'Télécharger',
      pActionName: 'download-document',
    },
    order: 3,
  },
  CAN_MOVE_DOCUMENT: {
    toolboxLine: {
      pIconName: 'folderMove',
      pValue: 'Déplacer vers',
      pActionName: 'move-document',
    },
    order: 4,
  },
  CAN_GO_TO_DOCUMENT: {
    toolboxLine: {
      pIconName: 'arrowBarRight',
      pValue: 'Accéder au dossier',
      pActionName: 'go-to-document',
    },
    order: 5,
  },
  CAN_DELETE_DOCUMENT: {
    toolboxLine: {
      pIconName: 'trash',
      pValue: 'Supprimer',
      pActionName: 'delete-document',
    },
    order: 6,
  },
}

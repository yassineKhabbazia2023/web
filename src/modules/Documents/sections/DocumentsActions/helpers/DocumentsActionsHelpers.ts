import { ButtonAction } from '@/modules/common/Types/ButtonAction'

interface ActionBarButtonWithOrder {
  actionbarButton: ButtonAction
  order: number
}

const leftSideButtons: Record<string, ActionBarButtonWithOrder> = {
  CAN_ADD_DOCUMENT: {
    actionbarButton: {
      buttonName: 'Déposer un document',
      buttonType: 'primary',
      buttonIcon: 'PIUpload',
      buttonActionName: 'actionbar-add-document-action-click',
      plain: false,
      round: false,
      circle: false,
      loading: false,
      disabled: false,
      size: 'small',
      componentType: 'UPLOAD',
      multiple: true
    },
    order: 1
  },
  CAN_FILTER_FOLDER: {
    actionbarButton: {
      buttonName: 'Filtrer',
      buttonType: 'primary',
      buttonIcon: 'PIFunnel',
      buttonActionName: 'actionbar-filter-action-click',
      plain: true,
      round: false,
      circle: false,
      loading: false,
      disabled: false,
      size: 'small'
    },
    order: 2
  },
  CAN_SEARCH_DOCUMENT: {
    actionbarButton: {
      buttonName: '',
      buttonType: 'white',
      buttonIcon: 'PISearch',
      buttonActionName: 'actionbar-search-action-click',
      plain: false,
      round: false,
      circle: true,
      loading: false,
      disabled: false,
      size: 'small'
    },
    order: 3
  }
}

const rightSideButtons: Record<string, ActionBarButtonWithOrder> = {
  CAN_RENAME_DOCUMENT: {
    actionbarButton: {
      buttonName: 'Renommer',
      buttonType: 'white',
      buttonIcon: 'PIPencilSquare',
      buttonActionName: 'actionbar-rename-action-click',
      plain: true,
      round: false,
      circle: false,
      loading: false,
      disabled: false,
      size: 'small'
    },
    order: 1
  },
  CAN_TRANSMIT_DOCUMENT: {
    actionbarButton: {
      buttonName: 'Envoi immédiat',
      buttonType: 'white',
      buttonIcon: 'PIRocket',
      buttonActionName: 'actionbar-transmit-action-click',
      plain: true,
      round: false,
      circle: false,
      loading: false,
      disabled: false,
      size: 'small'
    },
    order: 2
  },
  CAN_MOVE_DOCUMENT: {
    actionbarButton: {
      buttonName: 'Déplacer',
      buttonType: 'white',
      buttonIcon: 'PIFolderMove',
      buttonActionName: 'actionbar-move-action-click',
      plain: true,
      round: false,
      circle: false,
      loading: false,
      disabled: false,
      size: 'small'
    },
    order: 4
  },
  CAN_DOWNLOAD_DOCUMENT: {
    actionbarButton: {
      buttonName: 'Télécharger',
      buttonType: 'white',
      buttonIcon: 'PIDownload',
      buttonActionName: 'actionbar-download-action-click',
      plain: false,
      round: false,
      circle: false,
      loading: false,
      disabled: false,
      size: 'small'
    },
    order: 3
  },
  CAN_DELETE_DOCUMENT: {
    actionbarButton: {
      buttonName: 'Supprimer',
      buttonType: 'white',
      buttonIcon: 'PITrash',
      buttonActionName: 'actionbar-delete-action-click',
      plain: false,
      round: false,
      circle: false,
      loading: false,
      disabled: false,
      size: 'small'
    },
    order: 5
  }
}

export function generateActionBarLeftSideButtons(permissions: string[]): ButtonAction[] {
  const toolboxBasicData: ActionBarButtonWithOrder[] = []
  for (const permission of permissions) {
    if (leftSideButtons[permission]) {
      toolboxBasicData.push(leftSideButtons[permission])
    }
  }
  toolboxBasicData.push(leftSideButtons.CAN_ADD_DOCUMENT)
  toolboxBasicData.push(leftSideButtons.CAN_FILTER_FOLDER)
  toolboxBasicData.push(leftSideButtons.CAN_SEARCH_DOCUMENT)

  return (toolboxBasicData
    .sort((a, b) => (a.order > b.order) ? 1 : -1)?.map(e => e?.actionbarButton))
}

export function generateActionBarRightSideButtons(
  permissions: string[],
  isAnyDocumentSelected: boolean
): ButtonAction[] {
  const toolboxBasicData: ActionBarButtonWithOrder[] = []
  for (const permission of permissions) {
    if (rightSideButtons[permission]) {
      toolboxBasicData.push(rightSideButtons[permission])
    }
  }
  if (isAnyDocumentSelected) {
    toolboxBasicData.push(rightSideButtons.CAN_DOWNLOAD_DOCUMENT)
  }
  return (toolboxBasicData
    .sort((a, b) => (a.order > b.order) ? 1 : -1)?.map(e => e?.actionbarButton))
}

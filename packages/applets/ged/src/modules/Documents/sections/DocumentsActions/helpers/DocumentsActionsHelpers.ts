import type { ComponentDefinitionProps } from '@pulse/styleguide/types'

interface ActionBarButtonWithOrder {
  actionbarButton: ComponentDefinitionProps
  order: number
}

export interface ActionBarLoadingButtonsState {
  permission: string
  isLoading: boolean
}

const leftSideButtons: Record<string, ActionBarButtonWithOrder> = {
  CAN_ADD_DOCUMENT: {
    actionbarButton: {
      pButtonName: 'Déposer un document',
      pButton: {
        pType: 'primary',
        pPlain: false,
        pRound: false,
        pCircle: false,
        pLoading: false,
        pDisabled: false,
        pSize: 'small',
      },
      pButtonIcon: 'PIUpload',
      pButtonActionName: 'actionbar-add-document-action-click',
      pComponentType: 'UPLOAD',
      pMultiple: true,
    },
    order: 1,
  },
  CAN_FILTER_FOLDER: {
    actionbarButton: {
      pButtonName: 'Filtrer',
      pButton: {
        pType: 'primary',
        pPlain: true,
        pRound: false,
        pCircle: false,
        pLoading: false,
        pDisabled: false,
        pSize: 'small',
      },
      pButtonIcon: 'PIFunnel',
      pButtonActionName: 'actionbar-filter-action-click',
    },
    order: 2,
  },
  CAN_SEARCH_DOCUMENT: {
    actionbarButton: {
      pButtonName: '',
      pButton: {
        pType: 'white',
        pPlain: false,
        pRound: false,
        pCircle: true,
        pLoading: false,
        pDisabled: false,
        pSize: 'small',
      },
      pButtonIcon: 'PISearch',
      pComponentType: 'SEARCH',
      pButtonActionName: 'actionbar-search-action-click',
      pIsSearchShrinkable: true,
    },
    order: 3,
  },
}

const rightSideButtons: Record<string, ActionBarButtonWithOrder> = {
  CAN_RENAME_DOCUMENT: {
    actionbarButton: {
      pButtonName: 'Renommer',
      pButton: {
        pType: 'white',
        pPlain: true,
        pRound: false,
        pCircle: false,
        pLoading: false,
        pDisabled: false,
        pSize: 'small',
      },
      pButtonIcon: 'PIPencilSquare',
      pButtonActionName: 'actionbar-rename-action-click',
    },
    order: 1,
  },
  CAN_TRANSMIT_DOCUMENT: {
    actionbarButton: {
      pButtonName: 'Envoi immédiat',
      pButton: {
        pType: 'white',
        pPlain: true,
        pRound: false,
        pCircle: false,
        pLoading: false,
        pDisabled: false,
        pSize: 'small',
      },
      pButtonIcon: 'PIRocket',
      pButtonActionName: 'actionbar-transmit-action-click',
    },
    order: 2,
  },
  CAN_MOVE_DOCUMENT: {
    actionbarButton: {
      pButtonName: 'Déplacer',
      pButton: {
        pType: 'white',
        pPlain: true,
        pRound: false,
        pCircle: false,
        pLoading: false,
        pDisabled: false,
        pSize: 'small',
      },
      pButtonIcon: 'PIFolderMove',
      pButtonActionName: 'actionbar-move-action-click',
    },
    order: 4,
  },
  CAN_DOWNLOAD_DOCUMENT: {
    actionbarButton: {
      pButtonName: 'Télécharger',
      pButton: {
        pType: 'white',
        pPlain: false,
        pRound: false,
        pCircle: false,
        pLoading: false,
        pDisabled: false,
        pSize: 'small',
      },
      pButtonIcon: 'PIDownload',
      pButtonActionName: 'actionbar-download-action-click',
    },
    order: 3,
  },
  CAN_DELETE_DOCUMENT: {
    actionbarButton: {
      pButtonName: 'Supprimer',
      pButton: {
        pType: 'white',
        pPlain: false,
        pRound: false,
        pCircle: false,
        pLoading: false,
        pDisabled: false,
        pSize: 'small',
      },
      pButtonIcon: 'PITrash',
      pButtonActionName: 'actionbar-delete-action-click',
    },
    order: 5,
  },
}

export function generateActionBarLeftSideButtons(
  permissions: string[],
  isSearchShrinkable: boolean,
  isSearchOpen: boolean,
  hasFiltersEnabled: boolean,
): ComponentDefinitionProps[] {
  const toolboxBasicData: ActionBarButtonWithOrder[] = []
  for (const permission of permissions) {
    if (leftSideButtons[permission]) {
      toolboxBasicData.push(leftSideButtons[permission])
    }
  }
  toolboxBasicData.push(leftSideButtons.CAN_ADD_DOCUMENT)

  if (hasFiltersEnabled) {
    leftSideButtons.CAN_FILTER_FOLDER.actionbarButton.pButtonName = 'Filtrer (1)'
  } else {
    leftSideButtons.CAN_FILTER_FOLDER.actionbarButton.pButtonName = 'Filtrer'
  }

  toolboxBasicData.push(leftSideButtons.CAN_FILTER_FOLDER)
  leftSideButtons.CAN_SEARCH_DOCUMENT.actionbarButton.pIsSearchShrinkable =
    isSearchShrinkable
  leftSideButtons.CAN_SEARCH_DOCUMENT.actionbarButton.pIsSearchOpen =
        isSearchOpen
  toolboxBasicData.push(leftSideButtons.CAN_SEARCH_DOCUMENT)

  return toolboxBasicData
    .sort((a, b) => (a.order > b.order ? 1 : -1))
    ?.map((e) => e?.actionbarButton)
}

export function generateActionBarRightSideButtons(
  permissions: string[],
  isAnyDocumentSelected: boolean,
  actionBarLoadingButtonsState?: ActionBarLoadingButtonsState,
): ComponentDefinitionProps[] {
  const toolboxBasicData: ActionBarButtonWithOrder[] = []
  for (const permission of permissions) {
    if (rightSideButtons[permission]) {
      if (actionBarLoadingButtonsState) {
        if (permission === actionBarLoadingButtonsState.permission) {
          rightSideButtons[permission].actionbarButton.pButton.pLoading =
            actionBarLoadingButtonsState.isLoading
        }
      }

      toolboxBasicData.push(rightSideButtons[permission])
    }
  }
  if (isAnyDocumentSelected) {
    toolboxBasicData.push(rightSideButtons.CAN_DOWNLOAD_DOCUMENT)
  }
  return toolboxBasicData
    .sort((a, b) => (a.order > b.order ? 1 : -1))
    ?.map((e) => e?.actionbarButton)
}

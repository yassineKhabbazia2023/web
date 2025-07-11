export function getData(pLoading: boolean) {
  return [
    {
      pButtonName: 'Télécharger',
      pButton: {
        pType: 'default',
        pCircle: false,
        pLoading: false,
        pDisabled: false,
        pSize: 'small',
      },
      pButtonIconName: 'download',
      pButtonActionName: 'actionbar-download-action-click',
    },
    {
      pButtonName: 'Déplacer',
      pButton: {
        pType: 'default',
        pCircle: false,
        pLoading,
        pDisabled: false,
        pSize: 'small',
      },
      pButtonIconName: 'folderMove',
      pButtonActionName: 'actionbar-move-action-click',
    },
  ]
}

export function getData2(pButtonName: string) {
  return [
    {
      pButtonName: 'Déposer un document',
      pButton: {
        pType: 'primary',
        pCircle: false,
        pLoading: false,
        pDisabled: false,
        pSize: 'small',
      },
      pButtonIconName: 'upload',
      pButtonActionName: 'actionbar-add-document-action-click',
      pComponentType: 'UPLOAD',
      pMultiple: true,
    },
    {
      pButtonName,
      pButton: {
        pType: 'default',
        pCircle: false,
        pLoading: false,
        pDisabled: false,
        pSize: 'small',
      },
      pButtonIconName: 'funnel',
      pButtonActionName: 'actionbar-filter-action-click',
    },
    {
      pButtonName: '',
      pButton: {
        pType: 'white',
        pCircle: true,
        pLoading: false,
        pDisabled: false,
        pSize: 'small',
      },
      pButtonIconName: 'search',
      pButtonActionName: 'actionbar-search-action-click',
      pComponentType: 'SEARCH',
      pIsSearchOpen: false,
      pIsSearchShrinkable: false,
    },
  ]
}

export function getLeftSideActionWithDisabledUpload() {
  return [
    {
      pButtonName: 'Déposer un document',
      pButton: {
        pType: 'primary',
        pCircle: false,
        pLoading: false,
        pDisabled: true,
        pSize: 'small',
      },
      pTooltipContent: "Le dépôt de documents est désactivé en raison du changement d'outil de production comptable vers Pennylane",
      pButtonIconName: 'upload',
      pButtonActionName: 'actionbar-add-document-action-click',
      pComponentType: 'UPLOAD',
      pMultiple: true,
    },
    {
      pButtonName: 'Filtrer',
      pButton: {
        pType: 'default',
        pCircle: false,
        pLoading: false,
        pDisabled: false,
        pSize: 'small',
      },
      pButtonIconName: 'funnel',
      pButtonActionName: 'actionbar-filter-action-click',
    },
    {
      pButtonName: '',
      pButton: {
        pType: 'white',
        pCircle: true,
        pLoading: false,
        pDisabled: false,
        pSize: 'small',
      },
      pButtonIconName: 'search',
      pButtonActionName: 'actionbar-search-action-click',
      pComponentType: 'SEARCH',
      pIsSearchOpen: false,
      pIsSearchShrinkable: false,
    },
  ]
}

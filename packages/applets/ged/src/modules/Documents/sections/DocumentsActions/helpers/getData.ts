export function getData(pLoading: boolean) {
  return [
    {
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
      pButtonIconName: 'download',
      pButtonActionName: 'actionbar-download-action-click',
    },
    {
      pButtonName: 'Déplacer',
      pButton: {
        pType: 'white',
        pPlain: true,
        pRound: false,
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
        pPlain: false,
        pRound: false,
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
        pType: 'primary',
        pPlain: true,
        pRound: false,
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
        pPlain: false,
        pRound: false,
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

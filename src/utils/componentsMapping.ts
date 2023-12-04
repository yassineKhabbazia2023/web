import { defineAsyncComponent } from 'vue'
// This is used to map back-end properties with real component
// Please order components keys by alphabetical order
const componentsMapping: Record<string, string> = {
  // icons
  accountingIcon: 'PICalculatorEuro',
  gsIcon: 'PIPersonVcard',
  inboxIcon: 'PIInbox',
  kpmgIcon: 'PIKpmg',
  trashIcon: 'PITrash',

  // components
  Text: 'PText',
  Tag: 'PTag',
  ActionGroup: 'PToolbox'
}

export const getMappedComponent = (componentKey: string): string => componentsMapping[componentKey]

export const getMappedComponentAsync = (componentKey: string) => {
  return defineAsyncComponent(() =>
    import('@kpmg/styleguide').then((res: any) => res[getMappedComponent(componentKey)])
  )
}

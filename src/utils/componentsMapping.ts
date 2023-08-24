// This is used to map back-end properties with real component
// Please order components keys by alphabetical order
const componentsMapping: Record<string, string> = {
  // icons
  accountingIcon: 'PICalculatorEuro',
  gsIcon: 'PIPersonVcard',
  inboxIcon: 'PIInbox',
  kpmgIcon: 'PIKpmg',
  trashIcon: 'PITrash'
}

export const getMappedComponent = (componentKey: string): string => componentsMapping[componentKey]

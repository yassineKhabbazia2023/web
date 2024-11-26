import { EntitiesStatistics } from '@entities/services/wallet/serviceWalletTypes'
import { FilterOption } from '@pulse/styleguide/types'
import { EntityStatus } from './FiltersTypes'

export function getFilters(
  filterLabels: Record<string, string>,
  entitiesStatistics?: EntitiesStatistics,
) {
  const filters: FilterOption<EntityStatus | undefined>[] = [
    {
      pContent: filterLabels['toDeploy'],
      pCode: EntityStatus.TO_DEPLOY,
      pValue: entitiesStatistics?.accountToDeploy,
      pColor: 'warning',
      pIcon: 'PIArrowUpCircle',
    },
    {
      pContent: filterLabels['inProgress'],
      pCode: EntityStatus.IN_PROGRESS,
      pValue: entitiesStatistics?.accountInProgress,
      pColor: 'amethyste',
      pIcon: 'PIArrowRepeat',
    },
    {
      pContent: filterLabels['connected'],
      pCode: EntityStatus.CONNECTED,
      pValue: entitiesStatistics?.accountConnected,
      pColor: 'success',
      pIcon: 'PICheckCircle',
    },
    {
      pContent: filterLabels['declared'],
      pCode: undefined,
      pValue: entitiesStatistics?.contactDeclared,
      pColor: 'gray-900',
      pIcon: 'PIPatchCheck',
      pDisabled: true,
    },
    {
      pContent: filterLabels['connected'],
      pCode: undefined,
      pValue: entitiesStatistics?.contactConnected,
      pColor: 'gray-900',
      pIcon: 'PIPower',
      pDisabled: true,
    },
    {
      pContent: filterLabels['guests'],
      pCode: undefined,
      pValue: entitiesStatistics?.contactInvited,
      pColor: 'gray-900',
      pIcon: 'PIPerson',
      pDisabled: true,
    },
  ]

  return filters
}

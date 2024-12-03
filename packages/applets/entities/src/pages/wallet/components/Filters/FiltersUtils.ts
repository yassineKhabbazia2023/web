import { EntitiesStatistics } from '@entities/services/wallet/serviceWalletTypes'
import { FilterOption } from '@pulse/styleguide/types'
import { EntityStatus } from './FiltersTypes'
import { ENTITY_STATUS_COLOR, ENTITY_STATUS_ICON_NAME } from '@entities/constants'

export function getOnboardingFilters(
  filterLabels: Record<string, string>,
  entitiesStatistics?: EntitiesStatistics,
) {
  const filters: FilterOption<EntityStatus | undefined>[] = [
    {
      pContent: filterLabels['toDeploy'],
      pCode: EntityStatus.TO_DEPLOY,
      pValue: entitiesStatistics?.accountToDeploy,
      pColor: ENTITY_STATUS_COLOR[EntityStatus.TO_DEPLOY],
      pIcon: ENTITY_STATUS_ICON_NAME[EntityStatus.TO_DEPLOY],
    },
    {
      pContent: filterLabels['inProgress'],
      pCode: EntityStatus.IN_PROGRESS,
      pValue: entitiesStatistics?.accountInProgress,
      pColor: ENTITY_STATUS_COLOR[EntityStatus.IN_PROGRESS],
      pIcon: ENTITY_STATUS_ICON_NAME[EntityStatus.IN_PROGRESS],
    },
    {
      pContent: filterLabels['connected'],
      pCode: EntityStatus.CONNECTED,
      pValue: entitiesStatistics?.accountConnected,
      pColor: ENTITY_STATUS_COLOR[EntityStatus.CONNECTED],
      pIcon: ENTITY_STATUS_ICON_NAME[EntityStatus.CONNECTED],
    },
  ]

  return filters
}

export function getUserConnexionFilters(
  filterLabels: Record<string, string>,
  entitiesStatistics?: EntitiesStatistics,
) {
  const filters: FilterOption<EntityStatus | undefined>[] = [
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

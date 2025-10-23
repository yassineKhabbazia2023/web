import { EntitiesStatistics } from '@entities/services/wallet/serviceWalletTypes'
import { FilterOption } from '@pulse/styleguide/types'
import { EntityStatus } from '@entities/modules/wallet/enums'
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
      pIconName: ENTITY_STATUS_ICON_NAME[EntityStatus.TO_DEPLOY],
    },
    {
      pContent: filterLabels['inProgress'],
      pCode: EntityStatus.IN_PROGRESS,
      pValue: entitiesStatistics?.accountInProgress,
      pColor: ENTITY_STATUS_COLOR[EntityStatus.IN_PROGRESS],
      pIconName: ENTITY_STATUS_ICON_NAME[EntityStatus.IN_PROGRESS],
    },
    {
      pContent: filterLabels['connected'],
      pCode: EntityStatus.CONNECTED,
      pValue: entitiesStatistics?.accountConnected,
      pColor: ENTITY_STATUS_COLOR[EntityStatus.CONNECTED],
      pIconName: ENTITY_STATUS_ICON_NAME[EntityStatus.CONNECTED],
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
      pColor: 'gray',
      pIconName: 'patchCheck',
      pDisabled: true,
    },
    {
      pContent: filterLabels['connected'],
      pCode: undefined,
      pValue: entitiesStatistics?.contactConnected,
      pColor: 'gray',
      pIconName: 'power',
      pDisabled: true,
    },
    {
      pContent: filterLabels['guests'],
      pCode: undefined,
      pValue: entitiesStatistics?.contactInvited,
      pColor: 'gray',
      pIconName: 'person',
      pDisabled: true,
    },
  ]

  return filters
}

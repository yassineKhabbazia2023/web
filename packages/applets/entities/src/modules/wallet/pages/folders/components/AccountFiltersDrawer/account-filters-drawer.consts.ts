import { MISSION_TYPE } from '@entities/constants'
import { EntityStatus } from '@entities/modules/wallet/enums'
import { LastActivityPeriodInDays } from '@entities/enums'
import type { FilterGroupConfig, LastActivityPeriodOptionConfig } from './account-filters-drawer.types'

export const ACCOUNT_FILTERS_I18N_KEY = 'entities.wallet.accountFilters'

export const MULTI_SELECT_FILTER_GROUPS: FilterGroupConfig[] = [
  {
    labelKey: 'missionType',
    field: 'missionTypeFilter',
    options: [
      { value: MISSION_TYPE.TENUE, labelKey: 'tenue' },
      { value: MISSION_TYPE.REVISION, labelKey: 'revision' },
      { value: MISSION_TYPE.NOT_SPECIFIED, labelKey: 'notSpecified' },
    ],
  },
  {
    labelKey: 'status',
    field: 'deploymentStatusFilter',
    options: [
      { value: EntityStatus.TO_DEPLOY.toString(), labelKey: 'toDeploy' },
      { value: EntityStatus.IN_PROGRESS.toString(), labelKey: 'inProgress' },
      { value: EntityStatus.CONNECTED.toString(), labelKey: 'connected' },
    ],
  },
]

export const LAST_ACTIVITY_PERIOD_OPTIONS: LastActivityPeriodOptionConfig[] = [
  { value: LastActivityPeriodInDays.LAST_TWO_WEEKS, labelKey: 'lastTwoWeeks' },
  { value: LastActivityPeriodInDays.LAST_THIRTY_DAYS, labelKey: 'lastThirtyDays' },
  { value: LastActivityPeriodInDays.LAST_NINETY_DAYS, labelKey: 'lastNinetyDays' },
]

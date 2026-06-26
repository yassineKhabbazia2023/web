import { MISSION_TYPE } from '@entities/constants'
import { EntityStatus } from '@entities/modules/wallet/enums'
import type { FilterGroupConfig } from './account-filters-drawer.types'

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

import { EntityStatus } from '@entities/modules/wallet/enums'

export const STATUS_TRACKING_LABELS: Record<EntityStatus, string> = {
  [EntityStatus.TO_DEPLOY]: 'A déployer',
  [EntityStatus.IN_PROGRESS]: 'En cours',
  [EntityStatus.CONNECTED]: 'Connectés',
}

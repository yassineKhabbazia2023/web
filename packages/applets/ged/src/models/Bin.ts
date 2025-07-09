import type { Service } from '@ged/models/Service'

export interface Bin {
  id: Service['ServiceId']
  name: Service['ServiceName']
  iconName?: string
  isRootFolder?: boolean
  children: Bin[]
}

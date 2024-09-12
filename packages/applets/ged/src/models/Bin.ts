import type { Service } from '@/models/Service'

export interface Bin {
  id: Service['ServiceId']
  name: Service['ServiceName']
  iconName?: string | undefined
  isRootFolder?: boolean
  children: Bin[]
}

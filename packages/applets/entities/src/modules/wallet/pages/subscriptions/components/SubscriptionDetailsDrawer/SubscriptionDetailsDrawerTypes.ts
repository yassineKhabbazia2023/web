import { SubscriptionDetailsContext } from '@entities/modules/wallet/enums'

export type SubscriptionDetailsDrawerProps = {
  modelValue: boolean
  selectedSubscriptionId: number
  pageContext?: SubscriptionDetailsContext
}

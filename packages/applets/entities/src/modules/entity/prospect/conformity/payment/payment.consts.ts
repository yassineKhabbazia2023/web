import type { PaymentBenefit } from './payment.types'

export const PAYMENT_I18N_BASE = 'entities.prospect.conformity.payment'

// Selling points displayed when the SEPA mandate still has to be configured (client view).
export const PAYMENT_BENEFITS: readonly PaymentBenefit[] = [
  { iconName: 'arrowRepeat', labelKey: 'benefits.automatic.label', textKey: 'benefits.automatic.text' },
  { iconName: 'shieldLock', labelKey: 'benefits.secure.label', textKey: 'benefits.secure.text' },
  { iconName: 'clockHistory', labelKey: 'benefits.reliable.label', textKey: 'benefits.reliable.text' },
]

// Reassurance bullet points displayed once the mandate has been submitted (client view).
export const PAYMENT_COMPLETED_BULLET_KEYS: readonly string[] = [
  'completedBullets.automatic',
  'completedBullets.secure',
  'completedBullets.traceable',
]

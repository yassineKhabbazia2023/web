import { authHandlers } from './auth.handlers'
import { bookingHandlers } from './booking.handlers'
import { cguHandlers } from './cgu.handlers'
import { entitiesHandlers } from './entities.handlers'
import { feedCenterHandlers } from './feed-center.handlers'
import { gedHandlers } from './ged.handlers'
import { invoicesHandlers } from './invoices.handlers'
import { mandateHandlers } from './mandate.handlers'
import { offersCatalogHandlers } from './offers-catalog.handlers'
import { pennylaneHandlers } from './pennylane.handlers'
import { powerbiHandlers } from './powerbi.handlers'

export const handlers = [
  ...authHandlers,
  ...bookingHandlers,
  ...cguHandlers,
  ...entitiesHandlers,
  ...feedCenterHandlers,
  ...gedHandlers,
  ...invoicesHandlers,
  ...mandateHandlers,
  ...offersCatalogHandlers,
  ...pennylaneHandlers,
  ...powerbiHandlers,
]


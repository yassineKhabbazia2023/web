import { cguHandlers } from './cgu.handlers'
import { entitiesHandlers } from './entities.handlers'
import { feedCenterHandlers } from './feed-center.handlers'
import { gedHandlers } from './ged.handlers'
import { mandateHandlers } from './mandate.handlers'
import { offersCatalogHandlers } from './offers-catalog.handlers'
import { pennylaneHandlers } from './pennylane.handlers'
import { powerbiHandlers } from './powerbi.handlers'

export const handlers = [
  ...cguHandlers,
  ...entitiesHandlers,
  ...feedCenterHandlers,
  ...gedHandlers,
  ...mandateHandlers,
  ...offersCatalogHandlers,
  ...pennylaneHandlers,
  ...powerbiHandlers,
]

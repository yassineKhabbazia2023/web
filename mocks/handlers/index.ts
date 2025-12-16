import { cguHandlers } from './cgu.handlers'
import { entitiesHandlers } from './entities.handlers'
import { feedCenterHandlers } from './feed-center.handlers'
import { mandateHandlers } from './mandate.handlers'
import { pennylaneHandlers } from './pennylane.handlers'
import { powerbiHandlers } from './powerbi.handlers'

export const handlers = [
  ...cguHandlers,
  ...entitiesHandlers,
  ...feedCenterHandlers,
  ...mandateHandlers,
  ...pennylaneHandlers,
  ...powerbiHandlers,
]

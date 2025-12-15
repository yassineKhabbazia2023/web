import { cguHandlers } from './cgu.handlers'
import { mandateHandlers } from './mandate.handlers'
import { pennylaneHandlers } from './pennylane.handlers'
import { powerbiHandlers } from './powerbi.handlers'

export const handlers = [
  ...cguHandlers,
  ...mandateHandlers,
  ...pennylaneHandlers,
  ...powerbiHandlers,
]

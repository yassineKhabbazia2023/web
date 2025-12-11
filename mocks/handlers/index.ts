import { cguHandlers } from './cgu.handlers'
import { pennylaneHandlers } from './pennylane.handlers'
import { powerbiHandlers } from './powerbi.handlers'

export const handlers = [
  ...cguHandlers,
  ...pennylaneHandlers,
  ...powerbiHandlers,
]

import { cguHandlers } from './cgu.handlers'
import { pennylaneHandlers } from './pennylane.handlers'

export const handlers = [
  ...cguHandlers,
  ...pennylaneHandlers,
]

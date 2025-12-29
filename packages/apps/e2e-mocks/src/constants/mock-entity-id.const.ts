/**
 * Mock entity IDs for E2E testing
 * These IDs correspond to the entities defined in entities.handlers.ts
 */
export const MockEntityId = {
  /** Acme Corp (basic) - Basic entity with standard permissions */
  BASIC: 1,
  /** Tech Solutions Ltd (legacy) - Entity with legacy GED */
  LEGACY_GED: 2,
  /** Global Services Inc (Pennylane) - Entity with Pennylane subscription and permissions */
  PENNYLANE: 3,
} as const

export type MockEntityId = (typeof MockEntityId)[keyof typeof MockEntityId]

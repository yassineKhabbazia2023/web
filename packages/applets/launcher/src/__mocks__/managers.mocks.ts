import type { Mock } from 'vitest'
import { envVarsMock } from '@pulse/common/mocks'
import { CurrentUserManagerMock, isPennylaneAmendmentFlowActivatedMock } from '@pulse/common/mocks/vitest'

// Module-shaped mock for '@pulse/common/managers', registered by
// vitest.setup.ts: uniform for the whole worker (the managers own specs live
// in the common project, never in this one). Extend it if the launcher starts
// consuming another manager.
export const CurrentUserManager = CurrentUserManagerMock

// The explicit annotations keep the declaration emit portable (vue-tsc
// TS2742: the inferred Mock types reference @vitest/spy internals).
// Creation-time implementations are the perpetual defaults: the global
// mockReset restores them before every test (doctrine: guardrails), specs override
// per test via vi.mocked(...).
export const FeatureFlagManager: { isPennylaneAmendmentFlowActivated: Mock } = {
  isPennylaneAmendmentFlowActivated: isPennylaneAmendmentFlowActivatedMock,
}

export const PennylaneSsoManager: { getUrl: Mock, setSsoOrigin: Mock } = {
  getUrl: vi.fn((isCollab: boolean) =>
    isCollab ? envVarsMock.VITE_PENNYLANE_COLLAB_SSO_URL : envVarsMock.VITE_PENNYLANE_SSO_URL,
  ),
  setSsoOrigin: vi.fn(),
}

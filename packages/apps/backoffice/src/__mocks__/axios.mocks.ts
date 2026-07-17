import type { Mock } from 'vitest'
import { axiosMock } from '@pulse/common/mocks/vitest'

// Module-shaped mock for 'axios', registered by vitest.setup.ts: the azure
// devops services call axios.get/post directly. Specs reach these spies via
// vi.mocked(axios.get) / vi.mocked(axios.post), so no export is needed here.
// The explicit Mock annotations keep the default export's inferred type
// portable (TS2883: vi.fn()'s type otherwise references @vitest/spy internals).
const axiosGetMock: Mock = vi.fn()
const axiosPostMock: Mock = vi.fn()

const axiosDefault = {
  ...axiosMock,
  get: axiosGetMock,
  post: axiosPostMock,
}

export default axiosDefault

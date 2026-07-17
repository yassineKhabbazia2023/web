import type { Mock } from 'vitest'
import { axiosMock } from '@pulse/common/mocks/vitest'

// Module-shaped mock for 'axios', registered by vitest.setup.ts: the RSS news
// service calls axios.get directly. Specs reach the spy via vi.mocked(axios.get),
// so no export is needed here. The explicit Mock annotation keeps the default
// export's inferred type portable (TS2883: vi.fn()'s type otherwise references
// @vitest/spy internals).
const axiosGetMock: Mock = vi.fn()

const axiosDefault = {
  ...axiosMock,
  get: axiosGetMock,
}

export default axiosDefault

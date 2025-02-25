import { getMockedOperations } from './operations.mocks'

export const contactServiceMock = {
  fetchAccountOperations: vi.fn(() => Promise.resolve(() => getMockedOperations())),
}
import type { Mock } from 'vitest'

export const mockedNotification: { close: Mock } = {
  close: vi.fn(),
}

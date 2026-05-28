import type { Mock } from 'vitest'

export const PNotificationMocked: Mock = vi.fn(() => ({ close: vi.fn() }))

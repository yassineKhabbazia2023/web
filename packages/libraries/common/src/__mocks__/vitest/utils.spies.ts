import type { Mock } from 'vitest'

export const logoutCollaboratorMock: Mock = vi.fn()
export const logoutGigyaSSOMock: Mock = vi.fn()
export const logoutUserMock: Mock = vi.fn()

export const utilsMock = {
  logoutCollaborator: logoutCollaboratorMock,
  logoutGigyaSSO: logoutGigyaSSOMock,
  logoutUser: logoutUserMock,
}

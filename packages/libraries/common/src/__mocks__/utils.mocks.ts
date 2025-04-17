export const logoutCollaboratorMock = vi.fn()
export const logoutGigyaSSOMock = vi.fn()
export const logoutClientMock = vi.fn()

export const utilsMock = {
  logoutCollaborator: logoutCollaboratorMock,
  logoutGigyaSSO: logoutGigyaSSOMock,
  logoutClient: logoutClientMock,
}
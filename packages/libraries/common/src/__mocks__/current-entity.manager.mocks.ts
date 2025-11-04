export const initializeCurrentEntityMock = vi.fn()
export const clearCurrentEntityMock = vi.fn()

export const CurrentEntityManagerMock = {
  initializeCurrentEntity: initializeCurrentEntityMock,
  clearCurrentEntity: clearCurrentEntityMock,
}

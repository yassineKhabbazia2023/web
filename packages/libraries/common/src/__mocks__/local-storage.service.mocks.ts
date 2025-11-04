export const setTokenMock = vi.fn()
export const getTokenMock = vi.fn()
export const removeTokenMock = vi.fn()
export const setLastVisitedEntityIdMock = vi.fn()
export const getLastVisitedEntityIdMock = vi.fn()
export const removeLastVisitedEntityIdMock = vi.fn()

export const localStorageServiceMock = {
  setToken: setTokenMock,
  getToken: getTokenMock,
  removeToken: removeTokenMock,
  setLastVisitedEntityId: setLastVisitedEntityIdMock,
  getLastVisitedEntityId: getLastVisitedEntityIdMock,
  removeLastVisitedEntityId: removeLastVisitedEntityIdMock,
}

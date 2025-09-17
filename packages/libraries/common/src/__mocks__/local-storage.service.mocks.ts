export const setTokenMock = vi.fn()
export const getTokenMock = vi.fn()
export const removeTokenMock = vi.fn()
export const setSelectedEntityIdMock = vi.fn()
export const getSelectedEntityIdMock = vi.fn()
export const removeSelectedEntityIdMock = vi.fn()

export const localStorageServiceMock = {
  setToken: setTokenMock,
  getToken: getTokenMock,
  removeToken: removeTokenMock,
  setSelectedEntityId: setSelectedEntityIdMock,
  getSelectedEntityId: getSelectedEntityIdMock,
  removeSelectedEntityId: removeSelectedEntityIdMock,
}

export const persistSelectedEntityMock = vi.fn()
export const getSelectedEntityMock = vi.fn()
export const clearSelectedEntityMock = vi.fn()

export const SelectedEntityManagerMock = {
  persistSelectedEntity: persistSelectedEntityMock,
  getSelectedEntity: getSelectedEntityMock,
  clearSelectedEntity: clearSelectedEntityMock,
}

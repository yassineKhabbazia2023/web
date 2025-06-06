export const initializeSelectedEntityMock = vi.fn()
export const clearSelectedEntityMock = vi.fn()

export const SelectedEntityManagerMock = {
  initializeSelectedEntity: initializeSelectedEntityMock,
  clearSelectedEntity: clearSelectedEntityMock,
}

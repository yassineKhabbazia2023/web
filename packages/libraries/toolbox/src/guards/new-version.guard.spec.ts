import { NewVersionManager } from '../managers/new-version.manager'
import { newVersionReloadGuard } from './new-version.guard'

describe('newVersionReloadGuard', () => {
  const assignSpy = vi.fn()

  beforeEach(() => {
    vi.stubGlobal('window', { location: { assign: assignSpy } })
    vi.spyOn(NewVersionManager, 'checkForNewVersion').mockResolvedValue()
    vi.spyOn(NewVersionManager, 'consumeReload').mockReturnValue(false)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
    assignSpy.mockReset()
  })

  it('should ignore query-only navigations', () => {
    vi.mocked(NewVersionManager.consumeReload).mockReturnValue(true)

    const result = newVersionReloadGuard({ path: '/entities', fullPath: '/entities?sort=name' }, { path: '/entities' })

    expect(result).toBeUndefined()
    expect(NewVersionManager.checkForNewVersion).not.toHaveBeenCalled()
    expect(assignSpy).not.toHaveBeenCalled()
  })

  it('should check for a new version on page-to-page navigations', () => {
    newVersionReloadGuard({ path: '/target', fullPath: '/target' }, { path: '/source' })

    expect(NewVersionManager.checkForNewVersion).toHaveBeenCalledTimes(1)
  })

  it('should let the navigation continue when no new version is available', () => {
    const result = newVersionReloadGuard({ path: '/target', fullPath: '/target?tab=1' }, { path: '/source' })

    expect(result).toBeUndefined()
    expect(assignSpy).not.toHaveBeenCalled()
  })

  it('should cancel the navigation and fully load the target page when a new version is available', () => {
    vi.mocked(NewVersionManager.consumeReload).mockReturnValue(true)

    const result = newVersionReloadGuard({ path: '/target', fullPath: '/target?tab=1' }, { path: '/source' })

    expect(result).toBe(false)
    expect(assignSpy).toHaveBeenCalledWith(`${import.meta.env.BASE_URL}target?tab=1`)
  })
})

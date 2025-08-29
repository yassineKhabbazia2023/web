import { APP_ROUTES } from '@pulse/common/constants'
import { PennylanePermissionsManager } from '@pulse/common/managers'
import { routes } from './pennylane.router'

vi.mock('@pulse/common/managers')
const hasPennylaneAccountingPermissionSpy = vi.mocked(PennylanePermissionsManager.hasPennylaneAccountingPermission)

const nextSpy = vi.fn()
const firstRoute = routes[0] as any

describe('Router', () => {
  describe('beforEnter', () => {
    it('should call next() when access to pennylane accouting page', () => {
      hasPennylaneAccountingPermissionSpy.mockReturnValueOnce(true)

      firstRoute?.beforeEnter({} as any, {} as any, nextSpy)

      expect(nextSpy).toHaveBeenCalledOnce()
      expect(nextSpy).toHaveBeenCalledWith(/* no args */)
    })
  })

  it('should call next() when NO access to pennylane accouting page', () => {
    hasPennylaneAccountingPermissionSpy.mockReturnValueOnce(false)
    const expectedRedirectionRoute = {
      name: APP_ROUTES.error.error404.name,
    }

    firstRoute?.beforeEnter({} as any, {} as any, nextSpy)

    expect(nextSpy).toHaveBeenCalledOnce()
    expect(nextSpy).toHaveBeenCalledWith(expectedRedirectionRoute)
  })
})

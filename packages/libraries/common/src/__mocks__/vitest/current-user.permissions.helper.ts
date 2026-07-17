import type { MockInstance } from 'vitest'
// eslint-disable-next-line @typescript-eslint/no-restricted-imports -- doctrine mock-barrel: safe here, this module is deliberately NOT re-exported by the barrel (see note below)
import { CurrentUserManager } from '../../managers'

// Arms CurrentUserManager.hasPermission (a static arrow property, doctrine:
// contested-modules) with a constant verdict and returns the spy, so specs assert on it and
// override the verdict per test. Call it in a beforeEach: the spy is restored
// to the real method before every test by the global mock hygiene.
//
// Not re-exported by the mocks barrel on purpose: the barrel is loaded from
// inside vi.mock factories, where a module-scope import of the real managers
// graph could deadlock a pending factory (doctrine: mock-barrel). Import this helper directly
// from '@pulse/common/mocks/vitest/current-user.permissions.helper'.
export function armCurrentUserPermissions(hasPermission = true): MockInstance {
  return vi.spyOn(CurrentUserManager, 'hasPermission').mockReturnValue(hasPermission)
}

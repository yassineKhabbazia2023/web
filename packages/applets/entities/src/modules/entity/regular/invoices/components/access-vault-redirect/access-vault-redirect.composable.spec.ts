import { useRouter } from 'vue-router'
import type { Router } from 'vue-router'
import { getStoreMock } from '@pulse/common/mocks/vitest'
import { useCurrentEntityStore } from '@pulse/common/stores'
import { RouteName, RouteParam } from '@pulse/common/enums'
import { InvoicesTracking } from '../../services/invoices.tracking.service'
import { useAccessVaultRedirect } from './access-vault-redirect.composable'

const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)

describe('useAccessVaultRedirect', () => {
  const pushMock = vi.fn()

  beforeEach(() => {
    vi.spyOn(InvoicesTracking, 'trackAccessNewInvoicesExperienceClick').mockImplementation(() => undefined)
    vi.mocked(useRouter).mockReturnValue({ push: pushMock } as unknown as Router)
    currentEntityStoreMock.currentEntityId = 42
  })

  describe('handleAccessInvoicesClick', () => {
    it('should track the click and navigate to the seres invoices page of the current entity', () => {
      const { handleAccessInvoicesClick } = useAccessVaultRedirect()

      handleAccessInvoicesClick()

      expect(vi.mocked(InvoicesTracking.trackAccessNewInvoicesExperienceClick)).toHaveBeenCalledOnce()
      expect(pushMock).toHaveBeenCalledWith({
        name: RouteName.SERES_INVOICES,
        params: { [RouteParam.ENTITY_ID]: 42 },
      })
    })
  })
})

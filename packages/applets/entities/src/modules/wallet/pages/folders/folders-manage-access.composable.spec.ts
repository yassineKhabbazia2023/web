import { flushPromises } from '@vue/test-utils'
import { withSetup } from '@pulse/toolbox/utils/test'
import { CurrentUserManager } from '@pulse/common/managers'
import { ACTION_PERMISSIONS } from '@pulse/common/constants'
import { AmplitudeServiceMock } from '@pulse/common/mocks/vitest'
import { getPaginationMock } from '@pulse/common/mocks'
import type { AccountOperations } from '@entities/services/registry'
import { fetchAccountOperationsMock } from '@entities/__mocks__/vitest'
import { useFoldersManageAccess } from './folders-manage-access.composable'
import { MANAGE_ACCESS_COUNT_PAGE, MANAGE_ACCESS_COUNT_PAGE_SIZE } from './folders.consts'

const armManageAccessCount = (totalItems: number | undefined) => {
  fetchAccountOperationsMock.mockResolvedValue(
    getPaginationMock<AccountOperations>({ totalItems }),
  )
}

describe('useFoldersManageAccess', () => {
  beforeEach(() => {
    vi.spyOn(CurrentUserManager, 'hasPermission').mockReturnValue(true)
    armManageAccessCount(3)
  })

  it('loads the count on mount when the user has the permission', async () => {
    const [{ hasManageAccess, manageAccessCount }, app] = withSetup(() => useFoldersManageAccess())
    await flushPromises()

    expect(hasManageAccess.value).toBe(true)
    expect(vi.mocked(CurrentUserManager.hasPermission)).toHaveBeenCalledWith(ACTION_PERMISSIONS.MANAGE_ACCESS)
    expect(fetchAccountOperationsMock).toHaveBeenCalledExactlyOnceWith(
      MANAGE_ACCESS_COUNT_PAGE,
      MANAGE_ACCESS_COUNT_PAGE_SIZE,
    )
    expect(manageAccessCount.value).toBe(3)

    app.unmount()
  })

  it('does not load the count when the user lacks the permission', async () => {
    vi.spyOn(CurrentUserManager, 'hasPermission').mockReturnValue(false)

    const [{ manageAccessCount }, app] = withSetup(() => useFoldersManageAccess())
    await flushPromises()

    expect(fetchAccountOperationsMock).not.toHaveBeenCalled()
    expect(manageAccessCount.value).toBeUndefined()

    app.unmount()
  })

  it.each([
    { totalItems: undefined, expectedDisabled: true },
    { totalItems: 0, expectedDisabled: true },
    { totalItems: 1, expectedDisabled: false },
  ])('disables the button ($expectedDisabled) when the count is $totalItems', async ({
    totalItems,
    expectedDisabled,
  }) => {
    armManageAccessCount(totalItems)

    const [{ isManageAccessButtonDisabled }, app] = withSetup(() => useFoldersManageAccess())
    await flushPromises()

    expect(isManageAccessButtonDisabled.value).toBe(expectedDisabled)

    app.unmount()
  })

  it('opens the drawer and tracks the click when there is something to validate', async () => {
    const [{ isManageAccessDrawerOpened, onManageAccessButtonClick }, app] =
      withSetup(() => useFoldersManageAccess())
    await flushPromises()

    onManageAccessButtonClick()

    expect(isManageAccessDrawerOpened.value).toBe(true)
    expect(AmplitudeServiceMock.track).toHaveBeenCalledExactlyOnceWith(
      'Registry Validation Initiated',
      { registry_validation_initialisation_localisation: 'portefeuille' },
    )

    app.unmount()
  })

  it('does not open the drawer when there is nothing to validate', async () => {
    armManageAccessCount(0)

    const [{ isManageAccessDrawerOpened, onManageAccessButtonClick }, app] =
      withSetup(() => useFoldersManageAccess())
    await flushPromises()

    onManageAccessButtonClick()

    expect(isManageAccessDrawerOpened.value).toBe(false)
    expect(AmplitudeServiceMock.track).not.toHaveBeenCalled()

    app.unmount()
  })

  it('refreshes the count only when the drawer gets closed', async () => {
    const [{ onUpdateManageAccessDrawerOpened }, app] = withSetup(() => useFoldersManageAccess())
    await flushPromises()

    await onUpdateManageAccessDrawerOpened(true)
    expect(fetchAccountOperationsMock).toHaveBeenCalledOnce()

    await onUpdateManageAccessDrawerOpened(false)
    expect(fetchAccountOperationsMock).toHaveBeenCalledTimes(2)

    app.unmount()
  })
})

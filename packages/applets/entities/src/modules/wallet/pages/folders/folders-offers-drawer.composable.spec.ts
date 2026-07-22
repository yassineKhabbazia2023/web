import { withSetup } from '@pulse/toolbox/utils/test'
import { useFoldersOffersDrawer } from './folders-offers-drawer.composable'

describe('useFoldersOffersDrawer', () => {
  it('starts without any drawer nor selected account', () => {
    const [{ hasOffersDrawer, openOffersDrawer, selectedAccountId }, app] =
      withSetup(() => useFoldersOffersDrawer(vi.fn()))

    expect(hasOffersDrawer.value).toBe(false)
    expect(openOffersDrawer.value).toBe(false)
    expect(selectedAccountId.value).toBeUndefined()

    app.unmount()
  })

  it('opens the drawer for the deployed account', async () => {
    const [{
      hasOffersDrawer,
      openOffersDrawer,
      selectedAccountId,
      selectedAccountNumber,
      selectedCompanyName,
      onClickDeploy,
    }, app] = withSetup(() => useFoldersOffersDrawer(vi.fn()))

    await onClickDeploy(1, '0001', 'Acme')

    expect(hasOffersDrawer.value).toBe(true)
    expect(selectedAccountId.value).toBe(1)
    expect(selectedAccountNumber.value).toBe('0001')
    expect(selectedCompanyName.value).toBe('Acme')
    expect(openOffersDrawer.value).toBe(true)

    app.unmount()
  })

  it('refreshes the accounts and closes the drawer once an offer is saved', async () => {
    const refreshAccountList = vi.fn().mockResolvedValue(undefined)
    const [{ onClickDeploy, onOfferSaved, openOffersDrawer }, app] =
      withSetup(() => useFoldersOffersDrawer(refreshAccountList))

    await onClickDeploy(1, '0001', 'Acme')
    await onOfferSaved()

    expect(refreshAccountList).toHaveBeenCalledOnce()
    expect(openOffersDrawer.value).toBe(false)

    app.unmount()
  })
})

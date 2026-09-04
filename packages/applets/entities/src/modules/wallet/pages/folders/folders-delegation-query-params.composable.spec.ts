import { nextTick, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { RouteLocationNormalizedLoaded, Router } from 'vue-router'
import { withSetup } from '@pulse/toolbox/utils/test'
import { useFoldersDelegationQueryParams } from './folders-delegation-query-params.composable'
import { DELEGATION_QUERY_PARAM_DRAWER } from '@entities/constants'

const routerReplaceMock = vi.fn()

const routeMock = reactive({
  query: {} as Record<string, string | string[] | undefined>,
})

const mountComposable = (isDelegationDrawerOpened = ref(false), openDelegationDrawer = vi.fn()) =>
  withSetup(() => {
    useFoldersDelegationQueryParams(isDelegationDrawerOpened, openDelegationDrawer)
    return { isDelegationDrawerOpened, openDelegationDrawer }
  })

describe('useFoldersDelegationQueryParams', () => {
  beforeEach(() => {
    routeMock.query = {}
    routerReplaceMock.mockClear()
    vi.mocked(useRouter).mockReturnValue({ replace: routerReplaceMock } as unknown as Router)
    vi.mocked(useRoute).mockImplementation(() => routeMock as unknown as RouteLocationNormalizedLoaded)
  })

  it('opens the drawer when the delegationDrawer query param is "true"', () => {
    routeMock.query = { [DELEGATION_QUERY_PARAM_DRAWER]: 'true' }
    const openDelegationDrawer = vi.fn()

    mountComposable(ref(false), openDelegationDrawer)

    expect(openDelegationDrawer).toHaveBeenCalledOnce()
  })

  it('does not open the drawer when the query param is missing', () => {
    routeMock.query = {}
    const openDelegationDrawer = vi.fn()

    mountComposable(ref(false), openDelegationDrawer)

    expect(openDelegationDrawer).not.toHaveBeenCalled()
  })

  it('does not open the drawer when the query param is not "true"', () => {
    routeMock.query = { [DELEGATION_QUERY_PARAM_DRAWER]: 'false' }
    const openDelegationDrawer = vi.fn()

    mountComposable(ref(false), openDelegationDrawer)

    expect(openDelegationDrawer).not.toHaveBeenCalled()
  })

  it('opens the drawer when the query param becomes "true" while already mounted', async () => {
    routeMock.query = {}
    const openDelegationDrawer = vi.fn()

    mountComposable(ref(false), openDelegationDrawer)
    routeMock.query = { [DELEGATION_QUERY_PARAM_DRAWER]: 'true' }
    await nextTick()

    expect(openDelegationDrawer).toHaveBeenCalledOnce()
  })

  it('does not reopen the drawer when it is already open', () => {
    routeMock.query = { [DELEGATION_QUERY_PARAM_DRAWER]: 'true' }
    const openDelegationDrawer = vi.fn()

    mountComposable(ref(true), openDelegationDrawer)

    expect(openDelegationDrawer).not.toHaveBeenCalled()
  })

  it('clears the query param when the drawer closes after being opened via the URL', async () => {
    routeMock.query = { [DELEGATION_QUERY_PARAM_DRAWER]: 'true', otherParam: 'value' }
    const isDelegationDrawerOpened = ref(true)

    mountComposable(isDelegationDrawerOpened)
    isDelegationDrawerOpened.value = false
    await nextTick()

    expect(routerReplaceMock).toHaveBeenCalledExactlyOnceWith({ query: { otherParam: 'value' } })
  })

  it('does not call router.replace when the drawer closes without a delegation query param', async () => {
    routeMock.query = { otherParam: 'value' }
    const isDelegationDrawerOpened = ref(true)

    mountComposable(isDelegationDrawerOpened)
    isDelegationDrawerOpened.value = false
    await nextTick()

    expect(routerReplaceMock).not.toHaveBeenCalled()
  })

  it('does not call router.replace when the drawer opens', async () => {
    routeMock.query = {}
    const isDelegationDrawerOpened = ref(false)

    mountComposable(isDelegationDrawerOpened)
    isDelegationDrawerOpened.value = true
    await nextTick()

    expect(routerReplaceMock).not.toHaveBeenCalled()
  })
})

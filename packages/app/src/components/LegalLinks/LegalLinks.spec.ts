import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import { useRoute } from 'vue-router'
import { LoginRouteName } from '@pulse/common/constants'
import { getStoreMock } from '@pulse/common/mocks'
import { useUserStore } from '@pulse/common/stores'

import LegalLinks from '.'

const mockedUseRoute = useRoute as Mock

vi.mock('vue-router')

const userStoreMock = getStoreMock(useUserStore)

const createWrapper = (): VueWrapper<any> => mount(LegalLinks)

describe('legalLinks', () => {
  let wrapper: VueWrapper<any>

  beforeEach(async () => {
    mockedUseRoute.mockReturnValue({
      name: LoginRouteName.LOGIN_COLLAB,
    })
    wrapper = createWrapper()
    await flushPromises()
  })

  it('has links in the footer', () => {
    expect(wrapper.find('.legal-links').exists()).toBeTruthy()
  })
  it('should display the CGU link user is a client or if the page is login-client', async () => {
    userStoreMock.isCollab = false

    mockedUseRoute.mockReturnValue({
      name: 'login-client',
    })

    wrapper = createWrapper()
    await flushPromises()
    const linkCGU = wrapper.find('[data-testid=legal-links-cgu]')
    expect(linkCGU.exists()).toBeTruthy()
  })
  it('should not display the CGU link user is a client or if the page is login-client', async () => {
    userStoreMock.isCollab = true
    mockedUseRoute.mockReturnValue({
      name: LoginRouteName.LOGIN_COLLAB,
    })

    wrapper = createWrapper()
    await flushPromises()

    const linkCGU = wrapper.find('[data-testid=legal-links-cgu]')
    expect(linkCGU.exists()).toBeFalsy()
  })
})

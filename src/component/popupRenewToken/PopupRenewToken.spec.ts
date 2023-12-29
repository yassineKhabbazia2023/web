import { createTestingPinia } from '@pinia/testing'
import { Store, defineStore } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount, VueWrapper } from '@vue/test-utils'
import router from '../../plugins/router'
import PopupRenewToken from '.'
import { ROUTES } from '../../app/mock'
import { commonStore } from '@kpmg/common'
import jwtDecode, { JwtPayload } from 'jwt-decode'
import { PDialog } from '@kpmg/styleguide'
import { nextTick } from 'vue'

const authPostMock = vi.fn(() => ({ data: '' }))
vi.mock('@kpmg/common', () => ({
  hasTokenExpired: (token: string) => !token,
  commonStore: defineStore('common', {
    state: () => ({
      user: {
        token: 'token'
      }
    }),
    getters: {
      isAuthenticated: () => true
    }
  }),
  commonApi: () => ({
    user_origin: {
      get: vi
        .fn()
        .mockResolvedValue({ data: 'CLIENT' })
    },
    auth: {
      post: authPostMock
    }
  }),
  routes: {
    value: []
  }
}))

vi.mock('jwt-decode', () => ({
  default: () => ({
    exp: Date.now() / 1000 + 5, // expires in 5 s.
    sub: 'something'
  })
}))

const pinia = createTestingPinia()

const createWrapper = () => mount(PopupRenewToken, {
  global: {
    plugins: [router, pinia]
  }
})

const getTokenRenewalDialog = (wrapper: VueWrapper) => wrapper.findComponent(PDialog)

// eslint-disable-next-line max-len
const TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlJFUTBNVVE1TjBOQ1JUSkVNemszTTBVMVJrTkRRMFUwUTBNMVJFRkJSamhETWpkRU5VRkJRZyJ9.eyJpc3MiOiJodHRwczovL2ZpZG0uZ2lneWEuY29tL2p3dC8zX2pXbXpmSjI5elFib1FQS0MzNDNrR0szMk1xQWU3MEQ3M3NxM3o0QmxYOGpjTU9kSnZ6U256NUFzUGRobkNlOVAvIiwiYXBpS2V5IjoiM19qV216ZkoyOXpRYm9RUEtDMzQza0dLMzJNcUFlNzBENzNzcTN6NEJsWDhqY01PZEp2elNuejVBc1BkaG5DZTlQIiwiaWF0IjoxNjk3NzIxMzE2LCJleHAiOjE2OTc3MjQ5MTYsInN1YiI6ImEyNTY2YzQ0ODBlZDRmNDBiMGQyMTM3ZTRiYWEwY2VhIn0.W0AhBctUYQSLgE09ugMb3fa0vE9YViM4nfAj59mN5tPpj70qn_RML1IhFHHy-HE70HBrC6AbR3VWOWgwWW139OASD2TpfqCkCFaGZIag_4BuGPoLbvQmORcte-Y6vq9cwkacOplM--mYc45FwZdAk0L8a_Xie-Ez8Q8Y8PvQcM7SlDPdzDlX69AMYU2YOcA9czfZRlONkf1zUIBgXwQQuWRKkKk9c10HbkuMVEqHDMeAaTIvMRU5EBycxWah19yIJaanbfD1sW-C1-KtzhA6agpKkRSxE2gUR8VNaiJwnJgj5F5s7f_9ZMEA7lo7giZR9fq8r5tQ62O60HCA_hmqMA'
const { sub } = jwtDecode<JwtPayload>(TOKEN)
describe('popup renew token', () => {
  let wrapper: VueWrapper<any>
  let store: Store<any>
  beforeEach(async () => {
    wrapper = createWrapper()
    store = commonStore(pinia)
    vi.clearAllTimers()
    vi.useFakeTimers()
    ROUTES.forEach((route) => router.addRoute(route))
    store.$patch({
      user: {
        token: null
      }
    })
  })

  it('show dialog after token change', async () => {
    store.$patch({
      user: {
        token: TOKEN
      }
    })

    await flushPromises()
    const tokenRenewalDialog = getTokenRenewalDialog(wrapper)
    await nextTick()
    expect(tokenRenewalDialog.find('.dialog-renew-token').exists()).toBeFalsy()
    vi.advanceTimersByTime(7000)
    await nextTick()
    expect(tokenRenewalDialog.find('.dialog-renew-token').exists()).toBeTruthy()
  })

  it('logout when user click on logout button', async () => {
    store.$patch({
      user: {
        token: TOKEN
      }
    })

    await flushPromises()
    vi.advanceTimersByTime(7000)
    const tokenRenewalDialog = getTokenRenewalDialog(wrapper)
    await nextTick()
    const button = tokenRenewalDialog.findAll('button')[1]
    await button.trigger('click')
    expect(wrapper.emitted()).toHaveProperty('logout')
  })

  it('renew when user click on stay button', async () => {
    store.$patch({
      user: {
        token: TOKEN
      }
    })

    await flushPromises()
    vi.advanceTimersByTime(7000)
    const tokenRenewalDialog = getTokenRenewalDialog(wrapper)
    await nextTick()
    const button = tokenRenewalDialog.findAll('button')[2]
    button.trigger('click')
    expect(authPostMock).toHaveBeenCalledTimes(1)
    expect(authPostMock).toHaveBeenCalledWith(
      `/refreshToken?userId=${sub}`)
  })
})

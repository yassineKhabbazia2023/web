import { createTestingPinia } from '@pinia/testing'
import { defineStore } from 'pinia'
import { beforeEach, describe, expect, it, type MockInstance, vi } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, shallowMount } from '@vue/test-utils'
import router from '../../plugins/router'
import PopupRenewToken from '.'
import { ROUTES } from '../../app/mock'
import { tokenService } from '@pulse/common'
import type { JwtPayload } from 'jwt-decode'
import jwtDecode from 'jwt-decode'
import { nextTick } from 'vue'

const authPostMock = vi.fn(() => ({ data: '' }))

const mock = vi.hoisted(() => {
  return {
    logoutAndRedirectToLogin: vi.fn(),
  }
})
vi.mock('@app/composables/useRedirection', () => ({
  useRedirection: () => {
    return {
      logoutAndRedirectToLogin: mock.logoutAndRedirectToLogin,
    }
  },
}))

vi.mock('@pulse/common', () => ({
  hasTokenExpired: (token: string) => !token,
  commonStore: defineStore('common', {
    state: () => ({
      user: {
        token: 'token',
      },
    }),
    getters: {
      isAuthenticated: () => true,
    },
    actions: {
      logout: () => vi.fn(),
    },
  }),
  commonApi: () => ({
    user_origin: {
      get: vi.fn().mockResolvedValue({ data: 'CLIENT' }),
    },
    gateway: {
      post: authPostMock,
    },
  }),
  routes: {
    value: [],
  },
  tokenService: {
    setToken: vi.fn(),
    getToken: vi.fn(),
    registerOnChange: vi.fn(),
    unregisterOnChange: vi.fn(),
  },
  dataProvider: () => {
    return {
      fetchUserData: vi.fn(),
    }
  },
}))

vi.mock('jwt-decode', () => ({
  default: () => ({
    exp: Date.now() / 1000 + 3600, // expires in 1 hour.
    sub: 'something',
  }),
}))

const fiftyFiveMinutesInMiliseconds = 3300000
const oneHourInMiliseconds = 3600000

createTestingPinia()

const createWrapper = (isVisible = true) => {
  const props = {
    isVisible,
  }

  return shallowMount(PopupRenewToken, {
    props,
    global: {
      stubs: {
        PDialog: {
          name: 'PDialog',
          template: '<div v-if="modelValue"><slot name="footer" /><slot /></div>',
          props: ['modelValue'],
        },
        PImage: true,
        PButton: true,
      },
    },
  })
}

const TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlJFUTBNVVE1TjBOQ1JUSkVNemszTTBVMVJrTkRRMFUwUTBNMVJFRkJSamhETWpkRU5VRkJRZyJ9.eyJpc3MiOiJodHRwczovL2ZpZG0uZ2lneWEuY29tL2p3dC8zX2pXbXpmSjI5elFib1FQS0MzNDNrR0szMk1xQWU3MEQ3M3NxM3o0QmxYOGpjTU9kSnZ6U256NUFzUGRobkNlOVAvIiwiYXBpS2V5IjoiM19qV216ZkoyOXpRYm9RUEtDMzQza0dLMzJNcUFlNzBENzNzcTN6NEJsWDhqY01PZEp2elNuejVBc1BkaG5DZTlQIiwiaWF0IjoxNjk3NzIxMzE2LCJleHAiOjE2OTc3MjQ5MTYsInN1YiI6ImEyNTY2YzQ0ODBlZDRmNDBiMGQyMTM3ZTRiYWEwY2VhIn0.W0AhBctUYQSLgE09ugMb3fa0vE9YViM4nfAj59mN5tPpj70qn_RML1IhFHHy-HE70HBrC6AbR3VWOWgwWW139OASD2TpfqCkCFaGZIag_4BuGPoLbvQmORcte-Y6vq9cwkacOplM--mYc45FwZdAk0L8a_Xie-Ez8Q8Y8PvQcM7SlDPdzDlX69AMYU2YOcA9czfZRlONkf1zUIBgXwQQuWRKkKk9c10HbkuMVEqHDMeAaTIvMRU5EBycxWah19yIJaanbfD1sW-C1-KtzhA6agpKkRSxE2gUR8VNaiJwnJgj5F5s7f_9ZMEA7lo7giZR9fq8r5tQ62O60HCA_hmqMA'
const { sub } = jwtDecode<JwtPayload>(TOKEN)

describe('popup renew token', () => {
  let wrapper: VueWrapper<any>
  let spyUnregisterOnChange: MockInstance
  beforeEach(() => {
    vi.clearAllTimers()
    vi.useFakeTimers()
    vi.spyOn(tokenService, 'registerOnChange').mockImplementation(
      (_key: string, cb: Function) => {
        cb(TOKEN)
      },
    )
    spyUnregisterOnChange = vi.spyOn(tokenService, 'unregisterOnChange')
    wrapper = createWrapper()
    ROUTES.forEach((route) => router.addRoute(route))
  })

  it("should emit the 'update:modelValue' event when the v-model is updated", async () => {
    const dialog = wrapper.findComponent({ name: 'PDialog' })
    dialog.vm.$emit('update:modelValue', false)
    await nextTick()

    expect(dialog.emitted('update:modelValue')).toStrictEqual([[false]])
  })

  it('emit update:isVisible=true after 5 minutes before expiration', async () => {
    const expectedEmit = [[true]]

    expect(wrapper.emitted('update:isVisible')).toBeUndefined()

    vi.advanceTimersByTime(fiftyFiveMinutesInMiliseconds)
    await nextTick()
    expect(wrapper.emitted('update:isVisible')).toStrictEqual(expectedEmit)
  })

  it('logout when user click on logout button', async () => {
    vi.spyOn(tokenService, 'getToken').mockReturnValueOnce(TOKEN)

    await flushPromises()
    vi.advanceTimersByTime(fiftyFiveMinutesInMiliseconds)
    const tokenRenewalDialog = wrapper.findComponent({ name: 'PDialog' })
    await nextTick()
    const button = tokenRenewalDialog.find('[data-testid="logout-button"]')
    await button.trigger('click')

    expect(mock.logoutAndRedirectToLogin).toHaveBeenCalledOnce()
  })

  it('renew when user click on stay button', async () => {
    vi.spyOn(tokenService, 'getToken').mockReturnValueOnce(TOKEN)

    await flushPromises()
    vi.advanceTimersByTime(fiftyFiveMinutesInMiliseconds)
    const tokenRenewalDialog = wrapper.findComponent({ name: 'PDialog' })
    await nextTick()

    const button = tokenRenewalDialog.find('[data-testid="renew-token-button"]')
    await button.trigger('click')

    expect(authPostMock).toHaveBeenCalledTimes(1)
    expect(authPostMock).toHaveBeenCalledWith(
      `authentication/api/refreshToken?userId=${sub}`,
    )
  })

  it('should logout and redirect to login after token expiration', async () => {
    const expectedEmit = [[true], [false]]
    vi.spyOn(tokenService, 'getToken').mockReturnValueOnce(TOKEN)
    vi.advanceTimersByTime(oneHourInMiliseconds)
    await nextTick()

    expect(wrapper.emitted('update:isVisible')).toStrictEqual(expectedEmit)
    expect(mock.logoutAndRedirectToLogin).toHaveBeenCalledOnce()
  })

  it('should call mock', async () => {
    wrapper.unmount()

    await nextTick()

    expect(spyUnregisterOnChange).toHaveBeenCalledOnce()
  })
})

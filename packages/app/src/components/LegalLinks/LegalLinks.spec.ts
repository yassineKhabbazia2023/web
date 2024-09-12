import { commonStore } from '@kpmg/common'
import { createTestingPinia } from '@pinia/testing'
import { setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import { useRoute } from 'vue-router'
import LegalLinks from '.'

const mockedUseRoute = useRoute as Mock
vi.mock('vue-router')

const createWrapper = (): VueWrapper<any> => mount(LegalLinks, {
  global: {
    plugins: [pinia],
    stubs: {
      PDrawer: {
        name: 'PDrawer',
        template: '<div><slot/><slot name="footer"/></div>',
        events: ['close-drawer-button'],
      },
    },
  },
})

const pinia = createTestingPinia()

describe('legalLinks', () => {
  let wrapper: VueWrapper<any>

  beforeEach(async () => {
    mockedUseRoute.mockReturnValue({
      name: 'login',
    })
    wrapper = createWrapper()
    await flushPromises()
    setActivePinia(pinia)
  })

  it('has links in the footer', () => {
    expect(wrapper.find('.legal-links').exists()).toBeTruthy()
  })
  it("should emit the 'update:modelValue' event when the drawer is closed", async () => {
    const pDrawer = wrapper.findComponent({ name: 'PDrawer' })
    pDrawer.vm.$emit('close-drawer-button', false)
    await nextTick()

    expect(pDrawer.props('modelValue')).toBeFalsy()
    expect(pDrawer.emitted('close-drawer-button')).toStrictEqual([[false]])
  })
  it('should close the drawer when the close button is clicked', async () => {
    const pDrawer = wrapper.findComponent({ name: 'PDrawer' })
    const closeButton = wrapper.findComponent('[data-testid=drawer-close-button]')
    await closeButton.trigger('click')

    expect(pDrawer.props('modelValue')).toBeFalsy()
  })
  it('can read the notices', async () => {
    await vi.dynamicImportSettled()
    const noticeLink = wrapper.find('[data-testid="legal-links-notices"]')
    const cookiesNoticesDrawer = wrapper.find('[data-testid="cookies-notices-drawer"]')

    expect(cookiesNoticesDrawer.classes()).toContainEqual('close')

    await noticeLink.trigger('click')
    expect(cookiesNoticesDrawer.classes()).toContainEqual('open')
  })
  it('should display the CGU link user is a client or if the page is login-client', async () => {
    const store = commonStore()
    // @ts-expect-error: Getter is read only
    store.isCollab = false

    mockedUseRoute.mockReturnValue({
      name: 'login-client',
    })

    wrapper = createWrapper()
    await flushPromises()
    const linkCGU = wrapper.find('[data-testid=legal-links-cgu]')
    expect(linkCGU.exists()).toBeTruthy()
  })
  it('should not display the CGU link user is a client or if the page is login-client', async () => {
    const store = commonStore()
    // @ts-expect-error: Getter is read only
    store.isCollab = true
    mockedUseRoute.mockReturnValue({
      name: 'login',
    })

    wrapper = createWrapper()
    await flushPromises()

    const linkCGU = wrapper.find('[data-testid=legal-links-cgu]')
    expect(linkCGU.exists()).toBeFalsy()
  })
})

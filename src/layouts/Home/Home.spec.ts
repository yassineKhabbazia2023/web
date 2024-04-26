import {
  ScheduleServicesMock,
  KpmgCommontMock,
} from '@/schedule/tests/mocks/commonViMock'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { commonStore as store } from '@kpmg/common'
import { createTestingPinia } from '@pinia/testing'
import router from '@/plugins/router'
import helpers from '@/tests/utils/helpers'
import Home from '.'
import { nextTick } from 'vue'

const pinia = createTestingPinia()
const { fakeUser } = helpers()

vi.mock('@/schedule/services', () => ScheduleServicesMock)
vi.mock('@kpmg/common', () => KpmgCommontMock)

const createWrapper = (): VueWrapper<any> =>
  mount(Home, {
    attachTo: document.body,
    global: {
      plugins: [pinia, router],
      stubs: {
        Schedule: { template: '<div data-testid="schedule-stub">' },
        MyInformation: { template: '<div />' },
      },
    },
  })

function getHomeScheduleDrawer(wrapper: VueWrapper) {
  return wrapper.findComponent({ name: 'HomeScheduleDrawer' })
}

describe('home', () => {
  let wrapper: VueWrapper<any>
  beforeEach(() => {
    wrapper = createWrapper()
  })

  it('can display the user profile drawer', async () => {
    const getUserProfileDrawer = () =>
      document.querySelector('.user-profile-drawer') as HTMLElement
    expect(getUserProfileDrawer()).toBeFalsy()

    const userAvatar = wrapper.find('.header-section__user-avatar')
    await userAvatar.trigger('click')

    expect(getUserProfileDrawer()).toBeTruthy()
  })

  it('should display the app after retrieving all current user data', async () => {
    wrapper.vm.isLoading = true
    await nextTick()
    let commonLayout = wrapper.find('.common-layout')

    expect(commonLayout.exists()).toBeFalsy()

    const myStore = store()

    expect(myStore.$patch).toHaveBeenCalledOnce()
    expect(myStore.$patch).toHaveBeenCalledWith({
      user: {
        id: fakeUser?.id,
        firstName: fakeUser?.firstName,
        lastName: fakeUser?.lastName,
        email: fakeUser?.email,
        isCollab: fakeUser?.isCollab,
      },
    })

    wrapper.vm.isLoading = false
    await nextTick()
    commonLayout = wrapper.find('.common-layout')

    expect(commonLayout.exists()).toBeTruthy()
  })

  it('should show calendar drawer when header emits show-user-profile-drawer', async () => {
    wrapper.vm.isLoading = false
    await nextTick()

    expect(getHomeScheduleDrawer(wrapper).exists()).toBeFalsy()

    const header = wrapper.findComponent({ name: 'Header' })
    await header.vm.$emit('update:show-calendar', true)

    const scheduleDrawer = getHomeScheduleDrawer(wrapper)

    expect(scheduleDrawer.exists()).toBeTruthy()
    expect(scheduleDrawer.props()).toStrictEqual({
      modelValue: true,
    })
  })

  it('should still show calendar drawer when header emits show-user-profile-drawer and close it after', async () => {
    wrapper.vm.isLoading = false
    await nextTick()

    expect(getHomeScheduleDrawer(wrapper).exists()).toBeFalsy()

    const header = wrapper.findComponent({ name: 'Header' })
    await header.vm.$emit('update:show-calendar', true)
    await header.vm.$emit('update:show-calendar', false)

    const scheduleDrawer = getHomeScheduleDrawer(wrapper)

    expect(scheduleDrawer.exists()).toBeTruthy()
    expect(scheduleDrawer.props()).toStrictEqual({
      modelValue: false,
    })
  })
})

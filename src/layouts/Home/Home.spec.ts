import { ScheduleServicesMock, KpmgCommontMock } from '@/schedule/tests/mocks/commonViMock'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import router from '@/plugins/router'
import Home from './'

const pinia = createTestingPinia()

vi.mock('@/schedule/services', () => ScheduleServicesMock)
vi.mock('@kpmg/common', () => KpmgCommontMock)

const createWrapper = (): VueWrapper<any> =>
  mount(Home, {
    attachTo: document.body,
    global: {
      plugins: [pinia, router],
      stubs: {
        Schedule: { template: '<div data-testid="schedule-stub">' },
      },
    },
  })

describe('home', () => {
  let wrapper: VueWrapper<any>
  beforeEach(() => {
    wrapper = createWrapper()
  })

  it('can display the user profile drawer', async () => {
    const getUserProfileDrawer = () => document.querySelector('.user-profile-drawer') as HTMLElement
    expect(getUserProfileDrawer()).toBeFalsy()

    const userAvatar = wrapper.find('.header-section__user-avatar')
    await userAvatar.trigger('click')

    expect(getUserProfileDrawer()).toBeTruthy()
  })
})

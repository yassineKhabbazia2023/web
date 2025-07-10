import type { VueWrapper } from '@vue/test-utils'
import { shallowMount } from '@vue/test-utils'
import { isScheduleActivatedMock, isFeedCenterActivatedMock, loggerMock, featureFlagManagerMock } from '@pulse/core/mocks'
import { routerMock } from '@app/__mocks__/router.mocks'
import type { HeaderProps } from './HeaderTypes'
import { useUserStore } from '@pulse/common/stores'
import { getStoreMock, getMockedUserInfo } from '@pulse/common/mocks'
import { AvatarRoles } from '@pulse/styleguide'

import Header from './'

const userStoreMock = getStoreMock(useUserStore)

const getInitialsMock = vi.hoisted(() => vi.fn())
vi.mock('@pulse/common', () => ({
  getInitials: getInitialsMock,
}))


vi.mock('@pulse/core', () => ({
  logger: loggerMock,
  FeatureFlagManager: featureFlagManagerMock,
}))


const createWrapper = (
  showCalendar: HeaderProps['showCalendar'],
  showFeedCenter: HeaderProps['showFeedCenter'] = false,
  unreadNotificationsCount: HeaderProps['unreadNotificationsCount'] = 0,
): VueWrapper<any> =>
  shallowMount(Header, {
    props: {
      showCalendar,
      showFeedCenter,
      unreadNotificationsCount,
    },
    global: {
      plugins: [routerMock],
      stubs: {
        PAvatar: {
          name: 'PAvatar',
          template: '<p-avatar-stub><slot /></p-avatar-stub>',
          props: ['pRole'],
        },
        PButton: {
          name: 'PButton',
          template: '<p-button-stub><slot /></p-button-stub>',
          props: ['pType', 'pIsActive'],
        },
        'router-link': {
          template: '<p-button-stub><slot /></p-button-stub>',
        },
      },
    },
  })

describe('test header', () => {
  describe('with common wrapper', () => {
    let wrapper: ReturnType<typeof createWrapper>
    beforeEach(() => {
      isScheduleActivatedMock.mockReturnValue(true)
      isFeedCenterActivatedMock.mockReturnValue(true)

      wrapper = createWrapper(false)
    })

    it('should display the header section correctly', () => {
      const header = wrapper.find('.header-section')
      const logo = wrapper.find('.header-section__logo')

      expect(header.exists()).toBeTruthy()
      expect(logo.exists()).toBeTruthy()
    })

    it('should display the calendar and the action buttons correctly', async () => {
      const buttons = wrapper.findAllComponents({ name: 'PButton' })
      const calendarBtn = buttons[0]

      expect(calendarBtn.props('pType')).toBe('default')

      const icon = wrapper.findComponent({ name: 'PIcon' })
      expect(icon.props('pName')).toBe('calendarEvent')

      await calendarBtn.trigger('click')

      expect(wrapper.emitted('update:showCalendar')).toBeTruthy()
    })

    it('should display buttons when calendar is open correctly', () => {
      wrapper = createWrapper(true)

      const buttons = wrapper.findAllComponents({ name: 'PButton' })
      const calendarBtn = buttons[0]

      expect(calendarBtn.props('pType')).toBe('white')
      expect(calendarBtn.props('pIsActive')).toBe(true)

      const pIcon = calendarBtn.findComponent({ name: 'PIcon' })
      expect(pIcon.props('pName')).toBe('x')
    })

    it('should display accordingly to opened state', async () => {
      const buttons = wrapper.findAllComponents({ name: 'PButton' })
      const feedCenterButton = buttons[1]

      expect(feedCenterButton.props('pType')).toBe('default')
      const icon = feedCenterButton.findComponent({ name: 'PIcon' })
      expect(icon.props('pName')).toBe('bell')

      await feedCenterButton.trigger('click')

      expect(wrapper.emitted('update:showFeedCenter')).toBeTruthy()
    })

    it('should display the appropriate button when feed center is opened', () => {
      wrapper = createWrapper(false, true)

      const buttons = wrapper.findAllComponents({ name: 'PButton' })
      const feedCenterButton = buttons[1]

      expect(feedCenterButton.props('pType')).toBe('white')
      expect(feedCenterButton.props('pIsActive')).toBe(true)
      const icon = feedCenterButton.findComponent({ name: 'PIcon' })
      expect(icon.props('pName')).toBe('x')
    })

    it.each([
      {
        notificationsCount: 0,
        shouldShowNotificationsCount: false,
      },
      {
        notificationsCount: 1,
        shouldShowNotificationsCount: true,
      },
      {
        notificationsCount: 100,
        shouldShowNotificationsCount: true,
      },
    ])('should show notification count when there are notifications', (
      {
        notificationsCount,
        shouldShowNotificationsCount,
      },
    ) => {
      const wrapper = createWrapper(false, false, notificationsCount)
      const notificationWrapper = wrapper.findComponent({ name: 'PPastille' })
      expect(notificationWrapper.exists()).toBe(shouldShowNotificationsCount)
    })
  })

  describe('with individual wrapper', () => {
    it('should display initial user even the data in store is empty and token on localStorage is valid', () => {
      const initialsMock = 'JD'
      getInitialsMock.mockReturnValue(initialsMock)
      const wrapper = createWrapper(false)
      const initialContainer = wrapper.findComponent('[data-ut="user-initials"]')

      expect(initialContainer.text()).toBe(initialsMock)
    })

    it('should call getInitials with proper parameters', () => {
      const userMock = getMockedUserInfo({
        firstName: 'John',
        lastName: 'Mac Artur',
      })

      userStoreMock.user = userMock
      createWrapper(false)

      expect(getInitialsMock).toHaveBeenCalledOnce()
      expect(getInitialsMock).toHaveBeenCalledWith(userMock.firstName, userMock.lastName)
    })

    const tests = [{
      isCollab: true,
      expectedRole: AvatarRoles.COLLAB,
    }, {
      isCollab: false,
      expectedRole: AvatarRoles.CLIENT,
    }]
    it.each(tests)('should give pRole = $expectedRole to PAvatar when isCollab is $isCollab', ({
      isCollab,
      expectedRole,
    }) => {
      userStoreMock.isCollab = isCollab
      const wrapper = createWrapper(false)

      const avatar = wrapper.findComponent({ name: 'PAvatar' })

      expect(avatar.props('pRole')).toBe(expectedRole)
    })
  })
})

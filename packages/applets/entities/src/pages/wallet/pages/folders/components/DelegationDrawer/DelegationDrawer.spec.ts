import { nextTick } from 'vue'
import { loggerMock } from '@pulse/core/mocks'
import { shallowMount, flushPromises } from '@vue/test-utils'
import type { DelegationDrawerProps } from './DelegationDrawerTypes'
import { entitiesMock } from '@entities/__mocks__/entities.mocks'
import { PNotification as PNotificationMock } from '@pulse/styleguide'
import { useUserStore } from '@pulse/common/stores'
import { getMockedUserInfo, getStoreMock } from '@pulse/common/mocks'
import { delegateAccounts } from '@entities/services/account'

import DelegationDrawer from '.'

vi.mock('@pulse/core', () => ({ logger: loggerMock }))
vi.mock('@entities/services/account')

const userStoreMock = getStoreMock(useUserStore)

const USER_ID = 1324
const COLLABORATORS_SELECTED = [{ id: 1 }, { id: 2 }, { id: 3 }]
const FIRST_SELECTED_FOLDER = {
  id: 1,
  accountNumber: 'a custom number',
  name: 'a custom name',
}
const SECOND_SELECTED_FOLDER = {
  id: 2,
  accountNumber: 'another custom number',
  name: 'another custom name',
}

const delegateAccountsMock = vi.mocked(delegateAccounts)

const defaultProps: DelegationDrawerProps = {
  modelValue: true,
  selectedFolders: [
    {
      ...FIRST_SELECTED_FOLDER,
      avatarColor: 'cyan',
    },
    {
      ...SECOND_SELECTED_FOLDER,
      avatarColor: 'fuschia',
    },
  ],
  numberOfFoldersInPortfolio: 20,
}

vi.mock('@pulse/styleguide')

const createWrapper = (
  props: DelegationDrawerProps = defaultProps,
) => {
  return shallowMount(DelegationDrawer, {
    props,
    global: {
      stubs: {
        PDrawer: {
          name: 'PDrawer',
          template: '<div><slot name="header-prefix" /><slot name="footer" /><slot /></div>',
          props: ['modelValue'],
        },
      },
    },
  })
}

const createFullDelegationWrapper = () => createWrapper({
  ...defaultProps,
  selectedFolders: [],
})

const userMock = getMockedUserInfo({
  id: USER_ID,
})

describe('delegationDrawer', () => {
  beforeEach(() => {
    userStoreMock.user = userMock
  })

  afterEach(() => {
    document.body.outerHTML = ''
  })

  describe('rendering', () => {
    it('should display the collab folders number', () => {
      const wrapper = createWrapper()
      const foldersNumber = wrapper.find('.delegation-drawer__header')
      expect(foldersNumber.html()).toContain(entitiesMock.length)
    })

    it('should display the correct steps when DelegationFlowType.FULL', async () => {
      const wrapper = createFullDelegationWrapper()

      await nextTick() // does not work without it
      const stepper = wrapper.findComponent({ name: 'PSteps' })
      expect(stepper.exists()).toBeTruthy()
    })

    it('should render AddDelegatesStep when activeStep = 0', async () => {
      const wrapper = createFullDelegationWrapper()
      await nextTick()
      const addDelegatesStepWrapper = wrapper.findComponent({ name: 'AddDelegatesStep' })

      const pStepsWrapper = wrapper.findComponent({ name: 'PSteps' })
      expect(pStepsWrapper.props('pActive')).toBe(0)

      expect(addDelegatesStepWrapper.exists()).toBeTruthy()
    })

    it('should render DelegationPreviewList when activeStep = 1', async () => {
      const wrapper = createFullDelegationWrapper()
      await nextTick()

      const nextPreviousButtonsWrapper = wrapper.findComponent({ name: 'NextPreviousButtons' })
      await nextPreviousButtonsWrapper.vm.$emit('click-next')

      const pStepsWrapper = wrapper.findComponent({ name: 'PSteps' })
      expect(pStepsWrapper.props('pActive')).toBe(1)

      const delegationPreviewListWrapper = wrapper.findComponent({ name: 'DelegationPreviewList' })

      expect(delegationPreviewListWrapper.exists()).toBeTruthy()
    })
  })

  describe('props', () => {
    it.each([
      {
        isDrawerVisible: true,
      },
      {
        isDrawerVisible: false,
      },
    ])(
      'should display drawer based on received prop',
      async ({ isDrawerVisible }) => {
        const wrapper = createWrapper()
        const drawerWrapper = wrapper.findComponent({ name: 'PDrawer' })
        wrapper.setProps({ modelValue: isDrawerVisible })

        await nextTick()
        expect(drawerWrapper.props('modelValue')).toBe(isDrawerVisible)
      },
    )
  })

  describe('interactions', () => {
    describe('addDelegatesStep', () => {
      it('should set selectedCollaborators on collaborator-selection', async () => {
        const wrapper = createWrapper()
        const addDelegatesStepWrapper = wrapper.findComponent({ name: 'AddDelegatesStep' })
        const nextPreviousButtonWrapper = wrapper.findComponent({ name: 'NextPreviousButtons' })
        expect(
          nextPreviousButtonWrapper.props('isNextButtonDisabled'),
        ).toBeTruthy()

        await addDelegatesStepWrapper.vm.$emit('collaborator-selection', [1, 2, 3])
        // The only use case in this component is enabling or disabling the next button
        // so i'm checking isNextButtonDisabled state to check if data has been updated
        expect(
          nextPreviousButtonWrapper.props('isNextButtonDisabled'),
        ).toBeFalsy()
      })
    })

    describe('nextPreviousButtons', () => {
      it('should close drawer if current step is 0', async () => {
        const wrapper = createWrapper()
        const nextPreviousButtonsWrapper = wrapper.findComponent({ name: 'NextPreviousButtons' })
        await nextPreviousButtonsWrapper.vm.$emit('click-previous')

        expect(wrapper.emitted('update:modelValue')).toStrictEqual([[false]])
      })

      it('should call api to complete delegation process when active step is 1', async () => {
        const expectedNextPreviousButtonPropsBefore = {
          'isNextButtonDisabled': false,
          'isNextButtonLoading': false,
          'nextLabel': 'Next',
          'previousLabel': 'Cancel',
        }
        const expectedNextPreviousButtonPropsAfter = {
          'isNextButtonDisabled': false,
          'isNextButtonLoading': false,
          'nextLabel': 'Submit',
          'previousLabel': 'Cancel',
        }
        const wrapper = createFullDelegationWrapper()
        await nextTick()

        const addDelegatesStepWrapper = wrapper.findComponent({ name: 'AddDelegatesStep' })
        expect(PNotificationMock).not.toHaveBeenCalled()

        await addDelegatesStepWrapper.vm.$emit('collaboratorSelection', COLLABORATORS_SELECTED)

        const nextPreviousButtonsWrapper = wrapper.findComponent({ name: 'NextPreviousButtons' })

        expect(nextPreviousButtonsWrapper.props()).toStrictEqual(expectedNextPreviousButtonPropsBefore)

        await nextPreviousButtonsWrapper.vm.$emit('click-next')
        await nextPreviousButtonsWrapper.vm.$emit('click-next')

        expect(delegateAccountsMock).toHaveBeenCalledOnce()
        expect(delegateAccountsMock).toHaveBeenCalledWith(
          {
            accountIds: [],
            includePennylaneAccess: false,
            delegationDetails: [
              {
                delegateeId: COLLABORATORS_SELECTED[0].id,
                isAutomaticDelegation: false,
                startDate: expect.any(String),
              },
              {
                delegateeId: COLLABORATORS_SELECTED[1].id,
                isAutomaticDelegation: false,
                startDate: expect.any(String),
              },
              {
                delegateeId: COLLABORATORS_SELECTED[2].id,
                isAutomaticDelegation: false,
                startDate: expect.any(String),
              },
            ],
            delegatorId: USER_ID,
            isFullDelegation: true,
          },
        )

        await flushPromises()

        expect(nextPreviousButtonsWrapper.props()).toStrictEqual(expectedNextPreviousButtonPropsAfter)

        expect(PNotificationMock).toHaveBeenCalledOnce()
      })

      it('should display failure notification when api call fails then close the drawer', async () => {
        delegateAccountsMock.mockRejectedValue({})

        const wrapper = createFullDelegationWrapper()
        await nextTick()

        const addDelegatesStepWrapper = wrapper.findComponent({ name: 'AddDelegatesStep' })
        expect(PNotificationMock).not.toHaveBeenCalled()

        await addDelegatesStepWrapper.vm.$emit('collaboratorSelection', COLLABORATORS_SELECTED)

        const nextPreviousButtonsWrapper = wrapper.findComponent({ name: 'NextPreviousButtons' })
        await nextPreviousButtonsWrapper.vm.$emit('click-next')
        await nextPreviousButtonsWrapper.vm.$emit('click-next')

        expect(delegateAccountsMock).toHaveBeenCalledOnce()

        await flushPromises()
        expect(PNotificationMock).toHaveBeenCalledOnce()
      })

      it('should directly post user on "specific" delegation flow type', async () => {
        const wrapper = createWrapper()
        const hasPennylaneAccessMock = true
        const nextPreviousButtonsWrapper = wrapper.findComponent({ name: 'NextPreviousButtons' })
        const expectedNextPreviousButtonProps = {
          'isNextButtonDisabled': false,
          'isNextButtonLoading': false,
          'nextLabel': 'Submit',
          'previousLabel': 'Cancel',
        }

        expect(PNotificationMock).not.toHaveBeenCalled()

        const addDelegatesStepWrapper = wrapper.findComponent({ name: 'AddDelegatesStep' })
        await addDelegatesStepWrapper.vm.$emit('collaboratorSelection', COLLABORATORS_SELECTED)
        await addDelegatesStepWrapper.vm.$emit('update:hasPennylaneAccess', hasPennylaneAccessMock)

        expect(nextPreviousButtonsWrapper.props()).toStrictEqual(expectedNextPreviousButtonProps)

        await nextPreviousButtonsWrapper.vm.$emit('click-next')

        expect(delegateAccountsMock).toHaveBeenCalledWith(
          {
            accountIds: [FIRST_SELECTED_FOLDER.id, SECOND_SELECTED_FOLDER.id],
            includePennylaneAccess: hasPennylaneAccessMock,
            delegationDetails: [
              {
                delegateeId: COLLABORATORS_SELECTED[0].id,
                isAutomaticDelegation: false,
                startDate: expect.any(String),
              },
              {
                delegateeId: COLLABORATORS_SELECTED[1].id,
                isAutomaticDelegation: false,
                startDate: expect.any(String),
              },
              {
                delegateeId: COLLABORATORS_SELECTED[2].id,
                isAutomaticDelegation: false,
                startDate: expect.any(String),
              },
            ],
            delegatorId: USER_ID,
            isFullDelegation: false,
          },
        )

        await flushPromises()

        expect(nextPreviousButtonsWrapper.props()).toStrictEqual(expectedNextPreviousButtonProps)

        expect(PNotificationMock).toHaveBeenCalledOnce()
      })
    })
  })
})

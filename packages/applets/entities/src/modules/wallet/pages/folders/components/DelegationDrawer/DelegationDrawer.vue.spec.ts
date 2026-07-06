import { nextTick } from 'vue'
import { loggerMock } from '@pulse/toolbox/mocks'
import { shallowMount, flushPromises } from '@vue/test-utils'
import type { DelegationDrawerProps } from './DelegationDrawerTypes'
import { displayNotification as displayNotificationMock } from '@pulse/styleguide'
import { delegateAccounts } from '@entities/services/account'

import DelegationDrawer from '.'

vi.mock('@pulse/toolbox', () => ({ logger: loggerMock }))
vi.mock('@entities/services/account')
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}))

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
      isCustomerRelation: false,
    },
    {
      ...SECOND_SELECTED_FOLDER,
      avatarColor: 'fuschia',
      isCustomerRelation: false,
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

describe('delegationDrawer', () => {
  afterEach(() => {
    document.body.outerHTML = ''
  })

  describe('rendering', () => {
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

      const nextPreviousButtonsWrapper = wrapper.findComponent({ name: 'PDrawerActions' })
      await nextPreviousButtonsWrapper.vm.$emit('click-primary-cta')

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
        const nextPreviousButtonWrapper = wrapper.findComponent({ name: 'PDrawerActions' })
        expect(
          nextPreviousButtonWrapper.props('pPrimaryCTA').pDisabled,
        ).toBeTruthy()

        await addDelegatesStepWrapper.vm.$emit('collaborator-selection', [1, 2, 3])
        // The only use case in this component is enabling or disabling the next button
        // so i'm checking pPrimaryCTA.pDisabled state to check if data has been updated
        expect(
          nextPreviousButtonWrapper.props('pPrimaryCTA').pDisabled,
        ).toBeFalsy()
      })
    })

    describe('nextPreviousButtons', () => {
      it('should close drawer if current step is 0', async () => {
        const wrapper = createWrapper()
        const nextPreviousButtonsWrapper = wrapper.findComponent({ name: 'PDrawerActions' })
        await nextPreviousButtonsWrapper.vm.$emit('click-back-cta')

        expect(wrapper.emitted('update:modelValue')).toStrictEqual([[false]])
      })

      it('should call api to complete delegation process when active step is 1', async () => {
        const expectedPropsBefore = {
          pBackCTA: { pLabel: 'entities.delegationDrawer.cancelButtonLabel', pTestId: 'previousButton' },
          pSecondaryCTA: undefined,
          pPrimaryCTA: { pLabel: 'entities.delegationDrawer.primaryButtonLabel', pDisabled: false, pLoading: false, pTestId: 'nextButton' },
        }
        const expectedPropsAfter = {
          pBackCTA: { pLabel: 'entities.delegationDrawer.cancelButtonLabel', pTestId: 'previousButton' },
          pSecondaryCTA: undefined,
          pPrimaryCTA: { pLabel: 'entities.delegationDrawer.primaryButtonLabel', pDisabled: true, pLoading: false, pTestId: 'nextButton' },
        }
        const wrapper = createFullDelegationWrapper()
        await nextTick()

        const addDelegatesStepWrapper = wrapper.findComponent({ name: 'AddDelegatesStep' })
        expect(displayNotificationMock).not.toHaveBeenCalled()

        await addDelegatesStepWrapper.vm.$emit('collaboratorSelection', COLLABORATORS_SELECTED)

        const nextPreviousButtonsWrapper = wrapper.findComponent({ name: 'PDrawerActions' })

        expect(nextPreviousButtonsWrapper.props()).toStrictEqual(expectedPropsBefore)

        await nextPreviousButtonsWrapper.vm.$emit('click-primary-cta')
        await nextPreviousButtonsWrapper.vm.$emit('click-primary-cta')

        expect(delegateAccountsMock).toHaveBeenCalledExactlyOnceWith({
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
          isFullDelegation: true,
        })

        await flushPromises()

        expect(nextPreviousButtonsWrapper.props()).toStrictEqual(expectedPropsAfter)

        expect(displayNotificationMock).toHaveBeenCalledOnce()
      })

      it('should display failure notification when api call fails then close the drawer', async () => {
        delegateAccountsMock.mockRejectedValue({})

        const wrapper = createFullDelegationWrapper()
        await nextTick()

        const addDelegatesStepWrapper = wrapper.findComponent({ name: 'AddDelegatesStep' })
        expect(displayNotificationMock).not.toHaveBeenCalled()

        await addDelegatesStepWrapper.vm.$emit('collaboratorSelection', COLLABORATORS_SELECTED)

        const nextPreviousButtonsWrapper = wrapper.findComponent({ name: 'PDrawerActions' })
        await nextPreviousButtonsWrapper.vm.$emit('click-primary-cta')
        await nextPreviousButtonsWrapper.vm.$emit('click-primary-cta')

        expect(delegateAccountsMock).toHaveBeenCalledOnce()

        await flushPromises()
        expect(displayNotificationMock).toHaveBeenCalledOnce()
      })

      it('should directly post user on "specific" delegation flow type', async () => {
        const wrapper = createWrapper()
        const hasPennylaneAccessMock = true
        const nextPreviousButtonsWrapper = wrapper.findComponent({ name: 'PDrawerActions' })

        const expectedPropsAfterEmit = {
          pBackCTA: { pLabel: 'entities.delegationDrawer.cancelButtonLabel', pTestId: 'previousButton' },
          pSecondaryCTA: undefined,
          pPrimaryCTA: { pLabel: 'entities.delegationDrawer.submitButtonLabel', pDisabled: false, pLoading: false, pTestId: 'nextButton' },
        }

        const expectedPropsAfterDelegation = {
          pBackCTA: { pLabel: 'entities.delegationDrawer.cancelButtonLabel', pTestId: 'previousButton' },
          pSecondaryCTA: undefined,
          pPrimaryCTA: { pLabel: 'entities.delegationDrawer.submitButtonLabel', pDisabled: true, pLoading: false, pTestId: 'nextButton' },
        }

        expect(displayNotificationMock).not.toHaveBeenCalled()

        const addDelegatesStepWrapper = wrapper.findComponent({ name: 'AddDelegatesStep' })
        await addDelegatesStepWrapper.vm.$emit('collaboratorSelection', COLLABORATORS_SELECTED)
        await addDelegatesStepWrapper.vm.$emit('update:hasPennylaneAccess', hasPennylaneAccessMock)

        expect(nextPreviousButtonsWrapper.props()).toStrictEqual(expectedPropsAfterEmit)

        await nextPreviousButtonsWrapper.vm.$emit('click-primary-cta')

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
            isFullDelegation: false,
          },
        )

        await flushPromises()

        expect(nextPreviousButtonsWrapper.props()).toStrictEqual(expectedPropsAfterDelegation)

        expect(displayNotificationMock).toHaveBeenCalledOnce()
      })
    })
  })
})

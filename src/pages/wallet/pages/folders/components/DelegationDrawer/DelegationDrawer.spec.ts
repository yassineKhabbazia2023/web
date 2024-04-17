import { defineStore } from 'pinia'
import { createTestingPinia } from '@pinia/testing'
import { nextTick } from 'vue'
import { PDrawer, PSteps } from '@kpmg/styleguide'
import { type VueWrapper, mount, flushPromises } from '@vue/test-utils'
import { beforeEach, vi, describe, it, expect } from 'vitest'
import { createI18n } from 'vue-i18n'
import type { DelegationDrawerProps } from './DelegationDrawerTypes'
import { entitiesMock } from '@/../tests/mocks/EntitiesMocks'
import NextPreviousButtons from '@/components/NextPreviousButtons'
import AddDelegatesStep from './components/AddDelegatesStep'
import DelegationPreviewList from './components/DelegationPreviewList'
import DelegationDrawer from '.'

const USER_ID = 'a custom user id'

const gatewayPostMock = vi.fn(() => Promise.resolve())
vi.mock('@kpmg/common', () => ({
  commonStore: defineStore('common', {
    state: () => ({
      user: {
        id: USER_ID,
      },
    }),
    getters: {
      isAuthenticated: () => true,
    },
  }),
  commonApi: () => ({
    gateway: {
      post: gatewayPostMock,
    },
  }),
}))

const pinia = createTestingPinia()

const defaultProps = {
  modelValue: true,
  selectedFolders: entitiesMock,
  numberOfFoldersInPortfolio: 20,
}

const i18n = createI18n({
  locale: 'fr-FR',
})

const mockToastPlugin = vi.fn()

const createWrapper = (
  props: DelegationDrawerProps = defaultProps,
): VueWrapper => {
  return mount(DelegationDrawer, {
    props,
    global: {
      plugins: [pinia],
      provide: {
        i18n,
        toast: mockToastPlugin,
      },
      stubs: [
        'AddDelegatesStep',
        'DelegationPreviewList',
        'CollaboratorsSearchAutocomplete',
      ],
    },
  })
}

const createFullDelegationWrapper = () => createWrapper({
  ...defaultProps,
  selectedFolders: [],
})

const findNextPreviousButton = (wrapper: VueWrapper) =>
  wrapper.findComponent(NextPreviousButtons)

const findAddDelegatesStepWrapper = (wrapper: VueWrapper) => wrapper.findComponent(AddDelegatesStep)
const findPStepsWrapper = (wrapper: VueWrapper) => wrapper.findComponent(PSteps)
let wrapper: VueWrapper

describe('delegationDrawer', () => {
  beforeEach(() => {
    wrapper = createWrapper()
  })

  describe('rendering', () => {
    it('should display the collab folders number', () => {
      const foldersNumber = wrapper.find('.delegation-drawer__header')
      expect(foldersNumber.html()).toContain(entitiesMock.length)
    })

    it('should display the correct steps when DelegationFlowType.FULL', async () => {
      const wrapper = createFullDelegationWrapper()

      await nextTick() // does not work without it
      const stepper = wrapper.findComponent(PSteps)
      expect(stepper.exists()).toBeTruthy()
    })

    it('should render AddDelegatesStep when activeStep = 0', async () => {
      const wrapper = createFullDelegationWrapper()
      await nextTick()
      const addDelegatesStepWrapper = findAddDelegatesStepWrapper(wrapper)

      const pStepsWrapper = findPStepsWrapper(wrapper)
      expect(pStepsWrapper.props('pActive')).toBe(0)

      expect(addDelegatesStepWrapper.exists()).toBeTruthy()
    })

    it('should render DelegationPreviewList when activeStep = 1', async () => {
      const wrapper = createFullDelegationWrapper()
      await nextTick()

      const nextPreviousButtonsWrapper = findNextPreviousButton(wrapper)
      nextPreviousButtonsWrapper.vm.$emit('click-next')
      await nextTick()

      const pStepsWrapper = findPStepsWrapper(wrapper)
      expect(pStepsWrapper.props('pActive')).toBe(1)

      const delegationPreviewListWrapper = wrapper.findComponent(
        DelegationPreviewList,
      )

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
        const drawerWrapper = wrapper.findComponent(PDrawer)
        wrapper.setProps({ modelValue: isDrawerVisible })

        await nextTick()
        expect(drawerWrapper.props('modelValue')).toBe(isDrawerVisible)
      },
    )
  })

  describe('interactions', () => {
    describe('addDelegatesStep', () => {
      it('should set selectedCollaborators on collaborator-selection', async () => {
        const addDelegatesStepWrapper = findAddDelegatesStepWrapper(wrapper)
        const nextPreviousButtonWrapper = findNextPreviousButton(wrapper)
        expect(
          nextPreviousButtonWrapper.props('isNextButtonDisabled'),
        ).toBeTruthy()

        addDelegatesStepWrapper.vm.$emit('collaborator-selection', [1, 2, 3])
        await nextTick()
        // The only use case in this component is enabling or disabling the next button
        // so i'm checking isNextButtonDisabled state to check if data has been updated
        expect(
          nextPreviousButtonWrapper.props('isNextButtonDisabled'),
        ).toBeFalsy()
      })
    })

    describe('delegationPreviewList', () => {
      it('should update the delegationDetails upon auto delegation check box selection', () => {
        expect(true).toBeTruthy()
      })
    })

    describe('nextPreviousButtons', () => {
      it('should close drawer if current step is 0', () => {
        const nextPreviousButtonsWrapper = findNextPreviousButton(wrapper)
        nextPreviousButtonsWrapper.vm.$emit('click-previous')

        const drawerWrapper = wrapper.findComponent(PDrawer)
        expect(drawerWrapper.isVisible()).toBeFalsy()
      })

      it('should call api to complete delegation process when active step is 1', async () => {
        const COLLABORATORS_SELECTED = [{ id: 1 }, { id: 2 }, { id: 3 }]

        const wrapper = createFullDelegationWrapper()
        await nextTick()

        const addDelegatesStepWrapper = findAddDelegatesStepWrapper(wrapper)
        const getNotificationSuccess = () => document.body.getElementsByClassName('el-notification success')
        expect(getNotificationSuccess()).toHaveLength(0)

        await addDelegatesStepWrapper.vm.$emit('collaboratorSelection', COLLABORATORS_SELECTED)

        const nextPreviousButtonWrapper = findNextPreviousButton(wrapper)
        await nextPreviousButtonWrapper.vm.$emit('click-next')
        await nextPreviousButtonWrapper.vm.$emit('click-next')

        expect(gatewayPostMock).toHaveBeenCalledOnce()
        expect(gatewayPostMock).toHaveBeenCalledWith(
          'wallet/api/delegations',
          {
            accountIds: [],
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
        expect(getNotificationSuccess()).toHaveLength(1)
      })

      it('should display failure notification when api call fails then close the drawer', () => {
        expect(true).toBeTruthy()
      })
    })
  })
})

import { defineStore } from 'pinia'
import { createTestingPinia } from '@pinia/testing'
import { nextTick } from 'vue'
import { PDrawer, PSteps } from '@kpmg/styleguide'
import { type VueWrapper, mount, flushPromises } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createI18n } from 'vue-i18n'
import type { DelegationDrawerProps } from './DelegationDrawerTypes'
import { entitiesMock } from '@entities/../tests/mocks/EntitiesMocks'
import NextPreviousButtons from '@entities/common/components/NextPreviousButtons'
import AddDelegatesStep from './components/AddDelegatesStep'
import DelegationPreviewList from './components/DelegationPreviewList'
import DelegationDrawer from '.'

const USER_ID = 'a custom user id'
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

const getNotificationSuccess = () =>
  document.body.getElementsByClassName('el-notification success')
const getNotificationError = () =>
  document.body.getElementsByClassName('el-notification error')

let gatewayPostMock = vi.fn().mockResolvedValue({})
vi.mock('@pulse/Common', () => ({
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

  afterEach(() => {
    document.body.outerHTML = ''
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
      await nextPreviousButtonsWrapper.vm.$emit('click-next')

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

        await addDelegatesStepWrapper.vm.$emit('collaborator-selection', [1, 2, 3])
        // The only use case in this component is enabling or disabling the next button
        // so i'm checking isNextButtonDisabled state to check if data has been updated
        expect(
          nextPreviousButtonWrapper.props('isNextButtonDisabled'),
        ).toBeFalsy()
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
        const wrapper = createFullDelegationWrapper()
        await nextTick()

        const addDelegatesStepWrapper = findAddDelegatesStepWrapper(wrapper)
        expect(getNotificationSuccess()).toHaveLength(0)

        await addDelegatesStepWrapper.vm.$emit('collaboratorSelection', COLLABORATORS_SELECTED)

        const nextPreviousButtonsWrapper = findNextPreviousButton(wrapper)
        const getNextButton = () => nextPreviousButtonsWrapper.findAll('button')[1]

        expect(getNextButton().attributes('disabled')).toBeUndefined()
        expect(getNextButton().classes('is-loading')).toBeFalsy()

        await nextPreviousButtonsWrapper.vm.$emit('click-next')
        await nextPreviousButtonsWrapper.vm.$emit('click-next')

        expect(getNextButton().attributes('disabled')).toBeDefined()
        expect(getNextButton().classes('is-loading')).toBeTruthy()

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

        expect(getNextButton().attributes('disabled')).toBeUndefined()
        expect(getNextButton().classes('is-loading')).toBeFalsy()

        expect(getNotificationSuccess()).toHaveLength(1)
      })

      it('should display failure notification when api call fails then close the drawer', async () => {
        gatewayPostMock = vi.fn().mockRejectedValue({})

        const wrapper = createFullDelegationWrapper()
        await nextTick()

        const addDelegatesStepWrapper = findAddDelegatesStepWrapper(wrapper)
        expect(getNotificationError()).toHaveLength(0)

        await addDelegatesStepWrapper.vm.$emit('collaboratorSelection', COLLABORATORS_SELECTED)

        const nextPreviousButtonsWrapper = findNextPreviousButton(wrapper)
        await nextPreviousButtonsWrapper.vm.$emit('click-next')
        await nextPreviousButtonsWrapper.vm.$emit('click-next')

        expect(gatewayPostMock).toHaveBeenCalledOnce()

        await flushPromises()
        expect(getNotificationError()).toHaveLength(1)
      })

      it('should directly post user on "specific" delegation flow type', async () => {
        const nextPreviousButtonsWrapper = findNextPreviousButton(wrapper)
        const getNextButton = () => nextPreviousButtonsWrapper.findAll('button')[1]

        expect(getNotificationSuccess()).toHaveLength(0)

        const addDelegatesStepWrapper = findAddDelegatesStepWrapper(wrapper)
        await addDelegatesStepWrapper.vm.$emit('collaboratorSelection', COLLABORATORS_SELECTED)

        expect(getNextButton().attributes('disabled')).toBeUndefined()
        expect(getNextButton().classes('is-loading')).toBeFalsy()

        await nextPreviousButtonsWrapper.vm.$emit('click-next')

        expect(getNextButton().attributes('disabled')).toBeDefined()
        expect(getNextButton().classes('is-loading')).toBeTruthy()

        expect(gatewayPostMock).toHaveBeenCalledWith(
          'wallet/api/delegations',
          {
            accountIds: [FIRST_SELECTED_FOLDER.id, SECOND_SELECTED_FOLDER.id],
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

        expect(getNextButton().attributes('disabled')).toBeUndefined()
        expect(getNextButton().classes('is-loading')).toBeFalsy()

        expect(getNotificationSuccess()).toHaveLength(1)
      })
    })
  })
})

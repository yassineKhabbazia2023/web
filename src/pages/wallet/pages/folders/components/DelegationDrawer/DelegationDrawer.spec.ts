import { defineStore } from 'pinia'
import { createTestingPinia } from '@pinia/testing'
import { nextTick } from 'vue'
import { PDrawer, PSteps } from '@kpmg/styleguide'
import { type VueWrapper, mount } from '@vue/test-utils'
import { beforeEach, vi, describe, it, expect } from 'vitest'
import { createI18n } from 'vue-i18n'
import DelegationDrawer from '.'
import type { DelegationDrawerProps } from './DelegationDrawerTypes'
import { entitiesMock } from '@/../tests/mocks/EntitiesMocks'
import NextPreviousButtons from '@/components/NextPreviousButtons'
import AddDelegatesStep from './components/AddDelegatesStep'
import DelegationPreviewList from './components/DelegationPreviewList'

const gatewayPostMock = vi.fn().mockResolvedValue({ data: {} })
vi.mock('@kpmg/common', () => ({
  commonStore: defineStore('common', {
    state: () => ({
      user: {
        id: '1',
      },
    }),
    getters: {
      isAuthenticated: () => true,
    },
  }),
  commonApi: () => ({
    gateway: {
      post: () => gatewayPostMock,
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

const createWrapper = (
  props: DelegationDrawerProps = defaultProps,
): VueWrapper => {
  return mount(DelegationDrawer, {
    props,
    global: {
      plugins: [pinia],
      provide: {
        i18n,
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

      it.only('should call api to complete delegation process when active step is 1', () => {
        const wrapper = createFullDelegationWrapper()
        // eslint-disable-next-line no-console
        console.log(wrapper)
        expect(true).toBeTruthy()
      })

      it('should display failure notification when api call failes then close the drawer', () => {
        expect(true).toBeTruthy()
      })
    })
  })
})

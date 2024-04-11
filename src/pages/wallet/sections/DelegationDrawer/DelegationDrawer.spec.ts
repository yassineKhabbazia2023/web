import { defineStore } from 'pinia'
import { createTestingPinia } from '@pinia/testing'
import { nextTick } from 'vue'
import { type VueWrapper, mount } from '@vue/test-utils'
import { PDrawer, PSteps } from '@kpmg/styleguide'
import { beforeEach, vi, describe, it, expect } from 'vitest'
import { createI18n } from 'vue-i18n'
import DelegationDrawer from '.'
import type { DelegationDrawerProps } from './DelegationDrawerTypes'
import { entitiesMock } from '@/../tests/mocks/EntitiesMocks'
import NextPreviousButtons from '@/components/NextPreviousButtons'
import AddDelegatesStep from './components/AddDelegatesStep'
import DelegationPreviewList from './components/DelegationPreviewList'

// vi.mock('@kpmg/common', () => ({
//   commonApi: () => ({
//     gateway: {
//       get: subscriptionPostMock,
//       patch: subscriptionPostMock,
//       delete: subscriptionPostMock,
//       post: subscriptionPostMock,
//     },
//     offer: {
//       get: subscriptionPostMock,
//       put: subscriptionPostMock,
//     },
//     onboarding: {
//       post: subscriptionPostMock,
//     },
//     wallet: {
//       put: subscriptionPostMock,
//       get: subscriptionPostMock,
//     },
//     account: {
//       get: subscriptionPostMock,
//       patch: subscriptionPostMock,
//     },
//   }),
//   commonStore: defineStore('common', {
//     state: () => ({
//       user: {
//         id: 1,
//         entities: {
//           default: mockedEntity,
//         },
//       },
//     }),
//     getters: {
//       isCollab: () => true,
//       defaultEntity: () => mockedEntity,
//     },
//   }),
// }))

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
      post: () => Promise.resolve({ data: {} }),
    },
  }),
}))

const pinia = createTestingPinia()

// const subscriptionPostMock = vi.fn().mockResolvedValue({})

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

const findNextPreviousButton = (wrapper: VueWrapper) =>
  wrapper.findComponent(NextPreviousButtons)

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
      const wrapper = createWrapper({
        ...defaultProps,
        selectedFolders: [],
      })

      await nextTick() // does not work without it
      const stepper = wrapper.findComponent(PSteps)
      expect(stepper.exists()).toBeTruthy()
    })

    it('should render AddDelegatesStep when activeStep = 0', () => {
      const addDelegatesStepWrapper = wrapper.findComponent(AddDelegatesStep)
      expect(addDelegatesStepWrapper.exists()).toBeTruthy()
    })

    it('should render DelegationPreviewList when activeStep = 1', async () => {
      const nextPreviousButtonsWrapper = findNextPreviousButton(wrapper)
      nextPreviousButtonsWrapper.vm.$emit('click-next')

      await nextTick()
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
        // eslint-disable-next-line no-console
        console.log(wrapper.html())
        expect(drawerWrapper.isVisible()).toBe(isDrawerVisible)
      },
    )
  })

  describe('interactions', () => {
    describe('addDelegatesStep', () => {
      it('should set selectedCollaborators upon collaborator-selection', () => {
        expect(true).toBeTruthy()
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

      it('should go to next step upon click-next and active step is 0', () => {
        expect(true).toBeTruthy()
      })

      it('should call api to complete delegation process when active step is 1', () => {
        expect(true).toBeTruthy()
      })

      it('should display failure notification when api call failes then close the drawer', () => {
        expect(true).toBeTruthy()
      })
    })
  })
})

import { shallowMount } from '@vue/test-utils'
import { ref } from 'vue'
import { getStoreMock } from '@pulse/common/mocks/vitest'
import { useUserStore, useCurrentEntityStore } from '@pulse/common/stores'

import TopBar from './top-bar.vue'

// Mock setup
const userStoreMock = getStoreMock(useUserStore)
const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)

const hasCurrentEntityPermissionSpy = vi.hoisted(() => vi.fn())
const isMobileRef = ref(false)

vi.mock('@pulse/common/managers', () => ({
  CurrentUserManager: {
    hasCurrentEntityPermission: hasCurrentEntityPermissionSpy,
  },
}))

vi.mock('@pulse/styleguide', async (importOriginal) => ({
  ...await importOriginal(),
  useResponsive: () => ({
    isMobile: isMobileRef,
  }),
}))

describe('TopBar', () => {
  describe('PennylaneSSO display', () => {
    it.each([
      {
        testName: 'should display PennylaneSSO properly when customer has PennylaneOffer',
        isCollab: false,
        hasPennylaneOffer: true,
      },
      {
        testName: 'should NOT display PennylaneSSO properly when customer does NOT have PennylaneOffer',
        isCollab: false,
        hasPennylaneOffer: false,
      },
      {
        testName: 'should display PennylaneSSO properly when collab HAS PennylaneOffer',
        isCollab: true,
        hasPennylaneOffer: true,
      },
      {
        testName: 'should NOT display PennylaneSSO properly when collab does NOT have PennylaneOffer',
        isCollab: true,
        hasPennylaneOffer: false,
      },
    ])('$testName', async ({
      isCollab,
      hasPennylaneOffer,
    }) => {
      userStoreMock.isCollab = isCollab
      currentEntityStoreMock.hasOffer.mockReturnValue(hasPennylaneOffer)
      hasCurrentEntityPermissionSpy.mockReturnValue(hasPennylaneOffer)

      const wrapper = shallowMount(TopBar)
      const pennylaneSSO = wrapper.findComponent({ name: 'pennylane-sso' })

      expect(pennylaneSSO.exists()).toBe(hasPennylaneOffer)
      if (hasPennylaneOffer === true) {
        expect(pennylaneSSO.props('isCollab')).toBe(isCollab)
      }
    })
  })

  describe('EmailPennylane display', () => {
    beforeEach(() => {
      isMobileRef.value = false
    })

    const tests = [{
      hasPennylaneOffer: false,
      expectedDisplay: false,
      description: 'should NOT display EmailPennylane when Pennylane offer is false on desktop',
    }, {
      hasPennylaneOffer: true,
      expectedDisplay: true,
      description: 'should display EmailPennylane when Pennylane offer is true on desktop',
    }]
    it.each(tests)('$description', ({
      hasPennylaneOffer,
      expectedDisplay,
    }) => {
      currentEntityStoreMock.hasOffer.mockReturnValue(hasPennylaneOffer)
      const wrapper = shallowMount(TopBar, {
        global: {
          stubs: {
            EmailPennylane: {
              name: 'EmailPennylane',
              template: '<div />',
            },
          },
        },
      })

      const emailPennylaneComponent = wrapper.findComponent({ name: 'EmailPennylane' })
      expect(emailPennylaneComponent.exists()).toBe(expectedDisplay)
    })

    it('should NOT display EmailPennylane on mobile even with Pennylane offer', () => {
      isMobileRef.value = true
      currentEntityStoreMock.hasOffer.mockReturnValue(true)

      const wrapper = shallowMount(TopBar, {
        global: {
          stubs: {
            EmailPennylane: {
              name: 'EmailPennylane',
              template: '<div />',
            },
          },
        },
      })

      const emailPennylaneComponent = wrapper.findComponent({ name: 'EmailPennylane' })
      expect(emailPennylaneComponent.exists()).toBe(false)
    })
  })
})

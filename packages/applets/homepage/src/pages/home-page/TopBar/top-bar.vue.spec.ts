import { shallowMount } from '@vue/test-utils'
import type { MockInstance } from 'vitest'
import { getStoreMock, isMobileMockRef } from '@pulse/common/mocks/vitest'
import { useUserStore, useCurrentEntityStore } from '@pulse/common/stores'
import { CurrentUserManager } from '@pulse/common/managers'

import TopBar from './top-bar.vue'

// Mock setup
const userStoreMock = getStoreMock(useUserStore)
const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)

let hasCurrentEntityPermissionMock: MockInstance
// The styleguide useResponsive is hub-mocked worker-wide onto this shared ref
// (doctrine: shared-hubs).
const isMobileRef = isMobileMockRef

// isMobileMockRef is a plain worker-shared ref: mockReset does not touch it, so
// a test leaving it true would leak mobile mode to the next file (doctrine: shared-dom).
afterEach(() => {
  isMobileRef.value = false
})

describe('TopBar', () => {
  beforeEach(() => {
    isMobileRef.value = false
    hasCurrentEntityPermissionMock = vi.spyOn(CurrentUserManager, 'hasCurrentEntityPermission').mockReturnValue(false)
  })

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
      hasCurrentEntityPermissionMock.mockReturnValue(hasPennylaneOffer)

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

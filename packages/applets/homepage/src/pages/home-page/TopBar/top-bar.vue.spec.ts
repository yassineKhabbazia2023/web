import { shallowMount } from '@vue/test-utils'
import { ref } from 'vue'
import { getStoreMock } from '@pulse/common/mocks/vitest'
import { useUserStore, useCurrentEntityStore } from '@pulse/common/stores'

import TopBar from './top-bar.vue'

// Mock setup
const userStoreMock = getStoreMock(useUserStore)
const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)

const hasCurrentEntityPermissionSpy = vi.hoisted(() => vi.fn())
const hasPennylaneAccountingGedV2PermissionSpy = vi.hoisted(() => vi.fn())
const isMobileRef = ref(false)

vi.mock('@pulse/common/managers', () => ({
  CurrentUserManager: {
    hasCurrentEntityPermission: hasCurrentEntityPermissionSpy,
  },
  PennylanePermissionsManager: {
    hasPennylaneAccountingGedV2Permission: hasPennylaneAccountingGedV2PermissionSpy,
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
      hasPennylaneAccountingGedV2PermissionMock: true,
      description: 'should display EmailPennylane when hasPennylaneAccountingGedV2Permission is true on desktop',
    }, {
      hasPennylaneAccountingGedV2PermissionMock: false,
      description: 'should NOT display EmailPennylane when hasPennylaneAccountingGedV2Permission is false',
    }]
    it.each(tests)('$description', ({
      hasPennylaneAccountingGedV2PermissionMock,
    }) => {
      hasPennylaneAccountingGedV2PermissionSpy.mockReturnValue(hasPennylaneAccountingGedV2PermissionMock)
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
      expect(emailPennylaneComponent.exists()).toBe(hasPennylaneAccountingGedV2PermissionMock)
    })

    it('should NOT display EmailPennylane on mobile even with permission', () => {
      isMobileRef.value = true
      hasPennylaneAccountingGedV2PermissionSpy.mockReturnValue(true)

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

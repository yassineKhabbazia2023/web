import { shallowMount } from '@vue/test-utils'
import { getStoreMock } from '@pulse/common/mocks'
import { useUserStore, useSelectedEntityStore } from '@pulse/common/stores'

import TopBar from './top-bar.vue'

// Mock setup
const userStoreMock = getStoreMock(useUserStore)
const selectedEntityStoreMock = getStoreMock(useSelectedEntityStore)

const hasSelectedEntityPermissionSpy = vi.hoisted(() => vi.fn())
const hasPennylaneAccountingGedV2PermissionSpy = vi.hoisted(() => vi.fn())

vi.mock('@pulse/common/managers', () => ({
  CurrentUserManager: {
    hasSelectedEntityPermission: hasSelectedEntityPermissionSpy,
  },
  PennylanePermissionsManager: {
    hasPennylaneAccountingGedV2Permission: hasPennylaneAccountingGedV2PermissionSpy,
  },
}))

describe('TopBar', () => {
  describe('PennylaneSSO display', async () => {
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
      selectedEntityStoreMock.hasOffer.mockReturnValue(hasPennylaneOffer)
      hasSelectedEntityPermissionSpy.mockReturnValue(hasPennylaneOffer)

      const wrapper = shallowMount(TopBar)
      const pennylaneSSO = wrapper.findComponent({ name: 'pennylane-sso' })

      expect(pennylaneSSO.exists()).toBe(hasPennylaneOffer)
      if (hasPennylaneOffer === true) {
        expect(pennylaneSSO.props('isCollab')).toBe(isCollab)
      }
    })
  })

  describe('EmailPennylane display', async () => {
    const tests = [{
      hasPennylaneAccountingGedV2PermissionMock: true,
      description: 'should display EmailPennylane when hasPennylaneAccountingGedV2Permission is true',
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
  })
})

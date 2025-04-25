import { vi, it, describe, expect, beforeEach, type Mock } from 'vitest'
import '@entities/__mocks__/common.import.mocks'
import { authorizationServiceMock } from '@entities/__mocks__/authorization.service.mocks'
import { loggerErrorSpy, loggerMock } from '@pulse/core/mocks'
import { mockedAuthorizationsConfig } from '@entities/__mocks__/permissions.mock'
import { mockedAccountId } from '@entities/__mocks__/account.mocks'
import { mockedContactId } from '@entities/__mocks__/contact.mocks'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import type { RightsListProps } from './RightsListTypes'
import * as authorizationServices from '@entities/services/authorization'
import { useRoute } from 'vue-router'
import RightsList from '.'
import { ContactType } from '@pulse/common/enums'

// Mocks
const mockedActionsCount = mockedAuthorizationsConfig
  .map(({ actions }) => actions)
  .reduce((accum, actions) => accum + actions.length, 0)
const mockedUseRoute = useRoute as Mock

vi.mock('@entities/services/authorization', () => authorizationServiceMock)
vi.mock('@pulse/core', () => ({ logger: loggerMock }))
vi.mock('vue-router')

// Expectations
const expectedRightsNote =
  'Activate or deactivate the features you want to give for this user.'

const createWrapper = (overrideProps?: RightsListProps): VueWrapper<any> => {
  return mount(RightsList, {
    props: {
      ...overrideProps,
      modelValue: {},
      contactId: mockedContactId,
    },
    global: {
      stubs: {
        PSwitch: {
          name: 'PSwitch',
          template: '<button></button>',
          props: ['modelValue'],
          emits: ['update:modelValue'],
        },
        PCheckboxGroup: {
          name: 'PCheckboxGroup',
          template: '<div><slot /></div>',
          props: ['modelValue'],
          emits: ['update:modelValue'],
        },
        PCheckbox: {
          name: 'PCheckbox',
          template: '<div><slot /></div>',
        },
      },
    },
  })
}

// Helpers
const getNthAuthorizationCategory = (
  wrapper: VueWrapper<any>,
  position: number = 0,
) =>
  wrapper.findAllComponents({
    name: 'PSwitch',
  })[position]

const getNthAuthorizationActionsGroup = (
  wrapper: VueWrapper<any>,
  position: number = 0,
) =>
  wrapper.findAllComponents({
    name: 'PCheckboxGroup',
  })[position]

describe('rightsList', () => {
  let wrapper: VueWrapper<any>
  beforeEach(async () => {
    mockedUseRoute.mockReturnValue({
      params: {
        id: mockedAccountId,
      },
    })
    wrapper = createWrapper()
    await flushPromises()
  })
  describe('display', () => {
    it('should display correctly the rights note', () => {
      const rightsNote = wrapper.find('[data-testid=rights-list-note]')

      expect(rightsNote.text()).toStrictEqual(expectedRightsNote)
    })
    it('should display the list of rights, including the active categories and corresponding actions', () => {
      const authorizationCategories = wrapper.findAllComponents({
        name: 'PSwitch',
      })
      const authorizationActions = wrapper.findAllComponents({
        name: 'PCheckbox',
      })
      const authorizationActionsGroup = wrapper.findAllComponents({
        name: 'PCheckboxGroup',
      })

      let countActiveAuthorizationCategories = 0
      authorizationCategories.forEach((authCategroy) => {
        if (authCategroy.props('modelValue')) {
          ++countActiveAuthorizationCategories
        }
      })

      let countEnabledAuthorizationActions = 0
      authorizationActionsGroup.forEach((authActionsGroup) => {
        countEnabledAuthorizationActions +=
          authActionsGroup.props('modelValue').length
      })

      expect(countActiveAuthorizationCategories).toBe(2)
      expect(countEnabledAuthorizationActions).toBe(3)
      expect(authorizationCategories).toHaveLength(
        mockedAuthorizationsConfig.length,
      )
      expect(authorizationActionsGroup).toHaveLength(
        mockedAuthorizationsConfig.length,
      )
      expect(authorizationActions).toHaveLength(mockedActionsCount)
    })
  })
  describe('events', () => {
    it("should emit 'update:modelValue' when the switch state changes to 'off' and uncheck all actions", async () => {
      const authorizationCategory = getNthAuthorizationCategory(wrapper)
      const authorizationActionsGroup = getNthAuthorizationActionsGroup(wrapper)

      expect(authorizationActionsGroup.props('modelValue')).toHaveLength(2)

      await authorizationCategory.vm.$emit('update:modelValue', false)

      expect(authorizationActionsGroup.props('modelValue')).toHaveLength(0)
      expect(authorizationCategory.emitted('update:modelValue')).toStrictEqual([
        [false],
      ])
    })
    it("should emit 'update:modelValue' when the checkbox group is empty and change the switch to 'off'", async () => {
      const authorizationCategory = getNthAuthorizationCategory(wrapper)
      const authorizationActionsGroup = getNthAuthorizationActionsGroup(wrapper)

      expect(authorizationCategory.props('modelValue')).toBeTruthy()

      await authorizationActionsGroup.vm.$emit('update:modelValue', [])

      expect(authorizationCategory.props('modelValue')).toBeFalsy()
      expect(
        authorizationActionsGroup.emitted('update:modelValue'),
      ).toStrictEqual([[[]]])
    })
    it("should change the category switch to 'on' when at least one action is checked", async () => {
      const authorizationCategory = getNthAuthorizationCategory(wrapper, 2)
      const authorizationActionsGroup = getNthAuthorizationActionsGroup(
        wrapper,
        2,
      )

      expect(authorizationCategory.props('modelValue')).toBeFalsy()

      await authorizationActionsGroup.vm.$emit('update:modelValue', [
        'COINFO001',
      ])

      expect(authorizationCategory.props('modelValue')).toBeTruthy()
      expect(
        authorizationActionsGroup.emitted('update:modelValue'),
      ).toStrictEqual([[['COINFO001']]])
    })
    it('should check all actions when the category switch is turned on', async () => {
      const authorizationCategory = getNthAuthorizationCategory(wrapper, 2)
      const authorizationActionsGroup = getNthAuthorizationActionsGroup(
        wrapper,
        2,
      )

      expect(authorizationActionsGroup.props('modelValue')).toStrictEqual([])

      await authorizationCategory.vm.$emit('update:modelValue', true)

      expect(authorizationActionsGroup.props('modelValue')).toStrictEqual([
        'COINFO001',
      ])
      expect(authorizationCategory.emitted('update:modelValue')).toStrictEqual([
        [true],
      ])
    })
    it("should emit 'update:modelValue' when the authorization state changes", () => {
      const authState = {
        CLTGESTION: { actions: ['CLUSER001', 'CLUSER002'], isActive: true },
        COLADMIN: { actions: ['COADMI001'], isActive: true },
        COLMIRROIR: { actions: ['COINFO001'], isActive: true },
      }
      wrapper.vm.internalAuthorizationState = authState

      expect(wrapper.emitted('update:modelValue')?.at(1)).toStrictEqual([authState])
    })
    it('should call the auth API with the correct parameters to fetch the authorization configuration', () => {
      const spyFetchAuthorizationsConfig = vi.spyOn(
        authorizationServices,
        'fetchAuthorizationsConfig',
      )
      const spyFetchAccountAuthorizationsConfig = vi.spyOn(
        authorizationServices,
        'fetchAccountAuthorizationsConfig',
      )
      createWrapper({
        modelValue: {},
        contactId: mockedContactId,
      })

      expect(spyFetchAuthorizationsConfig).toHaveBeenCalledOnce()
      expect(spyFetchAccountAuthorizationsConfig).not.toHaveBeenCalled()
      expect(spyFetchAuthorizationsConfig).toHaveBeenCalledWith(
        mockedContactId,
        mockedAccountId,
      )
    })
    it('should call the auth API with the correct params to retrieve the account authorization configuration', () => {
      const spyFetchAccountAuthorizationsConfig = vi.spyOn(
        authorizationServices,
        'fetchAccountAuthorizationsConfig',
      )
      createWrapper({
        isAccountRights: true,
        modelValue: {},
        accountId: mockedAccountId,
        contactType: ContactType.COLLABORATOR,
      })

      expect(spyFetchAccountAuthorizationsConfig).toHaveBeenCalledOnce()
      expect(spyFetchAccountAuthorizationsConfig).toHaveBeenCalledWith(
        mockedAccountId,
        ContactType.COLLABORATOR,
      )
    })
    it('should call the auth API with accountID set to null if there is no accountId in the route parameters', () => {
      const spyFetchAuthorizationsConfig = vi.spyOn(
        authorizationServices,
        'fetchAuthorizationsConfig',
      )
      mockedUseRoute.mockReturnValue({
        params: {
          id: undefined,
        },
      })
      createWrapper()

      expect(spyFetchAuthorizationsConfig).toHaveBeenCalledOnce()
      expect(spyFetchAuthorizationsConfig).toHaveBeenCalledWith(
        mockedContactId,
        null,
      )
    })
    it('should display a console error if the request to fetch authorizations config fails', async () => {

      const expectedErrorMessage = 'API Error: 503 Service Unavailable'
      vi.spyOn(
        authorizationServices,
        'fetchAuthorizationsConfig',
      ).mockRejectedValue(expectedErrorMessage)
      createWrapper()
      await flushPromises()

      expect(loggerErrorSpy).toHaveBeenCalledOnce()
      expect(loggerErrorSpy).toHaveBeenCalledWith(
        'Unable to fetch authorizations config: ',
        expectedErrorMessage,
      )
    })
  })
})

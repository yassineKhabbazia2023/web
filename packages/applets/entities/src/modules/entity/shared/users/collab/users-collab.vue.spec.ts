import { flushPromises, shallowMount, type VueWrapper } from '@vue/test-utils'
import { getMockedOperations } from '@entities/__mocks__/operations.mocks'
import { armRegistryServiceMocks, fetchOperationsForAccountMock } from '@entities/__mocks__/vitest'
import { getMockedCustomersCollab } from '@entities/__mocks__/contact.mocks'
import { dataFromApi } from '@entities/__mocks__/api.mocks'
import { fetchAccountCustomers } from '@entities/services/wallet'
import { getMockedAccount } from '@entities/__mocks__/account-row.mocks'
import { nextTick } from 'vue'
import { UserActions, TrackingLocalisation } from '@entities/enums'
import type { PToolboxItemProps } from '@pulse/styleguide/types'
import { getMockedEntity, getMockedUser, getMockedEntitySummary } from '@pulse/common/mocks'
import { getStoreMock } from '@pulse/common/mocks/vitest'
import { armCurrentUserPermissions } from '@pulse/common/mocks/vitest/current-user.permissions.helper'
import type { MockInstance } from 'vitest'
import { useUserStore, useCurrentEntityStore } from '@pulse/common/stores'
import { useRoute, useRouter } from 'vue-router'
import type { RouteLocationNormalizedLoaded, Router } from 'vue-router'
import { getPendingOperations } from '../utils/operations.utils'
import { AccountType, RouteName, RouteParam } from '@pulse/common/enums'

import UsersCollab from './users-collab.vue'
import { useAccountSignatories } from './account-signatories.composable'

const userStoreMock = getStoreMock(useUserStore)
const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)

const DEFAULT_ROUTE_PARAMS_ID = 5

const mockedCustomersCollab = getMockedCustomersCollab()
const mockedUser = {
  ...dataFromApi.data.items[0],
  fullName: "Johnny's Pizza",
  initials: 'JP',
}

const MOCKED_USER = {
  contactId: mockedCustomersCollab[0].contactId,
  firstName: mockedCustomersCollab[0].firstName,
  lastName: mockedCustomersCollab[0].lastName,
  fullName: `${mockedCustomersCollab[0].firstName} ${mockedCustomersCollab[0].lastName}`,
  email: mockedCustomersCollab[0].email,
  personaName: mockedCustomersCollab[0].personaName,
  creationDate: mockedCustomersCollab[0].creationDate,
  status: {
    text: 'statusDeclared',
    iconName: 'patchCheck',
    color: 'gray',
  },
}

const mockedAccount = getMockedAccount()

const composableMocks = {
  loadAccountSignatories: vi.fn(() => Promise.resolve()),
  getSignatoryToolboxItems: vi.fn((): PToolboxItemProps[] => []),
  handleSignatoryAction: vi.fn(() => false),
}

const routeMock = {
  name: '' as string,
  params: {} as Record<string, number>,
}

const userMock = getMockedUser({ id: 2 })
const currentEntityMock = getMockedEntity({ accountId: mockedAccount.accountId })
const entitySummaryMock = getMockedEntitySummary(currentEntityMock)

let hasPermissionMock: MockInstance

beforeEach(() => {
  armRegistryServiceMocks()
  hasPermissionMock = armCurrentUserPermissions(false)
  vi.mocked(useAccountSignatories).mockReturnValue(composableMocks)
  vi.mocked(useRoute).mockImplementation(() => routeMock as unknown as RouteLocationNormalizedLoaded)
  vi.mocked(useRouter).mockReturnValue({
    go: vi.fn(),
  } as unknown as Router)
})

const createWrapper = (): VueWrapper<any> =>
  shallowMount(UsersCollab, {
    global: {
      stubs: {
        FormSearch: true,
        ManageAccessDrawerUnitary: true,
        ManageRightsDrawer: true,
        NoResult: true,
        PAvatar: true,
        PIcon: true,
        PLoader: true,
        PNotification: true,
        PToolbox: true,
        RemoveUserDialog: true,
        PButton: {
          name: 'PButton',
          template: '<button><slot /></button>',
          props: ['pDisabled', 'pLoading'],
        },
        AddCustomerDrawer: {
          name: 'AddCustomerDrawer',
          template: '<div></div>',
          props: ['modelValue', 'targetEntityId', 'targetEntityName', 'targetEntityNumber', 'targetEntityAccountType'],
          events: ['refresh-customers-list'],
        },
        PTable: {
          name: 'PTable',
          template: '<div class="el-table__row"><slot /></div>',
          props: ['pData'],
        },
        PTableColumn: {
          name: 'PTableColumn',
          template: '<div><slot :row="row" /></div>',
          data() {
            const row = MOCKED_USER

            return {
              row,
            }
          },
        },
      },
    },
  })

let wrapper: VueWrapper<any>

// Returned by the mocked composable to verify the component prepends it to the toolbox
const signatoryToolboxItem: PToolboxItemProps = {
  pIconName: 'patchCheck',
  pValue: 'Designate as signatory',
  pActionName: 'assignSignatory',
  pState: 'default',
}

const modifyToolboxItem: PToolboxItemProps = {
  pIconName: 'pencilSquare',
  pValue: 'modifyRights',
  pActionName: 'modifyRights',
  pState: 'default',
}

const removeUserToolboxItem: PToolboxItemProps = {
  pIconName: 'personRemove',
  pValue: 'removeUser',
  pActionName: 'removeUser',
  pState: 'default',
}

describe('usersCollab', () => {
  beforeEach(async () => {
    routeMock.name = RouteName.USERS
    routeMock.params = { [RouteParam.ENTITY_ID]: DEFAULT_ROUTE_PARAMS_ID }

    // Reset API mocks
    vi.mocked(fetchAccountCustomers).mockResolvedValue({
      items: mockedCustomersCollab as any,
      totalItems: mockedCustomersCollab.length,
      currentPage: 1,
      totalPages: 1,
    })

    userStoreMock.user = userMock
    currentEntityStoreMock.currentEntity = entitySummaryMock
    // Reset account type to regular (prospect-specific tests override it)
    currentEntityStoreMock.currentAccountType = AccountType.REGULAR
    hasPermissionMock.mockReturnValue(false)
    // Reset the signatory composable mock between tests
    composableMocks.getSignatoryToolboxItems.mockReturnValue([])
    composableMocks.handleSignatoryAction.mockClear()
    composableMocks.loadAccountSignatories.mockClear()
    wrapper = createWrapper()
    await flushPromises()
  })
  describe('events', () => {
    it('should NOT display add user button when user does NOT have permission', () => {
      expect(wrapper.find('[data-testid="add-customer-button"]').exists()).toBe(false)
    })

    it('should display add user button when user has permission', async () => {
      hasPermissionMock.mockReturnValue(true)
      wrapper = createWrapper()
      await flushPromises()
      expect(wrapper.find('[data-testid="add-customer-button"]').exists()).toBe(true)
    })

    it('should display the AddCustomerDrawer when the add customer button is clicked', async () => {
      hasPermissionMock.mockReturnValue(true)
      wrapper = createWrapper()
      await flushPromises()

      const addCustomerButton = wrapper.find('[data-testid="add-customer-button"]')
      await addCustomerButton.trigger('click')
      await nextTick()

      const addCustomerDrawer = wrapper.findComponent({ name: 'AddCustomerDrawer' })
      expect(addCustomerDrawer.exists()).toBe(true)
      expect(addCustomerDrawer.props('modelValue')).toBe(true)
    })

    it('should call fetchAccountCustomers on refresh-customers-list event from drawer', async () => {
      hasPermissionMock.mockReturnValue(true)
      wrapper = createWrapper()
      await flushPromises()

      const addCustomerButton = wrapper.find('[data-testid="add-customer-button"]')
      await addCustomerButton.trigger('click')
      await nextTick()

      const addCustomerDrawer = wrapper.findComponent({ name: 'AddCustomerDrawer' })
      addCustomerDrawer.vm.$emit('refresh-customers-list')

      expect(fetchAccountCustomers).toHaveBeenCalled()
    })

    it("should display the 'Modify Rights' drawer when the 'Modify Rights' action is clicked", async () => {
      await wrapper.vm.handleUserAction('modifyRights', mockedUser)
      const manageRightsDrawer = wrapper.findComponent({ name: 'ManageRightsDrawer' })

      expect(manageRightsDrawer.exists()).toBeTruthy()
      expect(manageRightsDrawer.props('modelValue')).toBeTruthy()
      expect(manageRightsDrawer.props('selectedUser')).toMatchObject(mockedUser)
    })

    it("should display the 'Manage Access' drawer when the 'Manage Access' button is clicked", async () => {
      hasPermissionMock.mockReturnValue(true)
      const operationsMock = getMockedOperations()
      fetchOperationsForAccountMock.mockResolvedValue(operationsMock)

      const expectedPendingOperations = getPendingOperations(operationsMock)
      const accountNumber = expectedPendingOperations?.at(0)?.accountNumber
      const accountOperationsListMock = [{
        accountName: '',
        accountNumber,
        operations: expectedPendingOperations,
      }]

      const expectedPropsBefore = {
        trackingLocalisation: TrackingLocalisation.ENTITY,
        modelValue: false,
        accountOperationsList: accountOperationsListMock,
        currentEntity: entitySummaryMock,
      }
      const expectedPropsAfter = {
        ...expectedPropsBefore,
        modelValue: true,
        accountOperationsList: accountOperationsListMock,
      }

      const wrapper = createWrapper()
      await flushPromises()
      const manageAccessDrawerUnitary = wrapper.findComponent({ name: 'ManageAccessDrawerUnitary' })
      const manageAccessButton = wrapper.find('[data-testid="manage-access-button"]')

      expect(manageAccessDrawerUnitary.props()).toStrictEqual(expectedPropsBefore)
      await manageAccessButton.trigger('click')
      await nextTick()

      expect(manageAccessDrawerUnitary.props()).toStrictEqual(expectedPropsAfter)
      const accountOperationsList = manageAccessDrawerUnitary.props('accountOperationsList')
      expect(manageAccessDrawerUnitary.props('modelValue')).toBe(true)
      expect(accountOperationsList.at(0).operations)
        .toHaveLength(expectedPendingOperations.length)
    })

    it('should initialize the signatory composable with a refreshUsers callback', () => {
      expect(useAccountSignatories).toHaveBeenCalledWith({ refreshUsers: expect.any(Function) })
    })

    it('should load the account signatories on mount when assignment is allowed', async () => {
      hasPermissionMock.mockReturnValue(true)
      currentEntityStoreMock.currentAccountType = AccountType.REGULAR
      wrapper = createWrapper()
      await flushPromises()

      expect(composableMocks.loadAccountSignatories).toHaveBeenCalled()
    })

    it('should NOT load the account signatories on mount for a prospect entity', async () => {
      hasPermissionMock.mockReturnValue(true)
      currentEntityStoreMock.currentAccountType = AccountType.PROSPECT
      wrapper = createWrapper()
      await flushPromises()

      expect(composableMocks.loadAccountSignatories).not.toHaveBeenCalled()
    })

    it('should delegate signatory actions to the composable', async () => {
      await wrapper.vm.handleUserAction('assignSignatory', mockedUser)

      expect(composableMocks.handleSignatoryAction).toHaveBeenCalledWith('assignSignatory', mockedUser)
    })

    it('should prepend the signatory toolbox items when assignment is allowed', async () => {
      composableMocks.getSignatoryToolboxItems.mockReturnValue([signatoryToolboxItem])
      hasPermissionMock.mockReturnValue(true)
      const wrapper = createWrapper()
      await flushPromises()

      wrapper.vm.handleToolboxClick(mockedCustomersCollab[1])
      await nextTick()

      expect(wrapper.vm.toolboxItems).toStrictEqual([
        signatoryToolboxItem,
        modifyToolboxItem,
        removeUserToolboxItem,
      ])
    })

    it('should NOT include signatory toolbox items for a prospect entity', async () => {
      composableMocks.getSignatoryToolboxItems.mockReturnValue([signatoryToolboxItem])
      hasPermissionMock.mockReturnValue(true)
      currentEntityStoreMock.currentAccountType = AccountType.PROSPECT
      const wrapper = createWrapper()
      await flushPromises()

      wrapper.vm.handleToolboxClick(mockedCustomersCollab[1])
      await nextTick()

      expect(wrapper.vm.toolboxItems).toStrictEqual([modifyToolboxItem, removeUserToolboxItem])
    })

    it('should show both "modify rights" and "remove user" actions for a prospect entity user', async () => {
      currentEntityStoreMock.currentAccountType = AccountType.PROSPECT
      hasPermissionMock.mockReturnValue(true)
      wrapper = createWrapper()
      await flushPromises()

      wrapper.vm.handleToolboxClick(mockedCustomersCollab[0])
      await nextTick()

      expect(wrapper.vm.toolboxItems).toStrictEqual([modifyToolboxItem, removeUserToolboxItem])
    })

    it('should hide the actions menu entirely for a prospect user without the remove permission', async () => {
      currentEntityStoreMock.currentAccountType = AccountType.PROSPECT
      hasPermissionMock.mockReturnValue(false)
      wrapper = createWrapper()
      await flushPromises()

      expect(wrapper.findComponent({ name: 'PToolbox' }).exists()).toBe(false)
    })

    it('when click on REMOVE_USER action', async () => {
      hasPermissionMock.mockReturnValue(true)
      const wrapper = createWrapper()
      await flushPromises()

      const expectedRemoveUserDialogProps = {
        isCollab: true,
        modelValue: true,
        userToRemove: MOCKED_USER,
      }

      const removeUserDialogBefore = wrapper.findComponent({ name: 'RemoveUserDialog' })
      expect(removeUserDialogBefore.exists()).toBeFalsy()

      const pToolbox = wrapper.findComponent({ name: 'PToolbox' })

      expect(pToolbox.exists()).toBeTruthy()
      pToolbox.vm.$emit('p-toolbox-item-clicked', UserActions.REMOVE_USER)
      await nextTick()

      const removeUserDialogAfter = wrapper.findComponent({ name: 'RemoveUserDialog' })
      expect(removeUserDialogAfter.exists()).toBeTruthy()
      expect(removeUserDialogAfter.props()).toStrictEqual(expectedRemoveUserDialogProps)

      expect(fetchAccountCustomers).toHaveBeenCalledTimes(2)
    })

    it('when click on REMOVE_USER action and close RemoveUserDialog after removed user', async () => {
      hasPermissionMock.mockReturnValue(true)
      const wrapper = createWrapper()
      await flushPromises()

      const expectedRemoveUserDialogProps = {
        isCollab: true,
        modelValue: false,
        userToRemove: MOCKED_USER,
      }

      const pToolbox = wrapper.findComponent({ name: 'PToolbox' })

      expect(pToolbox.exists()).toBeTruthy()
      pToolbox.vm.$emit('p-toolbox-item-clicked', UserActions.REMOVE_USER)
      await nextTick()

      const removeUserDialogAfter = wrapper.findComponent({ name: 'RemoveUserDialog' })

      removeUserDialogAfter.vm.$emit('user-removed')
      removeUserDialogAfter.vm.$emit('update:modelValue', false)
      await nextTick()

      const removeUserDialogWhenClosed = wrapper.findComponent({ name: 'RemoveUserDialog' })
      expect(removeUserDialogWhenClosed.props()).toStrictEqual(expectedRemoveUserDialogProps)

      expect(fetchAccountCustomers).toHaveBeenCalledTimes(3)
    })
  })
})

import { flushPromises, shallowMount, type VueWrapper } from '@vue/test-utils'
import { getMockedOperations } from '@entities/__mocks__/operations.mocks'
import { contactServiceMock } from '@entities/__mocks__/contact.service.mocks'
import { walletServiceMock } from '@entities/__mocks__/wallet.service.mocks'
import { getMockedCustomersCollab } from '@entities/__mocks__/contact.mocks'
import { dataFromApi } from '@entities/__mocks__/api.mocks'
import { fetchAccountCustomers } from '@entities/services/wallet'
import { updateSignatoryStatus } from '@entities/services/account'
import { getMockedAccount } from '@entities/__mocks__/account-row.mocks'
import { nextTick } from 'vue'
import { UserActions } from '@entities/modules/entity/enums'
import type { PToolboxItemProps } from '@pulse/styleguide/types'
import {
  CurrentUserManagerMock,
  hasPermissionMock,
  getStoreMock,
  getMockedEntity,
  getMockedUser,
  getMockedEntitySummary,
} from '@pulse/common/mocks'
import { useUserStore, useSelectedEntityStore } from '@pulse/common/stores'
import { getPendingOperations } from '@entities/modules/entity/utils/operation.utils'
import { TrackingLocalisation } from '@entities/enums'
import { RouteName, RouteParam } from '@pulse/common/enums'

import UsersCollab from '.'

const userStoreMock = getStoreMock(useUserStore)
const selectedEntityStoreMock = getStoreMock(useSelectedEntityStore)

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

vi.mock('@entities/services/contact', () => contactServiceMock)
vi.mock('@entities/services/wallet', () => walletServiceMock)

const apiMocks = vi.hoisted(() => ({
  singleAccountSignatory: vi.fn(() => Promise.resolve([
    mockedCustomersCollab[0],
  ])),
  multipleAccountSignatories: vi.fn(() => Promise.resolve([
    mockedCustomersCollab[0],
    mockedCustomersCollab[1],
  ])),
}))

vi.mock('@entities/services/account', () => {
  return {
    updateSignatoryStatus: vi.fn(() => Promise.resolve({})),
    getAccountSignatories: apiMocks.singleAccountSignatory,
  }
})

vi.mock('vue-router', () => ({
  useRoute: () => ({
    name: RouteName.USERS,
    params: {
      [RouteParam.ENTITY_ID]: DEFAULT_ROUTE_PARAMS_ID,
    },
  }),
  useRouter: () => ({
    go: vi.fn(),
  }),
}))

const userMock = getMockedUser({ id: 2 })
const selectedEntityMock = getMockedEntity({ accountId: mockedAccount.accountId })
const entitySummaryMock = getMockedEntitySummary(selectedEntityMock)

vi.mock('@pulse/common', () => ({
  getInitials: vi.fn(),
}))

vi.mock('@pulse/common/managers', () => ({
  CurrentUserManager: CurrentUserManagerMock,
}))

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
          props: ['modelValue', 'targetEntityId', 'targetEntityName', 'targetEntityNumber'],
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

const addSignatoryToolboxItem: PToolboxItemProps = {
  pIconName: 'patchCheck',
  pValue: 'Designate as signatory',
  pActionName: 'assignSignatory',
  pState: 'default',
}

const removeSignatoryToolboxItemEnabled: PToolboxItemProps = {
  pIconName: 'patchCheck',
  pValue: 'Revoke signatory status',
  pActionName: 'unassignSignatory',
  pState: 'default',
  disabled: false,
  pContentTooltip: undefined,
}

const removeSignatoryToolboxItemDisabled: PToolboxItemProps = {
  pIconName: 'patchCheck',
  pValue: 'Revoke signatory status',
  pActionName: 'unassignSignatory',
  pState: 'default',
  disabled: true,
  pContentTooltip: 'A folder should have at least one signatory',
}

const modifyToolboxItem: PToolboxItemProps = {
  pIconName: 'pencilSquare',
  pValue: 'Change the rights',
  pActionName: 'modifyRights',
  pState: 'default',
}

const removeUserToolboxItem: PToolboxItemProps = {
  pIconName: 'personRemove',
  pValue: 'Remove user',
  pActionName: 'removeUser',
  pState: 'default',
}

describe('usersCollab', () => {
  beforeEach(async () => {
    userStoreMock.user = userMock
    selectedEntityStoreMock.selectedEntity = entitySummaryMock
    hasPermissionMock.mockReturnValue(false)
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
      contactServiceMock.fetchOperationsForAccount.mockResolvedValue(operationsMock)

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

    it("should add user as account signatory when the 'Designate as signatory action is clicked", async () => {
      await wrapper.vm.handleUserAction('assignSignatory', mockedUser)

      expect(updateSignatoryStatus).toHaveBeenCalledWith(mockedAccount.accountId, mockedUser.contactId)
    })

    it("should remove account signatory when the 'Revoke signatory status'", async () => {
      apiMocks.singleAccountSignatory.mockReturnValue(apiMocks.multipleAccountSignatories())
      wrapper = createWrapper()
      await flushPromises()
      await wrapper.vm.handleUserAction('unassignSignatory', mockedUser)

      expect(updateSignatoryStatus).toHaveBeenCalledWith(mockedAccount.accountId, mockedUser.contactId, false)
    })

    it.each([
      {
        userThatCanBeAdded: mockedCustomersCollab[0],
        hasRemoveUserPermission: false,
        expectedItems: [
          removeSignatoryToolboxItemDisabled,
          modifyToolboxItem,
        ],
      },
      {
        userThatCanBeAdded: mockedCustomersCollab[1],
        hasRemoveUserPermission: false,
        expectedItems: [
          addSignatoryToolboxItem,
          modifyToolboxItem,
        ],
      },
      {
        userThatCanBeAdded: mockedCustomersCollab[1],
        hasRemoveUserPermission: true,
        expectedItems: [
          addSignatoryToolboxItem,
          modifyToolboxItem,
          removeUserToolboxItem,
        ],
      },
    ])("should allow signatory add if user isn't already signatory", async ({
      userThatCanBeAdded,
      hasRemoveUserPermission,
      expectedItems,
    }) => {
      hasPermissionMock.mockReturnValue(hasRemoveUserPermission)
      const wrapper = createWrapper()
      await flushPromises()
      wrapper.vm.handleToolboxClick(userThatCanBeAdded)
      await nextTick()
      const items = wrapper.vm.toolboxItems
      expect(items).toStrictEqual(expectedItems)
    })

    it.each([
      {
        userToRemove: mockedCustomersCollab[0],
        expectedItems: [
          removeSignatoryToolboxItemDisabled,
          modifyToolboxItem,
        ],
        getSignatoriesMockToUse: apiMocks.singleAccountSignatory,
      },
      {
        userToRemove: mockedCustomersCollab[1],
        expectedItems: [
          removeSignatoryToolboxItemEnabled,
          modifyToolboxItem,
        ],
        getSignatoriesMockToUse: apiMocks.multipleAccountSignatories,
      },
    ])('should allow signatory remove if user is signatory and account has at least another signatory',
      async ({ userToRemove, expectedItems, getSignatoriesMockToUse }) => {
        apiMocks.singleAccountSignatory.mockReturnValue(getSignatoriesMockToUse())
        wrapper = createWrapper()
        await flushPromises()

        wrapper.vm.handleToolboxClick(userToRemove)
        const items = wrapper.vm.toolboxItems
        expect(items).toMatchObject(expectedItems)
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

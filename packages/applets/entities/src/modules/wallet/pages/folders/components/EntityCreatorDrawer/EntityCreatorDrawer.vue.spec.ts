import { nextTick } from 'vue'
import { describe, vi, it, expect } from 'vitest'
import { flushPromises, shallowMount, type VueWrapper } from '@vue/test-utils'
import { loggerErrorSpy, loggerMock } from '@pulse/toolbox/mocks'
import EntityCreatorFormStructure from '@entities/config/forms/EntityCreatorFormStructure.json'
import { EntityCreatorDrawerProps } from '@entities/modules/wallet/types'
import { PDrawerActions } from '@pulse/styleguide/components'
import type { Contact } from '@entities/services/contact/contactTypes'
import type { ComponentWrapper } from '@pulse/toolbox/utils/test'
import { getMockedUser } from '@entities/__mocks__/users-client.mocks'
import type { UserInfo } from '@pulse/common/types'
import { CollaboratorRole } from '@pulse/common/enums'
import EntityCreatorDrawer from '.'

// Mocks
const userMock: UserInfo = getMockedUser()
const entityCreatorCollaboratorMock = {
  id: 8,
  firstName: 'Alice',
  lastName: 'Dupont',
  email: 'alice.dupont@example.com',
  oldId: 'aliced-guid',
}

// Expectations
const expectedExistingClient = {
  contactFirstName: 'John',
  contactLastName: 'Dupont',
  email: 'djhon',
  isSignatory: true,
  existingContactGuid: '111122223333',
}
const expectedDefaultAuthenticatedUser = {
  id: userMock.id,
  firstName: userMock.firstName,
  lastName: userMock.lastName,
  email: userMock.email,
  mobilePhone: userMock.officeMobile,
  oldId: userMock.oldId,
  persona: userMock.persona,
}

const enableFieldMock = vi.hoisted(() => vi.fn())
const disableFieldMock = vi.hoisted(() => vi.fn())
const validateFieldMock = vi.hoisted(() => vi.fn())
const createTestAccountMock = vi.hoisted(() => vi.fn())
const generateAccountNumberMock = vi.hoisted(() => vi.fn())
const getAccountUserByEmailMock = vi.hoisted(() =>
  vi.fn(
    (): Promise<Partial<Contact> | null> =>
      Promise.resolve({
        firstName: expectedExistingClient.contactFirstName,
        lastName: expectedExistingClient.contactLastName,
        oldId: expectedExistingClient.existingContactGuid,
      }),
  ),
)
const entityCreatorFormValidateMock = vi.hoisted(() => vi.fn(() => Promise.resolve(true)))
const entityCreatorFormStructureMock = vi.hoisted(() => vi.fn(() => Promise.resolve(EntityCreatorFormStructure)))

vi.mock('@pulse/common', () => ({
  getInitials: vi.fn(() => 'AD'),
}))
vi.mock('@pulse/toolbox', () => ({ logger: loggerMock, useDebounce: (fn: any) => fn }))
vi.mock('@entities/services/entity-creator', () => ({
  createTestAccount: createTestAccountMock,
  generateAccountNumber: generateAccountNumberMock,
}))
vi.mock('@entities/utils/referential', () => ({
  getFormStructure: entityCreatorFormStructureMock,
}))
vi.mock('@entities/services/account', () => ({
  getAccountUserByEmail: getAccountUserByEmailMock,
}))

const defaultProps: EntityCreatorDrawerProps = {
  modelValue: true,
  currentUser: userMock,
}

const getDrawerActions = (wrapper: VueWrapper) =>
  wrapper.findComponent({ name: 'PDrawerActions' }) as ComponentWrapper<
    InstanceType<typeof PDrawerActions>
  >

const createWrapper = (props: EntityCreatorDrawerProps = defaultProps) => {
  return shallowMount(EntityCreatorDrawer, {
    props,
    global: {
      stubs: {
        PDrawer: { name: 'PDrawer', template: '<div><slot/><slot name="footer"/></div>', events: ['close-drawer-button'] },
        CollaboratorAutocomplete: {
          name: 'CollaboratorAutocomplete',
          template: '<div></div>',
          events: ['add-contact'],
        },
        PLoader: true,
        PUserCard: true,
        PDynamicFields: { name: 'PDynamicFields', template: '<div></div>', events: ['update:pModel'] },
        PUserActionWithRoles: {
          name: 'PUserActionWithRoles',
          template: '<div></div>',
          props: {
            pShowOptions: { type: Boolean },
            pOptionsMultiple: { type: Boolean },
            pOptions: { type: Array },
            pOptionsValue: { type: Array },
            pOptionsPlaceholder: { type: String },
          },
          emits: ['click-delete', 'update:p-options-value'],
        },
        PForm: { name: 'PForm', template: '<div><slot/></div>', props: ['pModel'] },
        PFormItem: { name: 'PFormItem', template: '<div><slot/></div>' },
        PDrawerActions: {
          name: 'PDrawerActions',
          template: '<div></div>',
          props: ['pBackCTA', 'pPrimaryCTA'],
          emits: ['click-back-cta', 'click-primary-cta'],
        },
      },
    },
  })
}

describe('EntityCreatorDrawer Component - Unit Tests', () => {
  let wrapper: ComponentWrapper<InstanceType<typeof EntityCreatorDrawer>>
  beforeEach(async () => {
    // Reset mocks to default values
    generateAccountNumberMock.mockResolvedValue({ data: { accountNumber: '123456' } })
    getAccountUserByEmailMock.mockResolvedValue({
      firstName: expectedExistingClient.contactFirstName,
      lastName: expectedExistingClient.contactLastName,
      oldId: expectedExistingClient.existingContactGuid,
    })
    entityCreatorFormValidateMock.mockResolvedValue(true)
    entityCreatorFormStructureMock.mockResolvedValue(EntityCreatorFormStructure)

    wrapper = createWrapper()
    await flushPromises()
    if (wrapper.vm.entityCreatorForm) {
      wrapper.vm.entityCreatorForm.validateField = validateFieldMock
      wrapper.vm.entityCreatorForm.validate = entityCreatorFormValidateMock
    }
    // If 'any' is not used, it would be necessary to expose the 'entityCreatorFormDynamicFields' ref from the EntityCreatorDrawer component to access it.
    const wrapperVm = wrapper.vm as any
    if (wrapperVm.$refs.entityCreatorFormDynamicFields && wrapperVm.$refs.entityCreatorFormDynamicFields[1]) {
      wrapperVm.$refs.entityCreatorFormDynamicFields[1].enableField = enableFieldMock
      wrapperVm.$refs.entityCreatorFormDynamicFields[1].disableField = disableFieldMock
    }
    if (wrapperVm.$refs.entityCreatorFormDynamicFields && wrapperVm.$refs.entityCreatorFormDynamicFields[0]) {
      wrapperVm.$refs.entityCreatorFormDynamicFields[0].enableField = enableFieldMock
      wrapperVm.$refs.entityCreatorFormDynamicFields[0].disableField = disableFieldMock
    }
  })
  describe('display', () => {
    it('should correctly render the Entity Creator Drawer with its main components', () => {
      const entityCreatorForm = wrapper.findComponent({ name: 'PForm' })
      const entityCreatorDrawer = wrapper.findComponent({ name: 'PDrawer' })
      const entityCreatorUserCard = wrapper.findComponent({ name: 'PUserCard' })
      const entityCreatorUserAction = wrapper.findComponent({ name: 'PUserActionWithRoles' })

      expect(entityCreatorForm.exists()).toBeTruthy()
      expect(entityCreatorDrawer.exists()).toBeTruthy()
      expect(entityCreatorUserCard.exists()).toBeTruthy()
      expect(entityCreatorUserAction.exists()).toBeTruthy()
    })

    it('should render the Entity Creator form with the default collaborator set to the authenticated user', async () => {
      const defaultSelectedCollab = wrapper.vm.selectedCollaborators

      expect(defaultSelectedCollab).toHaveLength(1)
      expect(defaultSelectedCollab).toStrictEqual([expectedDefaultAuthenticatedUser])
    })
  })
  describe('events', () => {
    it('should call the API on mount to retrieve the generated AccountNumber', async () => {
      expect(generateAccountNumberMock).toHaveBeenCalledOnce()
    })

    it("Should emit 'update:modelValue' when the drawer visibility changes", async () => {
      const entityCreatorDrawer = wrapper.findComponent({ name: 'PDrawer' })
      await entityCreatorDrawer.vm.$emit('close-drawer-button')

      expect(wrapper.emitted('update:modelValue')).toStrictEqual([[false]])
    })

    it('should log an error when the Entity Creator form structure fails to load', async () => {
      const expectedErrorMessage = 'API Error: 503 Service Unavailable'
      entityCreatorFormStructureMock.mockRejectedValue(expectedErrorMessage)

      wrapper = createWrapper()
      await flushPromises()

      expect(loggerErrorSpy).toHaveBeenCalledExactlyOnceWith('Error fetching form structure :', expectedErrorMessage)
    })

    it("should add a collaborator when the component emits the 'add-contact' event", async () => {
      const collaboratorAutocomplete = wrapper.findComponent({ name: 'CollaboratorAutocomplete' })
      await collaboratorAutocomplete.vm.$emit('add-contact', entityCreatorCollaboratorMock)

      expect(wrapper.vm.selectedCollaborators).toHaveLength(2)
      expect(wrapper.vm.selectedCollaborators.at(1)).toStrictEqual(entityCreatorCollaboratorMock)
    })

    it("should emit the 'update:modelValue' event when the cancel button is clicked", async () => {
      const drawerActions = getDrawerActions(wrapper)

      drawerActions.vm.$emit('click-back-cta')
      await nextTick()

      expect(wrapper.emitted('update:modelValue')).toStrictEqual([[false]])
    })

    it('should disable the create button when no collaborator is selected', async () => {
      const drawerActions = getDrawerActions(wrapper)

      wrapper.vm.onClickDelete(userMock.id)
      await nextTick()

      expect(drawerActions.props('pPrimaryCTA')!.pDisabled).toBeTruthy()
    })

    it('should call API when email is typed', async () => {
      const emailSuffix = 'john'
      const pDynamicFields = wrapper.findComponent({ name: 'PDynamicFields' })

      await pDynamicFields.vm.$emit('update:pModel', 'email', emailSuffix)
      await flushPromises()

      expect(getAccountUserByEmailMock).toHaveBeenCalledExactlyOnceWith(emailSuffix)
    })

    it('should populate form data when search contact API returns a response', async () => {
      const pDynamicFields = wrapper.findComponent({ name: 'PDynamicFields' })
      const pForm = wrapper.findComponent({ name: 'pForm' })

      await pDynamicFields.vm.$emit('update:pModel', 'email', expectedExistingClient.email)
      await flushPromises()

      expect(pForm.props('pModel')).toMatchObject(expectedExistingClient)
    })

    it('should validate and toggle fields when existingContactGuid is filled', async () => {
      const pDynamicFields = wrapper.findComponent({ name: 'PDynamicFields' })

      await pDynamicFields.vm.$emit('update:pModel', 'email', expectedExistingClient.email)
      await flushPromises()

      expect(disableFieldMock).toHaveBeenCalledTimes(2)
      expect(validateFieldMock).toHaveBeenCalledTimes(2)
    })

    it('should clear contact data before making another API call', async () => {
      const pDynamicFields = wrapper.findComponent({ name: 'PDynamicFields' })
      const pForm = wrapper.findComponent({ name: 'pForm' })

      await pDynamicFields.vm.$emit('update:pModel', 'email', expectedExistingClient.email)
      await flushPromises()
      expect(pForm.props('pModel')).toMatchObject(expectedExistingClient)

      getAccountUserByEmailMock.mockResolvedValue(null)
      await pDynamicFields.vm.$emit('update:pModel', 'email', 'ljack')
      await flushPromises()

      expect(enableFieldMock).toHaveBeenCalledTimes(2)
      expect(pForm.props('pModel')).toMatchObject({
        contactFirstName: '',
        contactLastName: '',
        isSignatory: true,
        existingContactGuid: '',
      })
    })
  })

  describe('role assignments', () => {
    it('should display a role dropdown for each collaborator', () => {
      const userActions = wrapper.findAllComponents({ name: 'PUserActionWithRoles' })

      expect(userActions).toHaveLength(1)
      expect(userActions[0].props('pShowOptions')).toBeTruthy()
      expect(userActions[0].props('pOptionsMultiple')).toBeTruthy()
    })

    it('should initialize role assignments for the default collaborator', () => {
      expect(wrapper.vm.collaboratorRoleAssignments.get(userMock.id)).toStrictEqual([])
    })

    it('should initialize role assignments when a collaborator is added', async () => {
      const collaboratorAutocomplete = wrapper.findComponent({ name: 'CollaboratorAutocomplete' })
      await collaboratorAutocomplete.vm.$emit('add-contact', entityCreatorCollaboratorMock)

      expect(wrapper.vm.collaboratorRoleAssignments.get(entityCreatorCollaboratorMock.id)).toStrictEqual([])
    })

    it('should assign "Resp compte" role to a collaborator', async () => {
      const userAction = wrapper.findComponent({ name: 'PUserActionWithRoles' })
      await userAction.vm.$emit('update:p-options-value', [CollaboratorRole.CLP])

      expect(wrapper.vm.collaboratorRoleAssignments.get(userMock.id)).toStrictEqual([CollaboratorRole.CLP])
    })

    it('should assign "Maitre dossier" role to a collaborator', async () => {
      const userAction = wrapper.findComponent({ name: 'PUserActionWithRoles' })
      await userAction.vm.$emit('update:p-options-value', [CollaboratorRole.AM])

      expect(wrapper.vm.collaboratorRoleAssignments.get(userMock.id)).toStrictEqual([CollaboratorRole.AM])
    })

    it('should allow a single collaborator to hold both roles', async () => {
      const userAction = wrapper.findComponent({ name: 'PUserActionWithRoles' })
      await userAction.vm.$emit('update:p-options-value', [CollaboratorRole.CLP, CollaboratorRole.AM])

      expect(wrapper.vm.collaboratorRoleAssignments.get(userMock.id)).toStrictEqual([
        CollaboratorRole.CLP,
        CollaboratorRole.AM,
      ])
    })

    it('should include role GUIDs in the API payload on create', async () => {
      const userAction = wrapper.findComponent({ name: 'PUserActionWithRoles' })
      await userAction.vm.$emit('update:p-options-value', [CollaboratorRole.CLP, CollaboratorRole.AM])

      const drawerActions = getDrawerActions(wrapper)
      await drawerActions.vm.$emit('click-primary-cta')
      await flushPromises()

      expect(createTestAccountMock).toHaveBeenCalledWith(
        expect.objectContaining({
          accountLeadGuid: userMock.oldId,
          masterGuid: userMock.oldId,
        }),
      )
    })

    it('should clear role assignments when a collaborator is deleted', async () => {
      const collaboratorAutocomplete = wrapper.findComponent({ name: 'CollaboratorAutocomplete' })
      await collaboratorAutocomplete.vm.$emit('add-contact', entityCreatorCollaboratorMock)

      const userActions = wrapper.findAllComponents({ name: 'PUserActionWithRoles' })
      const secondUserAction = userActions[1]
      await secondUserAction.vm.$emit('update:p-options-value', [CollaboratorRole.CLP])

      expect(wrapper.vm.collaboratorRoleAssignments.get(entityCreatorCollaboratorMock.id)).toStrictEqual([
        CollaboratorRole.CLP,
      ])

      wrapper.vm.onClickDelete(entityCreatorCollaboratorMock.id)
      await nextTick()

      expect(wrapper.vm.collaboratorRoleAssignments.has(entityCreatorCollaboratorMock.id)).toBe(false)
    })

    it('should send undefined role GUIDs when no roles are assigned', async () => {
      const drawerActions = getDrawerActions(wrapper)
      await drawerActions.vm.$emit('click-primary-cta')
      await flushPromises()

      expect(createTestAccountMock).toHaveBeenCalledWith(
        expect.objectContaining({
          accountLeadGuid: undefined,
          masterGuid: undefined,
        }),
      )
    })
  })
})

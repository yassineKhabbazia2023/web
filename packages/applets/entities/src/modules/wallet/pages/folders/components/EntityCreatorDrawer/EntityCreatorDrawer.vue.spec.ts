import { nextTick } from 'vue'
import { describe, vi, it, expect } from 'vitest'
import { flushPromises, shallowMount, type VueWrapper } from '@vue/test-utils'
import { loggerErrorSpy, loggerMock } from '@pulse/toolbox/mocks'
import EntityCreatorFormStructure from '@entities/config/forms/EntityCreatorFormStructure.json'
import { EntityCreatorDrawerProps } from '@entities/modules/wallet/types'
import { PButton } from '@pulse/styleguide/components'
import type { Contact } from '@entities/services/contact/contactTypes'
import type { ComponentWrapper } from '@entities/types'
import { getMockedUser } from '@entities/__mocks__/users-client.mocks'
import type { UserInfo } from '@pulse/common/types'
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

const getCreateTestAccountButton = (wrapper: VueWrapper) =>
  wrapper.findComponent('[data-testid="entity-creator-create-button"]') as ComponentWrapper<
    InstanceType<typeof PButton>
  >

const createWrapper = (props: EntityCreatorDrawerProps = defaultProps) => {
  return shallowMount(EntityCreatorDrawer, {
    props,
    global: {
      stubs: {
        PDrawer: { name: 'PDrawer', template: '<div><slot/></div>', events: ['close-drawer-button'] },
        CollaboratorAutocomplete: {
          name: 'CollaboratorAutocomplete',
          template: '<div></div>',
          events: ['add-contact'],
        },
        PLoader: true,
        PUserCard: true,
        PFieldSet: { name: 'PFieldSet', template: '<div></div>', events: ['update:pModel'] },
        PUserAction: true,
        PForm: { name: 'PForm', template: '<div><slot/></div>', props: ['pModel'] },
        PFormItem: { name: 'PFormItem', template: '<div><slot/></div>' },
        PButton: { name: 'PButton', template: '<button><slot/></button>', props: ['pDisabled'] },
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
    // If 'any' is not used, it would be necessary to expose the 'entityCreatorFormFieldSet' ref from the EntityCreatorDrawer component to access it.
    const wrapperVm = wrapper.vm as any
    if (wrapperVm.$refs.entityCreatorFormFieldSet && wrapperVm.$refs.entityCreatorFormFieldSet[1]) {
      wrapperVm.$refs.entityCreatorFormFieldSet[1].enableField = enableFieldMock
      wrapperVm.$refs.entityCreatorFormFieldSet[1].disableField = disableFieldMock
    }
    if (wrapperVm.$refs.entityCreatorFormFieldSet && wrapperVm.$refs.entityCreatorFormFieldSet[0]) {
      wrapperVm.$refs.entityCreatorFormFieldSet[0].enableField = enableFieldMock
      wrapperVm.$refs.entityCreatorFormFieldSet[0].disableField = disableFieldMock
    }
  })
  describe('display', () => {
    it('should correctly render the Entity Creator Drawer with its main components', () => {
      const entityCreatorForm = wrapper.findComponent({ name: 'PForm' })
      const entityCreatorDrawer = wrapper.findComponent({ name: 'PDrawer' })
      const entityCreatorUserCard = wrapper.findComponent({ name: 'PUserCard' })
      const entityCreatorUserAction = wrapper.findComponent({ name: 'PUserAction' })

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

      expect(loggerErrorSpy).toHaveBeenCalledOnce()
      expect(loggerErrorSpy).toHaveBeenCalledWith('Error fetching form structure :', expectedErrorMessage)
    })

    it("should add a collaborator when the component emits the 'add-contact' event", async () => {
      const collaboratorAutocomplete = wrapper.findComponent({ name: 'CollaboratorAutocomplete' })
      await collaboratorAutocomplete.vm.$emit('add-contact', entityCreatorCollaboratorMock)

      expect(wrapper.vm.selectedCollaborators).toHaveLength(2)
      expect(wrapper.vm.selectedCollaborators.at(1)).toStrictEqual(entityCreatorCollaboratorMock)
    })

    it("should emit the 'update:modelValue' event when the cancel button is clicked", async () => {
      const cancelButton = wrapper.findComponent('[data-testid="entity-creator-cancel-button"]')

      cancelButton.trigger('click')
      await nextTick()

      expect(wrapper.emitted('update:modelValue')).toStrictEqual([[false]])
    })

    it('should disable the create button when no collaborator is selected', async () => {
      const createButton = getCreateTestAccountButton(wrapper)

      wrapper.vm.onClickDelete(0)
      await nextTick()

      expect(createButton.props('pDisabled')).toBeTruthy()
    })

    it('should call API when email is typed', async () => {
      const emailSuffix = 'john'
      const pFieldSet = wrapper.findComponent({ name: 'PFieldSet' })

      await pFieldSet.vm.$emit('update:pModel', 'email', emailSuffix)
      await flushPromises()

      expect(getAccountUserByEmailMock).toHaveBeenCalledOnce()
      expect(getAccountUserByEmailMock).toHaveBeenCalledWith(emailSuffix)
    })

    it('should populate form data when search contact API returns a response', async () => {
      const pFieldSet = wrapper.findComponent({ name: 'PFieldSet' })
      const pForm = wrapper.findComponent({ name: 'pForm' })

      await pFieldSet.vm.$emit('update:pModel', 'email', expectedExistingClient.email)
      await flushPromises()

      expect(pForm.props('pModel')).toMatchObject(expectedExistingClient)
    })

    it('should validate and toggle fields when existingContactGuid is filled', async () => {
      const pFieldSet = wrapper.findComponent({ name: 'PFieldSet' })

      await pFieldSet.vm.$emit('update:pModel', 'email', expectedExistingClient.email)
      await flushPromises()

      expect(disableFieldMock).toHaveBeenCalledTimes(2)
      expect(validateFieldMock).toHaveBeenCalledTimes(2)
    })

    it('should clear contact data before making another API call', async () => {
      const pFieldSet = wrapper.findComponent({ name: 'PFieldSet' })
      const pForm = wrapper.findComponent({ name: 'pForm' })

      await pFieldSet.vm.$emit('update:pModel', 'email', expectedExistingClient.email)
      await flushPromises()
      expect(pForm.props('pModel')).toMatchObject(expectedExistingClient)

      getAccountUserByEmailMock.mockResolvedValue(null)
      await pFieldSet.vm.$emit('update:pModel', 'email', 'ljack')
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
})

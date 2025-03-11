import { nextTick } from 'vue'
import { describe, vi, it, expect } from 'vitest'
import { flushPromises, shallowMount, type VueWrapper } from '@vue/test-utils'
import { loggerErrorSpy, loggerMock } from '@pulse/core/mocks'
import EntityCreatorFormStructure from '@entities/common/config/forms/EntityCreatorFormStructure.json'
import { EntityCreatorDrawerProps } from './entity-creator-drawer.types'
import { PButton } from '@pulse/styleguide/components'
import type { ComponentWrapper, Contact } from '@entities/common/types'
import { getMockedUser } from '@entities/__mocks__/users-client.mocks'
import type { UserInfo } from '@pulse/common/types'
import * as helpers from '@entities/common/utils'
import EntityCreatorDrawer from '.'

// Mocks
const mockUser: UserInfo = getMockedUser()
const mockEntityCreatorCollaborator = {
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
  id: mockUser.id,
  firstName: mockUser.firstName,
  lastName: mockUser.lastName,
  email: mockUser.email,
  mobilePhone: mockUser.officeMobile,
  oldId: mockUser.oldId,
  persona: mockUser.persona,
}

const mockEnableField = vi.hoisted(() => vi.fn())
const mockDisableField = vi.hoisted(() => vi.fn())
const mockValidateField = vi.hoisted(() => vi.fn())
const mockCreateTestAccount = vi.hoisted(() => vi.fn())
const mockGetAccountUserByEmail = vi.hoisted(() =>
  vi.fn(
    (): Promise<Partial<Contact> | null> =>
      Promise.resolve({
        firstName: expectedExistingClient.contactFirstName,
        lastName: expectedExistingClient.contactLastName,
        oldId: expectedExistingClient.existingContactGuid,
      }),
  ),
)
const mockEntityCreatorFormValidate = vi.hoisted(() => vi.fn(() => Promise.resolve(true)))
const mockEntityCreatorFormStructure = vi.hoisted(() => vi.fn(() => Promise.resolve(EntityCreatorFormStructure)))

vi.mock('@pulse/common', () => ({
  debounce: (callback: Function) => callback,
  getInitials: vi.fn(() => 'AD'),
}))
vi.mock('@pulse/core', () => ({ logger: loggerMock }))
vi.mock('@entities/services/entity-creator', () => ({
  createTestAccount: mockCreateTestAccount,
}))
vi.mock('@entities/common/utils/referential', () => ({
  getFormStructure: mockEntityCreatorFormStructure,
}))
vi.mock('@entities/services/account', () => ({
  getAccountUserByEmail: mockGetAccountUserByEmail,
}))

const defaultProps: EntityCreatorDrawerProps = {
  modelValue: true,
  currentUser: mockUser,
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
    wrapper = createWrapper()
    await flushPromises()
    if (wrapper.vm.entityCreatorForm) {
      wrapper.vm.entityCreatorForm.validateField = mockValidateField
      wrapper.vm.entityCreatorForm.validate = mockEntityCreatorFormValidate
    }
    // If 'any' is not used, it would be necessary to expose the 'entityCreatorFormFieldSet' ref from the EntityCreatorDrawer component to access it.
    const wrapperVm = wrapper.vm as any
    wrapperVm.$refs.entityCreatorFormFieldSet[1].enableField = mockEnableField
    wrapperVm.$refs.entityCreatorFormFieldSet[1].disableField = mockDisableField
    wrapperVm.$refs.entityCreatorFormFieldSet[0].enableField = mockEnableField
    wrapperVm.$refs.entityCreatorFormFieldSet[0].disableField = mockDisableField
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
    it("Should emit 'update:modelValue' when the drawer visibility changes", async () => {
      const entityCreatorDrawer = wrapper.findComponent({ name: 'PDrawer' })
      await entityCreatorDrawer.vm.$emit('close-drawer-button')

      expect(wrapper.emitted('update:modelValue')).toStrictEqual([[false]])
    })

    it('should log an error when the Entity Creator form structure fails to load', async () => {
      const expectedErrorMessage = 'API Error: 503 Service Unavailable'
      mockEntityCreatorFormStructure.mockRejectedValue(expectedErrorMessage)

      wrapper = createWrapper()
      await flushPromises()

      expect(loggerErrorSpy).toHaveBeenCalledOnce()
      expect(loggerErrorSpy).toHaveBeenCalledWith('Error fetching form structure :', expectedErrorMessage)
    })

    it("should add a collaborator when the component emits the 'add-contact' event", async () => {
      const collaboratorAutocomplete = wrapper.findComponent({ name: 'CollaboratorAutocomplete' })
      await collaboratorAutocomplete.vm.$emit('add-contact', mockEntityCreatorCollaborator)

      expect(wrapper.vm.selectedCollaborators).toHaveLength(2)
      expect(wrapper.vm.selectedCollaborators.at(1)).toStrictEqual(mockEntityCreatorCollaborator)
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

    it('should display a success notification when the test account is successfully created', async () => {
      const spyDisplayNotification = vi.spyOn(helpers, 'displayNotification')
      const createButton = getCreateTestAccountButton(wrapper)

      await createButton.trigger('click')
      await flushPromises()

      expect(mockCreateTestAccount).toHaveBeenCalledOnce()
      expect(spyDisplayNotification).toHaveBeenCalledOnce()
      expect(spyDisplayNotification).toHaveBeenCalledWith('success', 'The test account has been successfully created.')
    })

    it('Should display an error notification when the test account creation fails', async () => {
      const expectedErrorMessage = 'API Error: 503 Service Unavailable'
      const spyDisplayNotification = vi.spyOn(helpers, 'displayNotification')
      const createButton = getCreateTestAccountButton(wrapper)
      mockCreateTestAccount.mockRejectedValue(expectedErrorMessage)

      await createButton.trigger('click')
      await flushPromises()

      expect(mockCreateTestAccount).toHaveBeenCalledOnce()
      expect(spyDisplayNotification).toHaveBeenCalledOnce()
      expect(spyDisplayNotification).toHaveBeenCalledWith('error', 'Test account creation failed. Please try again.')
    })

    it('should call API when email is typed', async () => {
      const emailSuffix = 'john'
      const pFieldSet = wrapper.findComponent({ name: 'PFieldSet' })

      await pFieldSet.vm.$emit('update:pModel', 'email', emailSuffix)
      await flushPromises()

      expect(mockGetAccountUserByEmail).toHaveBeenCalledOnce()
      expect(mockGetAccountUserByEmail).toHaveBeenCalledWith(emailSuffix)
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

      expect(mockDisableField).toHaveBeenCalledTimes(2)
      expect(mockValidateField).toHaveBeenCalledTimes(2)
    })

    it('should clear contact data before making another API call', async () => {
      const pFieldSet = wrapper.findComponent({ name: 'PFieldSet' })
      const pForm = wrapper.findComponent({ name: 'pForm' })

      await pFieldSet.vm.$emit('update:pModel', 'email', expectedExistingClient.email)
      await flushPromises()
      expect(pForm.props('pModel')).toMatchObject(expectedExistingClient)

      mockGetAccountUserByEmail.mockResolvedValue(null)
      await pFieldSet.vm.$emit('update:pModel', 'email', 'ljack')
      await flushPromises()

      expect(mockEnableField).toHaveBeenCalledTimes(2)
      expect(pForm.props('pModel')).toMatchObject({
        contactFirstName: '',
        contactLastName: '',
        isSignatory: true,
        existingContactGuid: '',
      })
    })
  })
})

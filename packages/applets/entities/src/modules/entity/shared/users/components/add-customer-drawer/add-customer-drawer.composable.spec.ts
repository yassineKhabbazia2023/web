import { ADD_CUSTOMER_USER_DRAWER_STEPS } from './add-customer-drawer.const'
import { hasContactRoleOnCommonAccount } from '@entities/services/account'
import { AccountManager } from '@entities/managers/account/account.manager'
import { AddCustomerDrawerStep } from '@entities/modules/entity/shared/users/enums'
import { saveUserPermissions } from '@entities/components/ManageRightsDrawer/utils'
import { displayNotification } from '@pulse/styleguide'

import { useAddCustomerDrawer } from './add-customer-drawer.composable'
import { CollaboratorPermission, AccountType } from '@pulse/common/enums'

const hasContactRoleOnCommonAccountMock = vi.mocked(hasContactRoleOnCommonAccount)
const saveUserPermissionsMock = vi.mocked(saveUserPermissions)
const createOrAddCustomerToAccountMock = vi.fn()
const displayNotificationMock = vi.mocked(displayNotification)

beforeEach(() => {
  vi.spyOn(AccountManager, 'createOrAddCustomerToAccount').mockImplementation(createOrAddCustomerToAccountMock)
  hasContactRoleOnCommonAccountMock.mockResolvedValue(undefined as unknown as boolean)
  saveUserPermissionsMock.mockResolvedValue(undefined as unknown as boolean)
  displayNotificationMock.mockReturnValue(undefined)
})

const initializationParamaters = {
  invalidEmailAdresseMessage: 'incorrectEmail',
  alreadyAddedToAccountMessage: 'alreadyAddedToAccount',
  addCustomerDrawerSteps: ADD_CUSTOMER_USER_DRAWER_STEPS,
  requiredInputMessage: 'requiredInput',
  addCustomerFailedMessage: 'addCustomerFailed',
}
const contactIdMock = 233
const targetEntityIdMock = 2342
const targetEntityNumberMock = '2342'
const targetEntityAccountTypeMock = AccountType.REGULAR
const wrongEmailMock = 'wrong email'
const correctEmailMock = 'correct@email.test'

describe('add-customer-drawer.composable', () => {
  describe('initial state', () => {
    it('should set initial state properly', () => {
      const expectedInitialState = {
        addCustomerDrawerStepIndex: 0,
        addCustomerDrawerStep: AddCustomerDrawerStep.ADD_EMAIL,
        isLastStep: false,
        hasFormSubmissionFailed: false,
        isNextButtonLoading: false,
        isNextButtonDisabled: true,
        newContact: {
          'email': '',
          'firstname': '',
          'lastname': '',
        },
        contactId: undefined,
        isAddContactSucceeded: false,
        emailErrorMessage: '',
        authorizationsState: {},
      }
      const {
        addCustomerDrawerStepIndex,
        addCustomerDrawerStep,
        isLastStep,
        hasFormSubmissionFailed,
        isNextButtonLoading,
        isNextButtonDisabled,
        newContact,
        contactId,
        isAddContactSucceeded,
        emailErrorMessage,
        authorizationsState,
      } = useAddCustomerDrawer(initializationParamaters)
      const initialState = {
        addCustomerDrawerStepIndex: addCustomerDrawerStepIndex.value,
        addCustomerDrawerStep: addCustomerDrawerStep.value,
        isLastStep: isLastStep.value,
        hasFormSubmissionFailed: hasFormSubmissionFailed.value,
        isNextButtonLoading: isNextButtonLoading.value,
        isNextButtonDisabled: isNextButtonDisabled.value,
        newContact: newContact.value,
        contactId: contactId.value,
        isAddContactSucceeded: isAddContactSucceeded.value,
        emailErrorMessage: emailErrorMessage.value,
        authorizationsState: authorizationsState.value,
      }

      expect(initialState).toStrictEqual(expectedInitialState)
    })
  })

  describe('checkEmail', () => {
    describe('check email address structure', () => {
      const tests = [{
        email: '',
        expectedEmailErrorMessage: initializationParamaters.invalidEmailAdresseMessage,
        reason: 'email is empty',
      }, {
        email: wrongEmailMock,
        expectedEmailErrorMessage: initializationParamaters.invalidEmailAdresseMessage,
        reason: 'email has wrong structure',
      }, {
        email: correctEmailMock,
        expectedEmailErrorMessage: '',
        reason: 'email is correct',
      }]
      it.each(tests)('should set emailErrorMessage properly when email $reason', async ({
        email,
        expectedEmailErrorMessage,
      }) => {
        const {
          newContact,
          emailErrorMessage,
          checkEmail,
        } = useAddCustomerDrawer(initializationParamaters)
        newContact.value.email = email
        await checkEmail(targetEntityIdMock)

        expect(emailErrorMessage.value).toBe(expectedEmailErrorMessage)
      })
    })

    describe('check if email already exists', () => {
      const tests = [{
        alreadyExists: true,
        expectedEmailErrorMessage: initializationParamaters.alreadyAddedToAccountMessage,
        reason: 'email exists',
      }, {
        alreadyExists: false,
        expectedEmailErrorMessage: '',
        reason: 'does not exist',
      }]
      it.each(tests)('should set emailErrorMessage properly when $reason', async ({
        alreadyExists,
        expectedEmailErrorMessage,
      }) => {
        const email = correctEmailMock
        hasContactRoleOnCommonAccountMock.mockResolvedValue(alreadyExists)

        const {
          newContact,
          emailErrorMessage,
          isNextButtonLoading,
          checkEmail,
        } = useAddCustomerDrawer(initializationParamaters)

        newContact.value.email = email

        await checkEmail(targetEntityIdMock)

        expect(emailErrorMessage.value).toBe(expectedEmailErrorMessage)
        expect(isNextButtonLoading.value).toBe(false)
        expect(hasContactRoleOnCommonAccountMock).toHaveBeenCalledExactlyOnceWith(email, targetEntityIdMock)
      })
    })
  })

  describe('rights gating on MANAGE_RIGHTS step', () => {
    function makeFieldsValid(api: any) {
      // Ensure other validators won't disable the button
      api.newContact.value.email = 'user@example.com'
      api.newContact.value.firstname = 'John'
      api.newContact.value.lastname = 'Doe'

      // Keep error messages empty
      api.emailErrorMessage.value = ''
      api.firstNameErrorMessage.value = ''
      api.lastNameErrorMessage.value = ''
    }

    it('disables Next when on MANAGE_RIGHTS and no right is selected (all inactive)', () => {
      const {
        addCustomerDrawerStepIndex,
        isNextButtonDisabled,
        authorizationsState,
        newContact,
        emailErrorMessage,
        firstNameErrorMessage,
        lastNameErrorMessage,
      } = useAddCustomerDrawer(initializationParamaters)

      makeFieldsValid({ newContact, emailErrorMessage, firstNameErrorMessage, lastNameErrorMessage })

      // Move to MANAGE_RIGHTS step (index 1 with your default steps)
      addCustomerDrawerStepIndex.value = 1

      // All groups inactive
      authorizationsState.value = {
        GROUP_A: { actions: [], isActive: false },
        GROUP_B: { actions: [], isActive: false },
      }

      expect(isNextButtonDisabled.value).toBe(true)
    })

    it('enables Next when on MANAGE_RIGHTS and at least one right is active', () => {
      const {
        addCustomerDrawerStepIndex,
        isNextButtonDisabled,
        authorizationsState,
        newContact,
        emailErrorMessage,
        firstNameErrorMessage,
        lastNameErrorMessage,
      } = useAddCustomerDrawer(initializationParamaters)

      makeFieldsValid({ newContact, emailErrorMessage, firstNameErrorMessage, lastNameErrorMessage })

      addCustomerDrawerStepIndex.value = 1

      // One group active
      authorizationsState.value = {
        GROUP_A: { actions: [], isActive: false },
        GROUP_B: { actions: [CollaboratorPermission.ACCEDER_CALENDRIER], isActive: true },
      }

      expect(isNextButtonDisabled.value).toBe(false)
    })

    it('disables Next when on MANAGE_RIGHTS and authorizationsState is empty', () => {
      const {
        addCustomerDrawerStepIndex,
        isNextButtonDisabled,
        authorizationsState,
        newContact,
        emailErrorMessage,
        firstNameErrorMessage,
        lastNameErrorMessage,
      } = useAddCustomerDrawer(initializationParamaters)

      makeFieldsValid({ newContact, emailErrorMessage, firstNameErrorMessage, lastNameErrorMessage })
      addCustomerDrawerStepIndex.value = 1
      authorizationsState.value = {}

      expect(isNextButtonDisabled.value).toBe(true)
    })
  })

  describe('submitForm', () => {
    describe('first step', () => {
      const tests = [{
        email: correctEmailMock,
        firstname: 'toto',
        lastname: 'toto',
        createdContactId: contactIdMock,
        expectedIsSuccess: true,
        expectedAddCustomerDrawerStepIndex: 1,
        expectedDisplayNotificationCalledWith: null,
        reason: 'form is valid',
      }, {
        email: wrongEmailMock,
        firstname: 'toto',
        lastname: 'toto',
        createdContactId: contactIdMock,
        expectedIsSuccess: false,
        expectedAddCustomerDrawerStepIndex: 0,
        expectedDisplayNotificationCalledWith: null,
        reason: 'email is invalid',
      }, {
        email: correctEmailMock,
        firstname: '',
        lastname: '',
        createdContactId: contactIdMock,
        expectedIsSuccess: false,
        expectedAddCustomerDrawerStepIndex: 0,
        expectedDisplayNotificationCalledWith: null,
        reason: 'firstname & lastname are empty',
      }, {
        email: correctEmailMock,
        firstname: 'toto',
        lastname: 'toto',
        createdContactId: undefined,
        expectedIsSuccess: false,
        expectedAddCustomerDrawerStepIndex: 0,
        expectedDisplayNotificationCalledWith: ['error', initializationParamaters.addCustomerFailedMessage] as const,
        reason: 'user creation failed (e.g. forbidden email)',
      }]
      it.each(tests)('should be $expectedIsSuccess when $reason', async ({
        email,
        firstname,
        lastname,
        createdContactId,
        expectedIsSuccess,
        expectedAddCustomerDrawerStepIndex,
        expectedDisplayNotificationCalledWith,
      }) => {
        createOrAddCustomerToAccountMock.mockResolvedValue(createdContactId)
        displayNotificationMock.mockClear()

        const {
          newContact,
          addCustomerDrawerStepIndex,
          submitForm,
        } = useAddCustomerDrawer(initializationParamaters)

        newContact.value.email = email
        newContact.value.firstname = firstname
        newContact.value.lastname = lastname

        const isSuccess = await submitForm(targetEntityIdMock, targetEntityNumberMock, targetEntityAccountTypeMock)
        expect(isSuccess).toBe(expectedIsSuccess)
        expect(addCustomerDrawerStepIndex.value).toBe(expectedAddCustomerDrawerStepIndex)
        if (expectedDisplayNotificationCalledWith === null) {
          expect(displayNotificationMock).not.toHaveBeenCalled()
        } else {
          expect(displayNotificationMock).toHaveBeenCalledExactlyOnceWith(...expectedDisplayNotificationCalledWith)
        }
      })
    })

    describe('second step', () => {
      const tests = [{
        updateUserPermissionsSuccessfully: true,
        expectedIsSuccess: true,
        expectedAddCustomerDrawerStepIndex: 2,
        forcedContactId: contactIdMock,
        reason: 'update user permissions successed and contactId is set',
      }, {
        updateUserPermissionsSuccessfully: true,
        expectedIsSuccess: false,
        expectedAddCustomerDrawerStepIndex: 1,
        forcedContactId: undefined,
        reason: 'contactId is undefined',
      }, {
        updateUserPermissionsSuccessfully: false,
        expectedIsSuccess: false,
        expectedAddCustomerDrawerStepIndex: 1,
        forcedContactId: contactIdMock,
        reason: 'update user permissions failed',
      }]
      it.each(tests)('should return $expected when $reason', async ({
        updateUserPermissionsSuccessfully,
        forcedContactId,
        expectedIsSuccess,
        expectedAddCustomerDrawerStepIndex,
      }) => {
        const {
          addCustomerDrawerStepIndex,
          contactId,
          submitForm,
        } = useAddCustomerDrawer(initializationParamaters)

        contactId.value = forcedContactId
        saveUserPermissionsMock.mockResolvedValue(updateUserPermissionsSuccessfully)
        addCustomerDrawerStepIndex.value = 1

        const isSuccess = await submitForm(targetEntityIdMock, targetEntityNumberMock, targetEntityAccountTypeMock)
        expect(addCustomerDrawerStepIndex.value).toBe(expectedAddCustomerDrawerStepIndex)
        expect(isSuccess).toBe(expectedIsSuccess)
      })

      it('should display error notification when saveUserPermissions fails', async () => {
        displayNotificationMock.mockClear()
        saveUserPermissionsMock.mockResolvedValue(false)

        const {
          addCustomerDrawerStepIndex,
          contactId,
          submitForm,
          isNextButtonLoading,
        } = useAddCustomerDrawer(initializationParamaters)

        contactId.value = contactIdMock
        addCustomerDrawerStepIndex.value = 1

        const isSuccess = await submitForm(targetEntityIdMock, targetEntityNumberMock, targetEntityAccountTypeMock)

        expect(isSuccess).toBe(false)
        expect(addCustomerDrawerStepIndex.value).toBe(1) // Step should not advance
        expect(isNextButtonLoading.value).toBe(false) // Loading should be reset
        expect(displayNotificationMock).toHaveBeenCalledExactlyOnceWith('error', 'entities.addCustomerDrawer.errorMessage')
        expect(saveUserPermissionsMock).toHaveBeenCalledOnce() // Verify saveUserPermissions was actually called
      })
    })
  })
})

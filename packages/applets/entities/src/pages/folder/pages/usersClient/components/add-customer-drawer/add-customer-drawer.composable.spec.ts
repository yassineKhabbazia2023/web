import { DEBOUNCE_DELAY, ADD_CUSTOMER_DRAWER_STEPS } from './add-customer-drawer.const'
import { hasContactRoleOnCommonAccount } from '@entities/services/account'
import { AddCustomerDrawerStep } from './add-customer-drawer.enums'
import { saveUserPermissions } from '@entities/common/components/ManageRightsDrawer/utils'

import { useAddCustomerDrawer } from './add-customer-drawer.composable'
import { CollaboratorPermission } from '@pulse/common/enums'

vi.mock('@entities/services/account')
vi.mock('@entities/managers/account/account.manager')
vi.mock('@pulse/common/services/amplitude')
vi.mock('@pulse/toolbox')
vi.mock('@entities/common/components/ManageRightsDrawer/utils')

const hasContactRoleOnCommonAccountMock = vi.mocked(hasContactRoleOnCommonAccount)
const saveUserPermissionsMock = vi.mocked(saveUserPermissions)

const initializationParamaters = {
  debounceDelay: DEBOUNCE_DELAY,
  invalidEmailAdresseMessage: 'incorrectEmail',
  alreadyAddedToAccountMessage: 'alreadyAddedToAccount',
  addCustomerDrawerSteps: ADD_CUSTOMER_DRAWER_STEPS,
  requiredInputMessage: 'requiredInput',

}
const contactIdMock = 233
const targetEntityIdMock = 2342
const targetEntityNumberMock = '2342'
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
        expect(hasContactRoleOnCommonAccountMock).toHaveBeenCalledOnce()
        expect(hasContactRoleOnCommonAccountMock).toHaveBeenCalledWith(email, targetEntityIdMock)
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
        expectedIsSuccess: true,
        expectedAddCustomerDrawerStepIndex: 1,
        reason: 'form is valid',
      }, {
        email: wrongEmailMock,
        firstname: 'toto',
        lastname: 'toto',
        expectedIsSuccess: false,
        expectedAddCustomerDrawerStepIndex: 0,
        reason: 'email is invalid',
      }, {
        email: correctEmailMock,
        firstname: '',
        lastname: '',
        expectedIsSuccess: false,
        expectedAddCustomerDrawerStepIndex: 0,
        reason: 'firstname & lastname are empty',
      }]
      it.each(tests)('should be $correctEmailMock when $reason', async ({
        email,
        firstname,
        lastname,
        expectedIsSuccess,
        expectedAddCustomerDrawerStepIndex,
      }) => {
        const {
          newContact,
          addCustomerDrawerStepIndex,
          submitForm,
        } = useAddCustomerDrawer(initializationParamaters)

        newContact.value.email = email
        newContact.value.firstname = firstname
        newContact.value.lastname = lastname

        const isSuccess = await submitForm(targetEntityIdMock, targetEntityNumberMock)
        expect(isSuccess).toBe(expectedIsSuccess)
        expect(addCustomerDrawerStepIndex.value).toBe(expectedAddCustomerDrawerStepIndex)
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
        contactId: undefined,
        reason: 'contactId is undefined',
      }, {
        updateUserPermissionsSuccessfully: false,
        expectedIsSuccess: false,
        expectedAddCustomerDrawerStepIndex: 1,
        targetEntityId: targetEntityIdMock,
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

        const isSuccess = await submitForm(targetEntityIdMock, targetEntityNumberMock)
        expect(addCustomerDrawerStepIndex.value).toBe(expectedAddCustomerDrawerStepIndex)
        expect(isSuccess).toBe(expectedIsSuccess)
      })
    })
  })
})

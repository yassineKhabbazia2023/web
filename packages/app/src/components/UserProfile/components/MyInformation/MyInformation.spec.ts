import { nextTick } from 'vue'
import { loggerMock } from '@pulse/core/mocks'
import { getMockedUser } from '@pulse/common/mocks'
import { flushPromises, shallowMount } from '@vue/test-utils'

import MyInformation from '.'


const patchMock = vi.hoisted(() => vi.fn())
const pNotificationMock = vi.hoisted(() => vi.fn())
const currentUserMock = getMockedUser()
const getCurrentUserMock = vi.hoisted(() => vi.fn())
vi.mock('@pulse/common/services/current-user', () => ({
  CurrentUserService: {
    getCurrentUser: getCurrentUserMock,
  },
}))

vi.mock('@pulse/core', () => ({ logger: loggerMock }))
vi.mock('@pulse/styleguide', () => ({
  PNotification: pNotificationMock,
}))
vi.mock('@pulse/common', () => ({
  commonApi: () => ({
    gateway: {
      patch: patchMock,
    },
  }),
}))

const validateMock = vi.fn()

const createWrapper = () =>
  shallowMount(MyInformation, {
    global: {
      stubs: {
        Teleport: {
          name: 'Teleport',
          template: '<div><slot /></div>',
        },
        PFormItem: {
          name: 'PFormItem',
          template: '<div><slot /></div>',
          props: ['pLabel'],
        },
        PForm: {
          name: 'PForm',
          template: '<div><slot /></div>',
          props: ['pModel'],
          methods: {
            validate: validateMock,
          },
        },
        PInput: {
          name: 'PInput',
          template: '<div />',
          props: [
            'modelValue',
            'pDisabled',
          ],
        },
      },
    },
  })

describe('MyInformation', () => {
  describe('display', () => {
    const tests = [{
      isCollab: false,
      description: 'customer',
    }, {
      isCollab: true,
      description: 'collab',
    }]
    it.each(tests)('should display properly when $description', async ({
      isCollab,
      description,
    }) => {
      getCurrentUserMock.mockImplementation(() => Promise.resolve({
        ...currentUserMock,
        isCollab,
      }))
      const wrapper = createWrapper()
      await flushPromises()

      const snapFilepath = `__snap__/MyInformation.${description}.html`
      await expect(wrapper.html()).toMatchFileSnapshot(snapFilepath)
    })

    it('should display an error notification when the request fails', async () => {
      const expectedErrorMessage = 'API Error: 503 Service Unavailable'
      patchMock.mockRejectedValue(expectedErrorMessage)
      const wrapper = createWrapper()

      const [_personaNameInput, mobilePhoneInput] = wrapper.findAllComponents({ name: 'PInput' })
      mobilePhoneInput.setValue('123')

      const pButton = wrapper.findComponent({ name: 'PButton' })
      pButton.trigger('click')
      await flushPromises()

      expect(pNotificationMock).toHaveBeenCalledOnce()
    })
  })

  describe('other tests', () => {
    let wrapper: ReturnType<typeof createWrapper>

    beforeEach(async () => {
      getCurrentUserMock.mockResolvedValue(currentUserMock)
      wrapper = createWrapper()
      await flushPromises()
    })

    it('has a logout button', () => {
      const logoutButton = wrapper.findComponent({ name: 'LogoutButton' })
      expect(logoutButton.exists()).toBe(true)
    })

    it('prefill the form', async () => {
      await nextTick()
      const { firstName, lastName, persona, officeMobile, email } = currentUserMock
      const fullNameWrapper = wrapper.find('p.h4')

      expect(fullNameWrapper.text()).toContain(`${firstName} ${lastName}`)
      const [personaNameInput, mobilePhoneInput, emailInput] = wrapper.findAllComponents({ name: 'PInput' })

      expect(personaNameInput.props('modelValue')).toBe(persona!.name)
      expect(mobilePhoneInput.props('modelValue')).toBe(officeMobile)
      expect(emailInput.props('modelValue')).toBe(email)
    })

    it('has all fields as read only except for mobile', () => {
      const [personaNameInput, mobilePhoneInput, emailInput] = wrapper.findAllComponents({ name: 'PInput' })

      expect(personaNameInput.props('pDisabled')).toBe('')
      expect(mobilePhoneInput.props('pDisabled')).toBeUndefined()
      expect(emailInput.props('pDisabled')).toBe('')
    })
  })
  describe('events', () => {
    let wrapper: ReturnType<typeof createWrapper>

    beforeEach(async () => {
      wrapper = createWrapper()
      await flushPromises()
    })

    it('should call CurrentUserService.getCurrentUser() to populate the default values', () => {
      expect(getCurrentUserMock).toHaveBeenCalledTimes(1)
    })

    it('can update the user information and display a toaster', async () => {
      validateMock.mockReturnValue(true)
      const NEW_VALUE = '123'

      const [_personaNameInput, mobilePhoneInput] = wrapper.findAllComponents({ name: 'PInput' })
      mobilePhoneInput.setValue(NEW_VALUE)

      expect(patchMock).not.toHaveBeenCalled()
      expect(pNotificationMock).not.toHaveBeenCalled()

      const pButton = wrapper.findComponent({ name: 'PButton' })
      pButton.trigger('click')
      await flushPromises()

      expect(pNotificationMock).toHaveBeenCalledOnce()
      expect(patchMock).toHaveBeenCalledOnce()
      expect(patchMock).toHaveBeenCalledWith(
        'contact/api/contacts/currentuser',
        [{
          op: 'replace',
          path: '/MobilePhone',
          value: NEW_VALUE,
        }],
        {
          headers: {
            'Content-Type': 'application/json-patch+json',
          },
        },
      )
    })

    it('should trigger the submit event when the form is submitted',
      async () => {
        const [_personaNameInput, mobilePhoneInput] = wrapper.findAllComponents({ name: 'PInput' })
        await mobilePhoneInput.setValue('0787')
        const pForm = wrapper.findComponent({ name: 'PForm' })
        await pForm.trigger('submit.prevent')
        await flushPromises()

        expect(pForm.emitted('submit')).toBeTruthy()
      },
    )

    it("should send the 'update:modelValue' event when the persona name field value changed",
      async () => {
        await nextTick()
        const personaNameField = wrapper.findComponent({ name: 'PInput' })
        await personaNameField.setValue('sy')
        await flushPromises()

        expect(personaNameField.emitted('update:modelValue')).toBeTruthy()
      },
    )

    it("should send the 'update:modelValue' event when the email field value changed",
      async () => {
        await nextTick()
        const [_personaNameInput, mobilePhoneInput] = wrapper.findAllComponents({ name: 'PInput' })
        await mobilePhoneInput.setValue('sy')
        await flushPromises()

        expect(mobilePhoneInput.emitted('update:modelValue')).toBeTruthy()
      },
    )
  })
})

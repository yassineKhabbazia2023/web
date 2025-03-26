import { nextTick } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { loggerMock } from '@pulse/core/mocks'
import { getMockedUser } from '@pulse/common/mocks'
import { flushPromises, mount } from '@vue/test-utils'

import MyInformation from '.'

const currentUserMock = getMockedUser()

const patchMock = vi.hoisted(() => vi.fn())
const pNotificationMock = vi.hoisted(() => vi.fn())
const fetchUserDataMock = vi.hoisted(() =>
  vi.fn(() => {
    return Promise.resolve(currentUserMock)
  }),
)

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
  dataProvider: () => {
    return {
      fetchUserData: fetchUserDataMock,
    }
  },
}))

const createWrapper = (): VueWrapper<any> =>
  mount(MyInformation, {
    attachTo: document.body,
    global: {
      stubs: [
        'LogoutButton',
        'LegalLinks',
      ],
    },
  })

let wrapper: VueWrapper<any>

const getAllInputs = () => wrapper.findAll('input')

describe('myInformation', () => {
  beforeEach(async () => {
    const drawerFooter = document.createElement('div')
    drawerFooter.id = 'my-information__footer-drawer'
    document.body.appendChild(drawerFooter)

    wrapper = createWrapper()
    await flushPromises()
  })

  afterEach(() => {
    document.body.outerHTML = ''
  })
  describe('display', () => {
    it('has a logout button', () => {
      const logoutButton = document.querySelector('logout-button-stub')
      expect(logoutButton).toBeTruthy()
    })

    it('prefill the form', () => {
      const { firstName, lastName, persona, officeMobile, email } = currentUserMock
      const fullNameWrapper = wrapper.find('p.h4')

      expect(fullNameWrapper.text()).toContain(`${firstName} ${lastName}`)
      expect((getAllInputs()[0].element as HTMLInputElement).value).toBe(persona!.name)
      expect((getAllInputs()[1].element as HTMLInputElement).value).toBe(officeMobile)
      expect((getAllInputs()[2].element as HTMLInputElement).value).toBe(email)
    })

    it('has all fields as read only except for mobile', () => {
      expect(getAllInputs()[0].attributes().disabled).toBeDefined()
      expect(getAllInputs()[1].attributes().disabled).toBeUndefined()
      expect(getAllInputs()[2].attributes().disabled).toBeDefined()
    })
  })
  describe('events', () => {
    it('should call fetchUserData() to populate the default values', () => {
      expect(fetchUserDataMock).toHaveBeenCalledOnce()
    })

    it('can update the user information and display a toaster', async () => {
      const NEW_VALUE = '123'

      const mobilePhoneInput = wrapper.find('[name=mobilePhone]')
      mobilePhoneInput.setValue(NEW_VALUE)

      expect(patchMock).not.toHaveBeenCalled()
      expect(pNotificationMock).not.toHaveBeenCalled()

      const inputSubmit = document.querySelector('button') as HTMLButtonElement
      inputSubmit.click()
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

    it('should display an error notification when the request fails', async () => {
      const expectedErrorMessage = 'API Error: 503 Service Unavailable'
      patchMock.mockRejectedValue(expectedErrorMessage)
      wrapper = createWrapper()

      const mobilePhoneInput = wrapper.find('[name=mobilePhone]')
      mobilePhoneInput.setValue('123')

      const inputSubmit = document.querySelector('button') as HTMLButtonElement
      inputSubmit.click()
      await flushPromises()

      expect(pNotificationMock).toHaveBeenCalledOnce()
    })

    it('should trigger the submit event when the form is submitted',
      async () => {
        const mobilePhoneInput = wrapper.find('[name=mobilePhone]')
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
        const personaNameField = wrapper.findComponent({ name: 'PInput' }) as VueWrapper
        await personaNameField.setValue('sy')
        await flushPromises()

        expect(personaNameField.emitted('update:modelValue')).toBeTruthy()
      },
    )

    it("should send the 'update:modelValue' event when the email field value changed",
      async () => {
        await nextTick()
        const emailField = wrapper.findAllComponents({ name: 'PInput' })[2] as VueWrapper
        await emailField.setValue('sy')
        await flushPromises()

        expect(emailField.emitted('update:modelValue')).toBeTruthy()
      },
    )
  })
})

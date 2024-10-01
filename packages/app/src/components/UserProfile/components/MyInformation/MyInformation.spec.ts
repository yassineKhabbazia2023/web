import { createTestingPinia } from '@pinia/testing'
import { defineStore } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, type MockInstance, vi } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import * as styleguide from '@pulse/styleguide'
import { flushPromises, mount } from '@vue/test-utils'
import MyInformation from '.'

const pinia = createTestingPinia()

const CONTACT_RESPONSE = {
  firstName: 'custom firstName',
  lastName: 'custom lastName',
  persona: {
    name: 'custom personaName',
  },
  email: 'custom email',
  mobilePhone: 'custom mobilePhone',
}

const {
  firstName,
  lastName,
  persona: {
    name: personaName,
  },
  email,
  mobilePhone,
} = CONTACT_RESPONSE
const USER_ID = 42

const mockPatch = vi.fn()
const mockGet = vi.fn(() => Promise.resolve({ data: CONTACT_RESPONSE }))

vi.mock('@pulse/styleguide', async () => {
  const styleguide = await vi.importActual('@pulse/styleguide') as Record<string, unknown>
  return {
    ...styleguide,
    PNotification: vi.fn(),
  }
})

vi.mock('@pulse/common', () => ({
  commonApi: () => ({
    gateway: {
      get: mockGet,
      patch: mockPatch,
    },
  }),
  commonStore: defineStore('common', {
    state: () => ({
      user: {
        firstName: 'Jack',
        id: USER_ID,
      },
    }),
    getters: {
      isCollab: () => true,
    },
  }),
  fetchUrlTerms: vi.fn(),
  dataProvider: () => {
    return {
      fetchUserData: vi.fn(),
    }
  },
}))

const createWrapper = (): VueWrapper<any> =>
  mount(MyInformation, {
    attachTo: document.body,
    global: {
      plugins: [pinia],
      stubs: ['LogoutButton'],
    },
  })

let wrapper: VueWrapper<any>

const getAllInputs = () => wrapper.findAll('input')

describe('myInformation', () => {
  let spyPNotification: MockInstance
  beforeEach(() => {
    const drawerFooter = document.createElement('div')
    spyPNotification = vi.spyOn(styleguide, 'PNotification')
    drawerFooter.classList.add('el-drawer__footer')
    document.body.appendChild(drawerFooter)

    wrapper = createWrapper()
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
      const fullNameWrapper = wrapper.find('p.h4')

      expect(fullNameWrapper.text()).toContain(`${firstName} ${lastName}`)
      expect((getAllInputs()[0].element as HTMLInputElement).value).toBe(personaName)
      expect((getAllInputs()[1].element as HTMLInputElement).value).toBe(mobilePhone)
      expect((getAllInputs()[2].element as HTMLInputElement).value).toBe(email)
    })

    it('has all fields as read only except for mobile', () => {
      expect(getAllInputs()[0].attributes().disabled).toBeDefined()
      expect(getAllInputs()[1].attributes().disabled).toBeUndefined()
      expect(getAllInputs()[2].attributes().disabled).toBeDefined()
    })
  })
  describe('events', () => {
    it('can update the user information and display a toaster', async () => {
      const NEW_VALUE = '123'

      const mobilePhoneInput = wrapper.find('[name=mobilePhone]')
      mobilePhoneInput.setValue(NEW_VALUE)

      expect(mockPatch).not.toHaveBeenCalled()
      expect(spyPNotification).not.toHaveBeenCalled()

      const inputSubmit = document.querySelector('button') as HTMLButtonElement
      inputSubmit.click()
      await flushPromises()

      expect(spyPNotification).toHaveBeenCalledOnce()
      expect(mockPatch).toHaveBeenCalledOnce()
      expect(mockPatch).toHaveBeenCalledWith(
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
      mockPatch.mockRejectedValue(expectedErrorMessage)
      wrapper = createWrapper()

      const mobilePhoneInput = wrapper.find('[name=mobilePhone]')
      mobilePhoneInput.setValue('123')

      const inputSubmit = document.querySelector('button') as HTMLButtonElement
      inputSubmit.click()
      await flushPromises()

      expect(spyPNotification).toHaveBeenCalledOnce()
    })

    it('should log a console.error message when the request fails', async () => {
      const expectedErrorMessage = 'API Error: 503 Service Unavailable'
      const spyConsole = vi.spyOn(console, 'error')
      mockGet.mockRejectedValue(expectedErrorMessage)

      wrapper = createWrapper()
      await flushPromises()

      expect(spyConsole).toHaveBeenCalledOnce()
      expect(spyConsole).toHaveBeenCalledWith(expectedErrorMessage)
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

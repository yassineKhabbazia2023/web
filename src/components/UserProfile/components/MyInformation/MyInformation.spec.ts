import { createTestingPinia } from '@pinia/testing'
import { defineStore } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import MyInformation from './'

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

vi.mock('@kpmg/common', () => ({
  commonApi: () => ({
    gateway: {
      get: () => Promise.resolve({ data: CONTACT_RESPONSE }),
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
  beforeEach(() => {
    const drawerFooter = document.createElement('div')
    drawerFooter.classList.add('el-drawer__footer')
    document.body.appendChild(drawerFooter)

    wrapper = createWrapper()
  })

  afterEach(() => {
    document.body.outerHTML = ''
  })

  it('has a logout button', () => {
    const logoutButton = document.querySelector('logout-button-stub')
    expect(logoutButton).toBeTruthy()
  })

  it('prefill the form', () => {
    const fullNameWrapper = wrapper.find('p.h4')
    expect(fullNameWrapper.text()).toContain(`${firstName} ${lastName}`)

    expect((getAllInputs()[0].element as HTMLInputElement).value).toBe(personaName)
    expect((getAllInputs()[1].element as HTMLInputElement).value).toBe(email)
    expect((getAllInputs()[2].element as HTMLInputElement).value).toBe(mobilePhone)
  })

  it('has all fields as read only except for mobile', () => {
    expect(getAllInputs()[0].attributes().disabled).toBeDefined()
    expect(getAllInputs()[1].attributes().disabled).toBeDefined()
    expect(getAllInputs()[2].attributes().disabled).toBeUndefined()
  })

  it('can update the user information and display a toaster', async () => {
    const NEW_VALUE = '123'

    const mobilePhoneInput = wrapper.find('[name=mobilePhone]')
    mobilePhoneInput.setValue(NEW_VALUE)

    const getToasterSuccess = () => document.querySelector('.el-notification.success')
    expect(getToasterSuccess()).toBeFalsy()

    expect(mockPatch).not.toHaveBeenCalled()

    const inputSubmit = document.querySelector('button') as HTMLButtonElement
    inputSubmit.click()
    await flushPromises()

    expect(mockPatch).toHaveBeenCalledOnce()
    expect(mockPatch).toHaveBeenCalledWith(
      `contact/api/contacts/${USER_ID}`,
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

    expect(getToasterSuccess()).toBeTruthy()
  })
})

import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import listContact from '@/pages/wallet/pages/collaborators/mockCollaborators.json'
import listCollab from '@/pages/wallet/pages/collaborators/mock.json'
import * as walletServices from '@/services/wallet'
import { nextTick } from 'vue'
import DrawerCollabDetails from '.'

vi.mock('@/services/wallet', () => ({
  updateCollaborator: vi.fn(),
}))
let wrapper: VueWrapper<any>
const mockGatewayPatch = vi.fn(() => {
  return Promise.resolve({
    data: listContact.items[0],
  })
})

vi.mock('@kpmg/common', () => ({
  commonApi: () => ({
    gateway: {
      patch: mockGatewayPatch,
    },
  }),
  commonStore: () => ({
    $patch: vi.fn(),
  }),
  debounce: (callback: Function) => callback,
}))

const {
  firstName: firstNameOfFirstContact,
  lastName: lastNameOfFirstContact,
} = listContact.items[0]

const rowData = {
  ...listCollab.data.items[0],
  fullName: `${firstNameOfFirstContact} ${lastNameOfFirstContact}`,
}

const getButtonSubmit = () => wrapper.find('[data-testid=submit-btn]')

const {
  lastName,
  firstName,
  email,
  mobilePhone,
  landPhone,
} = rowData

const inputs = [
  { name: 'lastName', value: lastName.toUpperCase(), isDisabled: true },
  { name: 'firstName', value: firstName, isDisabled: true },
  { name: 'email', value: email, isDisabled: true },
  { name: 'mobilePhone', value: mobilePhone, isDisabled: false },
  { name: 'landPhone', value: landPhone, isDisabled: false },
]
const getInputs = () => wrapper.findAll('.el-form input')

const createWrapper = (): VueWrapper<any> =>
  mount(DrawerCollabDetails, {
    props: {
      rowData,
      modelValue: true,
    },
    global: {
      stubs: {
        PDrawer: {
          name: 'PDrawer',
          template: '<div><slot/><slot name="footer"/></div>',
          events: ['close-drawer-button'],
        },
      },
    },
  })

describe('drawerCollabDetails', () => {
  beforeEach(() => {
    wrapper = createWrapper()
  })

  it('displays the main collaborator details in a user card', () => {
    const title = wrapper.find('.p-user-card__title')
    expect(title.text()).toContain(rowData.fullName)

    const userCard = wrapper.find('.p-user-card__subtitle')
    expect(userCard.text()).toContain(listCollab.data.items[0].email)

    const tag = wrapper.find('.el-tag__content')
    expect(tag.text()).toContain(rowData.role)
  })

  it.each(inputs)('prefill the input %# value', (input) => {
    expect((getInputs()[inputs.indexOf(input)].element as HTMLInputElement).value).toBe(input.value)
  })

  it.each((inputs).filter(({ isDisabled }) => isDisabled))('has some inputs disabled, checking input %#',
    (input) => {
      expect(getInputs()[inputs.indexOf(input)].attributes().disabled).toBeDefined()
    })

  it.each(inputs.filter(({ isDisabled }) => !isDisabled))('do not have some inputs disabled, checking input %#',
    (input) => {
      expect(getInputs()[inputs.indexOf(input)].attributes().disabled).toBeUndefined()
    })

  it('displays a success notification on form submitted', async () => {
    const spyUpdateCollaborator = vi.spyOn(walletServices, 'updateCollaborator')
    const getNotificationSuccess = () => document.body.getElementsByClassName('el-notification success')
    expect(getNotificationSuccess()).toHaveLength(0)

    await getButtonSubmit().trigger('click')
    await flushPromises()

    expect(spyUpdateCollaborator).toHaveBeenCalledTimes(1)
    expect(getNotificationSuccess()).toHaveLength(1)
    expect(wrapper.emitted('update-collaborator-details')).toHaveLength(1)
    expect(getNotificationSuccess()[0].textContent).toContain(rowData.fullName)
  })

  it('Displays an error notification when the API request to update a collaborator fails', async () => {
    vi.spyOn(walletServices, 'updateCollaborator').mockRejectedValue('API Error')
    const getNotificationError = () => document.body.getElementsByClassName('el-notification error')
    expect(getNotificationError()).toHaveLength(0)

    await getButtonSubmit().trigger('click')
    await flushPromises()

    expect(getNotificationError()).toHaveLength(1)
    expect(getNotificationError()[0].textContent).toContain(rowData.fullName)
  })

  it("should emit the 'update:modelValue' event when the drawer is closed", async () => {
    const pDrawer = wrapper.findComponent({ name: 'PDrawer' })
    pDrawer.vm.$emit('close-drawer-button', false)
    await nextTick()

    expect(wrapper.emitted('update:modelValue')).toStrictEqual([[false]])
  })

  it("should emit the 'update:modelValue' event when the v-model is updated", async () => {
    const drawer = wrapper.findComponent({ name: 'PDrawer' })
    drawer.vm.$emit('update:modelValue', false)
    await nextTick()

    expect(wrapper.emitted('update:modelValue')).toStrictEqual([[false]])
  })

  it('emits an update event and closes the drawer on reset button click', async () => {
    const resetButton = wrapper.find('[data-testid=reset-btn]')
    await resetButton.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
  })

  const inputsEnabled = inputs.filter(({ isDisabled }) => !isDisabled)
  it.each(inputsEnabled)('has control on the $name input', async (inputEnabled) => {
    const input = getInputs()[inputs.indexOf(inputEnabled)]
    const getButtonSubmitAttrDisabled = () => getButtonSubmit().attributes('disabled')

    expect(getButtonSubmitAttrDisabled()).toBeUndefined()

    await input?.setValue('not digit value')
    await flushPromises()

    expect(getButtonSubmitAttrDisabled()).toBeDefined()

    await input?.setValue('1234567890')
    await flushPromises()

    expect(getButtonSubmitAttrDisabled()).toBeUndefined()
  })
})

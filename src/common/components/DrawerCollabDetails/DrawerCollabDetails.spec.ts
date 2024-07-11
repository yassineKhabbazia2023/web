import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import listContact from '@/pages/wallet/pages/collaborators/mockCollaborators.json'
import listCollab from '@/pages/wallet/pages/collaborators/mock.json'

import { updateCollaborator } from '@/services/wallet'
import DrawerCollabDetails from './'

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
}))
const { firstName, lastName } = listContact.items[0]
const rowData = {
  ...listCollab.data.items[0],
  fullName: `${firstName} ${lastName}`,
}

const createWrapper = (): VueWrapper<any> =>
  mount(DrawerCollabDetails, {
    props: {
      rowData,
      hasDrawerOpened: true,
    },
    attachTo: document.body,
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

  const {
    lastName,
    firstName,
    email,
    mobilePhone,
    landPhone,
  } = rowData
  const inputs = [
    { name: 'lastName', value: lastName, isDisabled: true },
    { name: 'firstName', value: firstName, isDisabled: true },
    { name: 'email', value: email, isDisabled: true },
    { name: 'mobilePhone', value: mobilePhone, isDisabled: false },
    { name: 'landPhone', value: landPhone, isDisabled: false },
  ]
  const getInputs = () => wrapper.findAll('input')

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
    const getNotificationSuccess = () => document.body.getElementsByClassName('el-notification success')
    expect(getNotificationSuccess()).toHaveLength(0)

    const buttonSubmit = wrapper.find('[data-testid=submit-btn]')
    await buttonSubmit.trigger('click')
    await flushPromises()
    expect(vi.mocked(updateCollaborator)).toHaveBeenCalledTimes(1)
    expect(getNotificationSuccess()).toHaveLength(1)
    expect(wrapper.emitted('update-collaborator-details')).toHaveLength(1)
    expect(getNotificationSuccess()[0].textContent).toContain(rowData.fullName)
  })
  it('emits an update event and closes the drawer on reset button click', async () => {
    const resetButton = wrapper.find('[data-testid=reset-btn]')
    await resetButton.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
  })
})

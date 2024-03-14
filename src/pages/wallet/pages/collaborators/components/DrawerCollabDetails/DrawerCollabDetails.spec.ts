import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import mock from './../../mock.json'
import DrawerCollabDetails from './'

let wrapper: VueWrapper<any>

const { firstName, lastName } = mock.data.items[0]
const rowData = {
  ...mock.data.items[0],
  fullName: `${firstName} ${lastName}`
}

const createWrapper = (): VueWrapper<any> =>
  mount(DrawerCollabDetails, {
    props: {
      rowData,
      hasDrawerOpened: true
    },
    attachTo: document.body
  })

describe('drawerCollabDetails', () => {
  beforeEach(() => {
    wrapper = createWrapper()
  })

  it('displays the main collaborator details in a user card', () => {
    const title = wrapper.find('.p-user-card__title')
    expect(title.text()).toContain(rowData.fullName)

    const userCard = wrapper.find('.p-user-card__subtitle')
    expect(userCard.text()).toContain(mock.data.items[0].email)

    const tag = wrapper.find('.el-tag__content')
    expect(tag.text()).toContain(rowData.role)
  })

  const {
    lastName,
    firstName,
    email,
    mobilePhone,
    landPhone
  } = rowData
  const inputs = [
    { name: 'lastName', value: lastName, isDisabled: true },
    { name: 'firstName', value: firstName, isDisabled: true },
    { name: 'email', value: email, isDisabled: true },
    { name: 'mobilePhone', value: mobilePhone, isDisabled: false },
    { name: 'landPhone', value: landPhone, isDisabled: false }
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

    const buttonSubmit = wrapper.findAll('.el-drawer__footer button')[1]
    await buttonSubmit.trigger('click')

    expect(getNotificationSuccess()[0].textContent).toContain(rowData.fullName)
  })
})

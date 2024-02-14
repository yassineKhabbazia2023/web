import { mount, VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import mockRowData from './../../mock.json'
import mock from './mock.json'
import DrawerCollabDetails from './'

let wrapper: VueWrapper<any>

const { firstName, lastName } = mockRowData.data.items[0]
const rowData = {
  ...mockRowData.data.items[0],
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
    expect(userCard.text()).toContain(rowData.email)

    const tag = wrapper.find('.el-tag__content')
    expect(tag.text()).toContain(rowData.role)
  })

  it('shows multiple roles', () => {
    const radioCards = wrapper.findAll('.p-radio-card')
    expect(radioCards).toHaveLength(mock.data.length)
  })

  it('has a role pre selected', () => {
    const roleSelected = mock.data.find(({ selected }) => selected)
    const radioCardSelected = wrapper.find('.p-radio-card .el-radio.is-checked input')
    expect((radioCardSelected.element as HTMLInputElement).value).toBe(roleSelected?.id.toString())
  })

  it('displays a success notification on form submitted', async () => {
    const getNotificationSuccess = () => document.body.getElementsByClassName('el-notification success')
    expect(getNotificationSuccess()).toHaveLength(0)

    const buttonSubmit = wrapper.findAll('.el-drawer__footer button')[1]
    await buttonSubmit.trigger('click')

    expect(getNotificationSuccess()[0].textContent).toContain(rowData.fullName)
  })
})

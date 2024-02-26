import { mount, VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import mockRowData from './../../mock.json'
import DrawerCollabDetails from './'

let wrapper: VueWrapper<any>

const { firstName, lastName } = mockRowData.data.items[0]
const rowData = {
  ...mockRowData.data.items[0],
  fullName: `${firstName} ${lastName}`,
  initials: `${firstName[0].toUpperCase()}${lastName[0].toUpperCase()}`
}

const getCollabRoleComponent = () => wrapper.findComponent({ name: 'CollabRole' })
const getCollabAccessComponent = () => wrapper.findComponent({ name: 'CollabAccess' })

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

  it('can switch between steps', async () => {
    expect(getCollabRoleComponent().exists()).toBeTruthy()
    expect(getCollabAccessComponent().exists()).toBeFalsy()

    await getCollabRoleComponent().vm.$emit('setSelectedRoleId')

    expect(getCollabRoleComponent().exists()).toBeFalsy()
    expect(getCollabAccessComponent().exists()).toBeTruthy()

    await getCollabAccessComponent().vm.$emit('goToPreviousStep')

    expect(getCollabRoleComponent().exists()).toBeTruthy()
    expect(getCollabAccessComponent().exists()).toBeFalsy()
  })

  it('can display a notification when the form on the second step is submitted', async () => {
    await getCollabRoleComponent().vm.$emit('setSelectedRoleId')

    const getNotificationSuccess = () => document.body.getElementsByClassName('el-notification success')
    expect(getNotificationSuccess()).toHaveLength(0)

    await getCollabAccessComponent().vm.$emit('setAccesses')

    expect(getNotificationSuccess()[0].textContent).toContain(rowData.fullName)
  })
})

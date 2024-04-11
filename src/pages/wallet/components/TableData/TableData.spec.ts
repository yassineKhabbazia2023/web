import { createTestingPinia } from '@pinia/testing'
import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest'
import { nextTick } from 'vue'
import { defineStore } from 'pinia'
import { mockTableData } from './mockData'
import { type Entity, commonStore } from '@kpmg/common'
import TableData from './'

const handleFavorites = vi.fn()
const postMock = vi.fn()
const contactId = '565cf560-8a2a-494f-9f85-73a031ed258e'
const testEntity = {
  accountId: mockTableData[0].accountId,
  legalName: mockTableData[0].name,
  accountNumber: mockTableData[0].accountNumber,
}

vi.mock('@kpmg/common', () => ({
  commonApi: () => ({
    onboarding: {
      post: postMock,
    },
  }),
  commonStore: defineStore('common', {
    state: () => ({
      user: {
        id: contactId,
      },
      isCollab: true,
    }),
    getters: {
      defaultEntity: () => testEntity,
    },
  }),
}))

const pinia = createTestingPinia()

const createWrapper = (): VueWrapper<any> =>
  mount(TableData, {
    props: {
      data: mockTableData,
      handleAddFavorite: handleFavorites,
    },
    attachTo: document.body,
    global: {
      plugins: [pinia],
    },
  })

const collaboratorsColumnLabels =
[
  'Company name',
  'Folder ID',
  'Leader',
  'Email',
  'City',
  'Hub',
  'Status',
  'Options',
]
const clientsColumnLabels =
[
  'Company name',
  'Folder ID',
  'Leader',
  'Email',
  'City',
  'Options',
]

describe('tableData', () => {
  let wrapper: VueWrapper<any>
  let store: any

  beforeEach(async () => {
    vi.useFakeTimers()
    wrapper = createWrapper()
    store = commonStore(pinia)
    store.$patch({
      user: {},
    })

    await flushPromises()
  })

  afterEach(() => {
    postMock.mockReset()
    postMock.mockClear()
    wrapper.unmount()
  })

  it('calls function handle when click', async () => {
    const btnFavorite = wrapper.find('td.el-table_1_column_1 [data-testid="wallet-remove-favorite"]')
    await btnFavorite.trigger('click')
    expect(handleFavorites).toHaveBeenCalledTimes(1)
    expect(handleFavorites).toHaveBeenCalledWith(mockTableData[0].accountId, true)
  })

  it('displays correctly the table', () => {
    const rows = wrapper.findAll('tr.el-table__row')
    expect(rows).toHaveLength(mockTableData.length)

    const {
      accountNumber,
      city,
      hub,
      deploymentStatus: { text: deploymentStatusText },
      name,
      owner: {
        email,
        firstName,
        lastName,
      },
    } = mockTableData[0]

    const firstRowText = rows[0].text()
    const mockData = [name, accountNumber, firstName, lastName, email, city, hub, deploymentStatusText]
    mockData.forEach(data => {
      expect(firstRowText).toContain(data)
    })
  })

  it('should be a correct link in the toolbox', () => {
    const getPopoverContent = () => document.body.getElementsByClassName('p-toolbox-item__text')[0].innerHTML
    const rows = wrapper.findAll('tr.el-table__row')
    const firstRowText = rows[0]
    expect(firstRowText.find('.el-tag__content').text()).toBe('To Deploy')
    expect(getPopoverContent()).toContain('Deploy this folder')
  })

  it('should resend activation mail & success toaster when click on resend email button', async () => {
    postMock.mockReturnValueOnce({
      status: 200,
      data: {
        webToken: 'token',
      },
    })
    const notificationToaster = document.body.getElementsByClassName('el-notification__content')
    expect(notificationToaster.length).toBeLessThanOrEqual(0)
    const resendEmailButton = document.body.getElementsByClassName('p-toolbox-item__text')[2] as HTMLElement
    resendEmailButton.click()
    await nextTick()
    const notifTextSuccess = 'A new activation email for'
    const {
      accountId,
    } = mockTableData[1]
    expect(postMock).toHaveBeenCalledWith(`/Activation/Invite?accountId=${accountId}&contactId=${contactId}`)
    const notificationContent = document.body.getElementsByClassName('el-notification__content')[0].innerHTML
    expect(notificationContent).toContain(notifTextSuccess)
  })

  it('should show error toaster when click on resend email button', async () => {
    postMock.mockReturnValueOnce({
      status: 500,
      data: {
        webToken: '',
      },
    })
    const notifTextError = 'A problem occurred while sending the activation email for '
    const notificationToaster = document.body.getElementsByClassName('el-notification__content')
    expect(notificationToaster.length).toBeLessThanOrEqual(1)
    expect(notificationToaster[0].innerHTML).not.toContain(notifTextError)
    const resendEmailButton = document.body.getElementsByClassName('p-toolbox-item__text')[2] as HTMLElement
    resendEmailButton.click()
    await nextTick()
    const {
      accountId,
    } = mockTableData[1]
    expect(postMock).toHaveBeenCalledWith(`/Activation/Invite?accountId=${accountId}&contactId=${contactId}`)
    const notificationContent = document.body.getElementsByClassName('el-notification__content')[1].innerHTML
    expect(notificationContent).toContain(notifTextError)
  })

  it('should emit clickDeploy when click on deploy button', async () => {
    await flushPromises()

    const { accountId, accountNumber, name } = mockTableData[0]

    const deployButton = document.body.getElementsByClassName('p-toolbox-item__text')[0] as HTMLElement
    deployButton.click()

    expect(wrapper.emitted('click-deploy')).toStrictEqual([[accountId, accountNumber, name]])
  })

  it('should emit event when click on checkbox', async () => {
    await flushPromises()

    const checkbox = document.body.getElementsByClassName('el-checkbox__original')[1] as HTMLElement
    checkbox.click()

    expect(wrapper.emitted('selectedFolder')).toStrictEqual([[testEntity.accountId]])
  })

  it('should emit access when click on access button', async () => {
    await flushPromises()

    const { accountId } = mockTableData[0]

    const accessButton = document.body.getElementsByClassName('p-toolbox-item__text')[1] as HTMLElement
    accessButton.click()

    expect(wrapper.emitted('access')).toStrictEqual([[accountId]])
  })
  it('should change ibs selected and emit access', () => {
    const ibsLink = document.body.getElementsByClassName('link')[0] as HTMLElement
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')
    const formattedEntity: Entity = {
      legalName: testEntity.legalName,
      accountId: testEntity.accountId,
      color: 'persian',
      accountNumber: testEntity.accountNumber,
    }
    ibsLink.click()

    expect(setItemSpy).toHaveBeenCalledWith('selected-entity', JSON.stringify(formattedEntity))
    expect(wrapper.emitted('access')).toStrictEqual([[testEntity.accountId]])
    expect(store.$patch).toHaveBeenCalledWith({
      user: {
        entities: {
          default: formattedEntity,
        },
      },
    })
  })

  it('should display the correct columns when the user is a collaborator', () => {
    const pTableColumns = wrapper.findAllComponents({ name: 'ElTableColumn' })
    collaboratorsColumnLabels.forEach((columnLabel, index) => {
      const indexSkiped = index + 1 // skip the first column
      const label = pTableColumns.at(indexSkiped)?.props('label')
      expect(label).toBe(columnLabel)
    })
  })

  it('should display the correct columns when the user is a client', async () => {
    store.$patch({
      isCollab: false,
    })
    await nextTick()
    const pTableColumns = wrapper.findAllComponents({ name: 'ElTableColumn' })
    clientsColumnLabels.forEach((columnLabel, index) => {
      const indexSkiped = index + 1 // skip the first column
      const label = pTableColumns.at(indexSkiped)?.props('label')
      expect(label).toBe(columnLabel)
    })
  })
})

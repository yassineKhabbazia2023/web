import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest'
import { nextTick } from 'vue'
import { mockTableData } from './mockData'
import {
  amplitudeServiceMock,
  SelectedEntityManagerMock,
  getStoreMock,
  getMockedUserInfo,
  CurrentUserManagerMock,
} from '@pulse/common/mocks'
import { useSelectedEntityStore, useUserStore } from '@pulse/common/stores'

import TableData from '.'

const selectedEntityStoreMock = getStoreMock(useSelectedEntityStore)
const userStoreMock = getStoreMock(useUserStore)

const handleFavorites = vi.fn()
const postMock = vi.fn()
const testEntity = {
  accountId: mockTableData[0].accountId,
  legalName: mockTableData[0].name,
  accountNumber: mockTableData[0].accountNumber,
}

vi.mock('@pulse/styleguide', () => ({
  PNotification: vi.fn(),
  AvatarRoles: vi.fn(),
}))

vi.mock('@pulse/common', () => ({
  commonApi: () => ({
    gateway: {
      post: postMock,
    },
  }),
  amplitudeService: amplitudeServiceMock,
}))

vi.mock('@pulse/common/managers', () => ({
  SelectedEntityManager: SelectedEntityManagerMock,
  CurrentUserManager: CurrentUserManagerMock,
}))

const createWrapper = (isAccountManagement: boolean = false): VueWrapper<any> =>
  mount(TableData, {
    props: {
      data: mockTableData,
      handleAddFavorite: handleFavorites,
      isAccountManagement,
    },
    global: {
      stubs: {
        PToolbox: {
          name: 'PToolbox',
          template: '<button><slot/></button>',
          events: ['p-toolbox-item-clicked'],
        },
        PCheckbox: {
          name: 'PCheckbox',
          template: '<div><slot /></div>',
        },
      },
    },
  })

const collaboratorsColumnLabels = [
  'Company name',
  'Customer code',
  'Leader',
  'Email',
  'City',
  'Status',
  'Options',
]
const clientsColumnLabels = [
  'Company name',
  'Customer code',
  'Leader',
  'Email',
  'City',
]

const userMock = getMockedUserInfo()

describe('tableData', () => {
  let wrapper: VueWrapper<any>

  beforeEach(async () => {
    vi.useFakeTimers()
    selectedEntityStoreMock.selectedEntity = testEntity
    userStoreMock.user = userMock
    userStoreMock.isCollab = true
    wrapper = createWrapper()

    await flushPromises()
  })

  afterEach(() => {
    postMock.mockReset()
    postMock.mockClear()
    wrapper.unmount()
  })

  it('calls function handle when click', async () => {
    const btnFavorite = wrapper.find(
      'td.el-table_1_column_1 [data-testid="wallet-remove-favorite"]',
    )
    await btnFavorite.trigger('click')

    expect(handleFavorites).toHaveBeenCalledTimes(1)
    expect(handleFavorites).toHaveBeenCalledWith(
      mockTableData[0].accountId,
      true,
    )
  })

  it('displays correctly the table', () => {
    const rows = wrapper.findAll('tr.el-table__row')

    expect(rows).toHaveLength(mockTableData.length)

    const {
      accountNumber,
      city,
      deploymentStatus: { text: deploymentStatusText },
      name,
      owner: { email, firstName, lastName },
    } = mockTableData[0]

    const firstRowText = rows[0].text()
    const mockData = [
      name,
      accountNumber,
      firstName,
      lastName,
      email,
      city,
      deploymentStatusText,
    ]
    mockData.forEach((data) => {
      expect(firstRowText).toContain(data)
    })
  })

  it('should be a correct link in the toolbox', () => {
    const walletToolbox = wrapper.findComponent({
      name: 'PToolbox',
    }) as VueWrapper
    walletToolbox.vm.$emit('p-toolbox-item-clicked', 'deploy')
    const rows = wrapper.findAll('tr.el-table__row')
    const firstRowText = rows[0]

    expect(firstRowText.find('.el-tag__content').text()).toBe('To Deploy')
  })

  it('should emit clickDeploy when click on deploy button', async () => {
    await flushPromises()

    const { accountId, accountNumber, name } = mockTableData[0]

    const walletToolbox = wrapper.findComponent({
      name: 'PToolbox',
    }) as VueWrapper
    walletToolbox.vm.$emit('p-toolbox-item-clicked', 'deploy')

    expect(wrapper.emitted('click-deploy')).toStrictEqual([
      [accountId, accountNumber, name],
    ])
  })

  it('should emit event when click on checkbox', async () => {
    await flushPromises()

    const checkbox = wrapper.findAllComponents({ name: 'PCheckbox' })[1]
    checkbox.trigger('change')
    await nextTick()

    const { accountNumber, accountId: id, legalName: name } = testEntity
    const {
      owner: { avatarColor },
    } = mockTableData[1]

    expect(wrapper.emitted('selectedFolder')).toStrictEqual([
      [
        {
          accountNumber,
          avatarColor,
          id,
          name,
        },
      ],
    ])
  })

  it('should emit access when click on access button', async () => {
    await flushPromises()

    const { accountId } = mockTableData[0]

    const walletToolbox = wrapper.findComponent({
      name: 'PToolbox',
    }) as VueWrapper
    walletToolbox.vm.$emit('p-toolbox-item-clicked', 'access')

    expect(wrapper.emitted('access')).toStrictEqual([[accountId]])
  })
  it('should change ibs selected and emit access', () => {
    const ibsLink = wrapper.find('[data-testid=account-access-link]')
    ibsLink.trigger('click')

    expect(wrapper.emitted('access')).toStrictEqual([[testEntity.accountId]])
  })

  it('should display the correct columns when the user is a collaborator', () => {
    const pTableColumns = wrapper.findAllComponents({ name: 'ElTableColumn' })
    collaboratorsColumnLabels.forEach((columnLabel, index) => {
      const indexSkipped = index + 1 // skip the first column
      const label = pTableColumns.at(indexSkipped)?.props('label')

      expect(label).toBe(columnLabel)
    })
  })

  it("should emit the 'manageAccountRights' event when the Manage Rights button is clicked", async () => {
    wrapper = createWrapper(true)
    await flushPromises()
    const { accountId, accountNumber, name } = mockTableData[0]
    const walletToolbox = wrapper.findComponent({
      name: 'PToolbox',
    }) as VueWrapper
    walletToolbox.vm.$emit('p-toolbox-item-clicked', 'manageAccountRights')
    await nextTick()

    expect(wrapper.emitted('displayAccountRightsDrawer')).toStrictEqual([
      [{ accountId, name, accountNumber }],
    ])
  })

  it("should emit 'displayResendActivationEmailDrawer' when Resend Activation Email button is clicked", async () => {
    wrapper = createWrapper(true)
    await flushPromises()
    const { accountId, accountNumber, name } = mockTableData[0]
    const walletToolbox = wrapper.findComponent({
      name: 'PToolbox',
    }) as VueWrapper
    walletToolbox.vm.$emit('p-toolbox-item-clicked', 'retryMassActivationEmail')
    await nextTick()

    expect(wrapper.emitted('displayResendActivationEmailDrawer')).toStrictEqual([
      [{ accountId, name, accountNumber }],
    ])
  })

  it('should display the correct columns when the user is a client', async () => {
    userStoreMock.isCollab = false
    await nextTick()
    const pTableColumns = wrapper.findAllComponents({ name: 'ElTableColumn' })
    clientsColumnLabels.forEach((columnLabel, index) => {
      const indexSkipped = index + 1 // skip the first column
      const label = pTableColumns.at(indexSkipped)?.props('label')

      expect(label).toBe(columnLabel)
    })
  })
})

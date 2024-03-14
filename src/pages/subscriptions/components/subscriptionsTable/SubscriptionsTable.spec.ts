import { describe, it, expect, vi, beforeEach } from 'vitest'
import { VueWrapper, flushPromises, mount } from '@vue/test-utils'
import { subscriptionRequestMock } from '../../mocks/SubscriptionRequestMock'
import SubscriptionsTable from '.'

const mockedPutRequests = vi.fn(() => Promise.resolve())

vi.mock('@kpmg/common', () => ({
  commonApi: () => ({
    offer: {
      get: vi.fn().mockResolvedValue({ data: subscriptionRequestMock }),
      put: mockedPutRequests
    }
  }),
  commonStore: () => ({
    $patch: vi.fn()
  })
}))

const requestMenu = [
  {
    pIconName: 'PIEye',
    pValue: 'Consult',
    pActionName: 'consult',
    pState: 'default'
  },
  {
    pIconName: 'PICheck',
    pValue: 'Validate request',
    pActionName: 'validate',
    pState: 'default'
  }
]

const pTableColumnsLabel: { [key: number]: string } = {
  0: 'Request date',
  1: 'Folder ID',
  2: 'Legal name',
  3: 'Principal Contact',
  4: 'Requester',
  5: 'Offer',
  6: 'Status'
}

describe('table-validations', () => {
  let wrapper: VueWrapper
  beforeEach(async () => {
    wrapper = mount(SubscriptionsTable)
    await flushPromises()
  })
  it('should render the subscription table correctly', () => {
    const pTable = wrapper.findComponent('[data-testid="table"]') as VueWrapper
    expect(pTable.exists()).toBeTruthy()

    const pTableColumns = pTable.findAllComponents({ name: 'ElTableColumn' })
    for (let i = 0; i <= 6; i++) {
      const pColumn = pTableColumns.at(i)
      expect(pColumn?.props('label')).toBe(pTableColumnsLabel[i])
    }

    const dataRows = pTable.findAll('tr.el-table__row')
    expect(dataRows.length).equals(subscriptionRequestMock.length)

    const cells = dataRows[0].findAll('td')
    const cellsText = cells.map((cell) => cell.text())
    const expected: string[] = [
      '3/24/2023',
      'V900000163',
      'Test Indicators 1',
      'TTTFirsName TLastNameTLastName+test@kpmg.onmicrosoft.com',
      'test-01@kpmg.fr',
      'Pennylane',
      'To validate',
      ''
    ]
    expect(cellsText).toMatchObject(expected)
  })

  it('should display subscription toolbox items', () => {
    const pToolbox = wrapper.findComponent({ name: 'PToolbox' })

    expect(pToolbox.props('pElements')).toStrictEqual(requestMenu)
  })

  it("should emit 'consult' event when the 'consult' button is clicked", async () => {
    const subscriptionToolbox = wrapper.findComponent('[data-testid=subscription-toolbox]') as VueWrapper
    subscriptionToolbox.vm.$emit('p-toolbox-item-clicked', 'consult')

    await flushPromises()

    expect(wrapper.emitted('consult')).toBeTruthy()
  })
})

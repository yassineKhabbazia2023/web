import { VueWrapper, flushPromises, mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import { subscriptionRequestMock } from '../../mocks/SubscriptionRequestMock'
import SubscriptionsTable from '.'

const mockedPutRequests = vi.fn(() => Promise.resolve())

vi.mock('@kpmg/common', () => ({
  commonApi: () => ({
    subscription: {
      get: vi.fn().mockResolvedValue({ data: subscriptionRequestMock }),
      put: mockedPutRequests
    }
  }),
  commonStore: () => ({
    $patch: vi.fn()
  })
}))

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
  it('renders the table correctly', async () => {
    const wrapper = mount(SubscriptionsTable)
    await flushPromises()

    const pTable = wrapper.findComponent('[data-ut="table"]') as VueWrapper
    expect(pTable.exists()).toBeTruthy()

    const pTableColumns = pTable.findAllComponents({ name: 'ElTableColumn' })
    for (let i = 0; i <= 6; i++) {
      const pColumn = pTableColumns.at(i)
      expect(pColumn?.props('label')).toBe(pTableColumnsLabel[i])
    }

    const dataRows = pTable.findAll('tr.el-table__row')
    expect(dataRows.length).equals(subscriptionRequestMock.length)

    const cells = dataRows[0].findAll('td')
    const firstRowData: { [key: number]: string | Date } = {
      1: 'V900000163',
      2: 'Test Indicators 1',
      3: 'TTTFirsName TLastNameTLastName+test@kpmg.onmicrosoft.com',
      4: 'test-01@kpmg.fr',
      5: 'Pennylane',
      6: 'To validate',
      7: 'Validate request'
    }
    cells.forEach((cell, cellIndex) => {
      if (cellIndex > 0) {
        expect(cell.text()).toBe(firstRowData[cellIndex])
      }
    })
  })

  it('should validate the subscription on click', async () => {
    const wrapper = mount(SubscriptionsTable)
    await flushPromises()

    const validateButton = wrapper.findComponent('[data-ut="validateButton"]')
    await validateButton?.trigger('click')
    const subscriptionId = subscriptionRequestMock.at(0)?.subscriptionId
    expect(mockedPutRequests)
      .toHaveBeenCalledWith(`subscription?subscriptionId=${subscriptionId}`)
  })
})

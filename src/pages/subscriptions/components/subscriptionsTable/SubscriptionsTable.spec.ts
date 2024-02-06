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
    wrapper = mount(SubscriptionsTable, { attachTo: document.body })
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
    const firstRowData: { [key: number]: string | Date } = {
      1: 'V900000163',
      2: 'Test Indicators 1',
      3: 'TTTFirsName TLastNameTLastName+test@kpmg.onmicrosoft.com',
      4: 'test-01@kpmg.fr',
      5: 'Pennylane',
      6: 'To validate'
    }
    cells.forEach((cell, cellIndex) => {
      if (cellIndex > 0 && cellIndex !== cells.length - 1) {
        expect(cell.text()).toBe(firstRowData[cellIndex])
      }
    })
  })

  it('should display subscription toolbox items', () => {
    const consultButton = document.body.getElementsByClassName('p-toolbox-item__text')[0] as HTMLElement
    const validateButton = document.body.getElementsByClassName('p-toolbox-item__text')[1] as HTMLElement

    expect(consultButton.innerHTML).toBe('Consult')
    expect(validateButton.innerHTML).toBe('Validate request')
  })

  it("should emit 'consult' event when the 'consult' button is clicked", async () => {
    const subscriptionToolbox = wrapper.findComponent('[data-testid=subscription-toolbox]') as VueWrapper
    subscriptionToolbox.vm.$emit('p-toolbox-item-clicked', 'consult')

    await flushPromises()

    expect(wrapper.emitted('consult')).toBeTruthy()
  })
})

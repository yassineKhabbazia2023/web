import { flushPromises, shallowMount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockedCollaboratorsList2 } from '@entities/__mocks__/collaborators.mocks'
import { loggerErrorSpy, loggerMock } from '@pulse/core/mocks'
import { noResult } from '@entities/__mocks__/no-result.mocks'
import * as walletServices from '@entities/services/wallet'
import Collaborators from '.'
 
const mockGatewayGet = vi.fn(() => {
  return Promise.resolve({
    data: mockedCollaboratorsList2,
  })
})

vi.mock('@pulse/core', () => ({ logger: loggerMock }))

vi.mock('@pulse/common', () => ({
  commonApi: () => ({
    gateway: {
      get: mockGatewayGet,
    },
  }),
  commonStore: () => ({
    $patch: vi.fn(),
  }),
  userPermissions: () => ({
    hasPermission: () => vi.fn(),
  }),
}))

const createWrapper = (): VueWrapper<any> =>
  shallowMount(Collaborators, {
    global: {
      stubs: {
        PLoader: true,
        NoResult: true,
        FormSearch: true,
        PPagination: true,
        TableData: true,
      },
    },
  })

const { items, totalPages } = mockedCollaboratorsList2
let wrapper: VueWrapper<any>

const getTableBody = () => wrapper.find('table tbody')

const checkRowContent = (rowIndex: number) => {
  const row = getTableBody().findAll('tr')[rowIndex]
  const rowContent = row.text()
  const [, ...rest] = Object.values(items[rowIndex])
  const itemValues = rest
  const itemValuesWithoutMobilePhone = itemValues.filter((_value, index) => index !== 4 &&
   index !== 5 && index !== 7 && index !== 8)
  itemValuesWithoutMobilePhone.forEach(value => {
    if (typeof value === 'boolean') {
      const inputSwitch = getTableBody().find(`tr:nth-child(${rowIndex + 1}) input`)
      expect(inputSwitch.attributes('aria-checked')).toBe((value as boolean).toString())
    } else {
      expect(rowContent).toContain(value)
    }
  })
}

describe('collaborators', () => {
  beforeEach(async () => {
    wrapper = createWrapper()
  })

  noResult(createWrapper())

  it('should display data in a table', async () => {
    const table = wrapper.findComponent({ name: 'TableData' })
    expect(table.exists()).toBeTruthy()

    const data = table.props('data')
    expect(data).toHaveLength(items.length)
  })

  it('has a pagination', () => {
    const pPagination = wrapper.findComponent({ name: 'PPagination' })
    expect(pPagination.exists()).toBeTruthy()
  })

  it("should update the limit and current page when the 'onPageRangeChanged' event is triggered", () => {
    const pagination = wrapper.findComponent({ name: 'PPagination' })
    pagination.vm.$emit('on-page-range-changed', 30)

    expect(wrapper.vm.state.limit).toBe(30)
    expect(wrapper.vm.state.currentPage).toBe(1)
  })

  it('should log an error to the console if the API fails to fetch the collaborators', async () => {
    const expectedErrorMessage = 'API Error: 503 Service Unavailable'

    vi.spyOn(walletServices, 'getCollaborators').mockRejectedValue(expectedErrorMessage)
    wrapper = createWrapper()
    await flushPromises()

    expect(loggerErrorSpy).toHaveBeenCalledOnce()
    expect(wrapper.vm.state.data).toStrictEqual([])
    expect(loggerErrorSpy).toHaveBeenCalledWith(expectedErrorMessage)
  })

  it('update collaborators details when event is emitted', () => {
    const tableData = wrapper.findComponent({ name: 'TableData' })
    expect(tableData.exists()).toBeTruthy()
    tableData.vm.$emit('update-collaborator-details', mockedCollaboratorsList2.items[0])
    const collaboratorIndex = wrapper.vm.state.data.findIndex((c: { id: number }) => c.id === mockedCollaboratorsList2.items[0].id)
    expect(collaboratorIndex).not.toBe(-1)
    expect(wrapper.vm.state.data[collaboratorIndex].mobilePhone).toBe(mockedCollaboratorsList2.items[0].mobilePhone)
  })

  it('update collaborators role when event is emitted', () => {
    const tableData = wrapper.findComponent({ name: 'TableData' })
    expect(tableData.exists()).toBeTruthy()
    tableData.vm.$emit('update-collaborator-role', mockedCollaboratorsList2.items[0])
    const collaboratorIndex = wrapper.vm.state.data.findIndex((c: { id: number }) => c.id === mockedCollaboratorsList2.items[0].id)
    expect(collaboratorIndex).not.toBe(-1)
    expect(wrapper.vm.state.data[collaboratorIndex].role).toBe(mockedCollaboratorsList2.items[0].persona.name)
  })

  it('should fetch documents upon sort change', async () => {
    const tableWrapper = wrapper.findComponent({ name: 'TableData' })

    await tableWrapper.vm.$emit('on-sort-change', '+email')

    expect(mockGatewayGet).toHaveBeenCalledTimes(2)
  })
})

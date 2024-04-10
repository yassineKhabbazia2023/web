import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { noResult } from '@/../tests'
import mock from './mockCollaborators.json'
import Collaborators from './'
import { nextTick } from 'vue'
import TableData from './components/TableData/TableData.vue'

const mockGatewayGet = vi.fn(() => {
  return Promise.resolve({
    data: mock,
  })
})

vi.mock('@kpmg/common', () => ({
  commonApi: () => ({
    gateway: {
      get: mockGatewayGet,
    },
  }),
  commonStore: () => ({
    $patch: vi.fn(),
  }),
}))
const createWrapper = (): VueWrapper<any> =>
  mount(Collaborators)

const { items, totalPages } = mock
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
    await flushPromises()
  })

  noResult(createWrapper())

  it('should display data in a table', async () => {
    await nextTick()
    expect(getTableBody().findAll('tr')).toHaveLength(items.length)

    checkRowContent(0)
    checkRowContent(items.length - 1)
  })

  it('has a pagination', () => {
    const pages = wrapper.findAll('.el-pager li')
    expect(pages).toHaveLength(totalPages)
  })

  it('update collaborators details when event is emitted', () => {
    const tableData = wrapper.findComponent(TableData)
    expect(tableData.exists()).toBeTruthy()
    tableData.vm.$emit('update-collaborator-details', mock.items[0])
    const collaboratorIndex = wrapper.vm.state.data.findIndex((c: { id: number }) => c.id === mock.items[0].id)
    expect(collaboratorIndex).not.toBe(-1)
    expect(wrapper.vm.state.data[collaboratorIndex].mobilePhone).toBe(mock.items[0].mobilePhone)
  })

  it('update collaborators role when event is emitted', () => {
    const tableData = wrapper.findComponent(TableData)
    expect(tableData.exists()).toBeTruthy()
    tableData.vm.$emit('update-collaborator-role', mock.items[0])
    const collaboratorIndex = wrapper.vm.state.data.findIndex((c: { id: number }) => c.id === mock.items[0].id)
    expect(collaboratorIndex).not.toBe(-1)
    expect(wrapper.vm.state.data[collaboratorIndex].role).toBe(mock.items[0].persona.name)
  })

  it('should fetch documents upon sort change', async () => {
    const tableWrapper = wrapper.findComponent(TableData)

    await tableWrapper.vm.$emit('on-sort-change', '+email')

    expect(mockGatewayGet).toHaveBeenCalledTimes(2)
  })
})

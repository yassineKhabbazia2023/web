import { mount, VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { searchError, noResult } from '@/tests'
import mock from './mock.json'
import Collaborators from './'

const createWrapper = (): VueWrapper<any> =>
  mount(Collaborators)

const { items, totalPages } = mock.data
let wrapper: VueWrapper<any>

const getTableBody = () => wrapper.find('table tbody')

const checkRowContent = (rowIndex: number) => {
  const row = getTableBody().findAll('tr')[rowIndex]
  const rowContent = row.text()
  const [, ...rest] = Object.values(items[rowIndex])
  const itemValues = rest
  const itemValuesWithoutMobilePhone = itemValues.filter((_value, index) => index !== 4)
  itemValuesWithoutMobilePhone.forEach(value => {
    if (typeof value === 'boolean') {
      const inputSwitch = getTableBody().find(`tr:nth-child(${rowIndex + 1}) input`)
      expect(inputSwitch.attributes('aria-checked')).toBe(value.toString())
    } else {
      expect(rowContent).toContain(value)
    }
  })
}

describe('collaborators', () => {
  beforeEach(() => {
    wrapper = createWrapper()
  })

  searchError(createWrapper())
  noResult(createWrapper())

  it('should display data in a table', () => {
    expect(getTableBody().findAll('tr')).toHaveLength(items.length)

    checkRowContent(0)
    checkRowContent(items.length - 1)
  })

  it('has a pagination', () => {
    const pages = wrapper.findAll('.el-pager li')
    expect(pages).toHaveLength(totalPages)
  })
})

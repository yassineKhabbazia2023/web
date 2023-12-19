import { createTestingPinia } from '@pinia/testing'
import { VueWrapper, flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, it, expect, vi } from 'vitest'
import { nextTick } from 'vue'
import { defineStore } from 'pinia'
import { mockTableData } from './mockData'
import { commonStore } from '@kpmg/common'
import TableData from './'

const handleFavorites = vi.fn()

vi.mock('@kpmg/common', () => ({
  commonStore: defineStore('common', {
    state: () => ({
      user: {}
    })
  })
}))

const pinia = createTestingPinia()

const createWrapper = (): VueWrapper<any> =>
  mount(TableData, {
    props: {
      data: mockTableData,
      handleAddFavorite: handleFavorites
    },
    attachTo: document.body,
    global: {
      plugins: [pinia]
    }
  })

describe('tableData', () => {
  let wrapper: VueWrapper<any>
  let store: any

  beforeEach(async () => {
    vi.useFakeTimers()
    wrapper = createWrapper()
    store = commonStore(pinia)

    store.$patch({
      user: {}
    })

    await flushPromises()
  })

  it('calls function handle when click', async () => {
    const btnFavorite = wrapper.find('td.el-table_1_column_6 button')
    await btnFavorite.trigger('click')
    expect(handleFavorites).toHaveBeenCalledTimes(1)
    expect(handleFavorites).toHaveBeenCalledWith(mockTableData[0].id, true)
  })

  it('displays correctly the table', () => {
    const rows = wrapper.findAll('tr.el-table__row')
    expect(rows).toHaveLength(mockTableData.length)

    const {
      accountNumber,
      city,
      deploymentStatus: { text: deploymentStatusText },
      name,
      owner: {
        email,
        firstName,
        lastName
      }
    } = mockTableData[0]

    const firstRowText = rows[0].text()
    const mockData = [name, accountNumber, firstName, lastName, email, city, deploymentStatusText]
    mockData.forEach(data => {
      expect(firstRowText).toContain(data)
    })
  })

  it('has a link to deploy the folder', () => {
    const getPopoverContent = () => document.body.getElementsByClassName('p-toolbox-item__text')[0].innerHTML
    expect(getPopoverContent()).toContain('Deploy this folder')
  })

  it('should emit clickDeploy when click on deploy button', async () => {
    await flushPromises()

    const deployButton = document.body.getElementsByClassName('p-toolbox-item__text')[0] as HTMLElement
    deployButton.click()

    expect(wrapper.emitted('clickDeploy')).toBeTruthy()
  })

  it('has the first entity selected by default', async () => {
    const { id: idAccount, name } = mockTableData[0]

    vi.advanceTimersByTime(250)
    await nextTick()

    const firstRow = wrapper.find('tr.el-table__row')
    expect(firstRow.attributes('class')).toContain('current-row')
    expect(firstRow.text()).toContain(name)

    expect(store.$patch).toHaveBeenCalledWith({
      user: {
        entities: {
          default: {
            idAccount,
            name
          }
        }
      }
    })
  })

  it('can select another entity', async () => {
    const { id: idAccount, name } = mockTableData[1]

    const secondRow = wrapper.findAll('tr.el-table__row').at(1)
    expect(secondRow?.attributes('class')).not.toContain('current-row')

    await secondRow?.trigger('click')

    expect(secondRow?.attributes('class')).toContain('current-row')
    expect(store.$patch).toHaveBeenLastCalledWith({
      user: {
        entities: {
          default: {
            idAccount,
            name
          }
        }
      }
    })
  })
})

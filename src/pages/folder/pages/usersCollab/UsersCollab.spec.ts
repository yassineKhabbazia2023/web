import { VueWrapper, mount } from '@vue/test-utils'
import { beforeEach, describe, it, expect } from 'vitest'
import { dataFromApi } from './mockData'
import UsersCollab from './'

const createWrapper = (): VueWrapper<any> =>
  mount(UsersCollab, {
    attachTo: document.body
  })

describe('UsersCollab', () => {
  let wrapper: VueWrapper<any>

  beforeEach(() => {
    wrapper = createWrapper()
  })

  it('displays correctly the table', () => {
    const rows = wrapper.findAll('tr.el-table__row')
    expect(rows).toHaveLength(dataFromApi.data.items.length)
    const {
      firstName,
      lastName,
      email,
      role,
      firstDateAccess
    } = dataFromApi.data.items[0]
    const mockData = [firstName, lastName, email, 'Connected', role, firstDateAccess]
    const firstRowText = rows[0].text()
    mockData.forEach(data => {
      expect(firstRowText).toContain(data)
    })
  })
  it('displays the pBlockHeader', () => {
    const blockHeader = wrapper.findComponent('[data-testid=pblockHeaders]') as VueWrapper
    expect(blockHeader.exists()).toBeTruthy()
  })
})

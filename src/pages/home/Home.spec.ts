// import { defineStore } from 'pinia'
import { describe, it, expect, vi } from 'vitest'
import wrapperFactory from '../../../tests/utils/wrapperFactory'
import { getMandatesCollection } from '@/services/mandate'
import Home from '@/pages/home'
import { getMockedMandatesList } from '@/../tests/mocks/mandateMock'

const mandatesList = getMockedMandatesList()

/* vi.mock('@kpmg/common', () => ({
  commonStore: defineStore('common', {
    state: () => ({})
  })
})) */

vi.mock('@/services/mandate', () => ({
  getMandatesCollection: vi.fn(() => {
    return Promise.resolve({
      data: mandatesList,
    })
  }),
}))

const createWrapper = (props: any) =>
  wrapperFactory(Home, {
    props,
  })

describe('componentName.vue', () => {
  it('should call api with search term', async () => {
    const wrapper = createWrapper({})
    vi.useFakeTimers()
    const inputValue = 'BNP Paribas'
    await wrapper.find('.btn-next').trigger('click')
    const ibsInputElement = wrapper
      .find('input[data-testid="search-mandate-test"]')
    await ibsInputElement
      .setValue(inputValue)
    await ibsInputElement.trigger('change')
    await vi.advanceTimersByTimeAsync(550)
    expect(getMandatesCollection).toHaveBeenLastCalledWith({
      skip: 0,
      limit: 10,
      searchTerm: inputValue,
      sortCriteria: '',
      sortOrder: 'Descending',
    })
  })
})

import { defineStore } from 'pinia'
import type { SpyInstance } from 'vitest'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import wrapperFactory from '../../../tests/utils/wrapperFactory'
import Home from '@/pages/home'
import * as mandateService from '@/services/mandate'
import { getMockedMandatesList } from '@/../tests/mocks/mandateMock'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { nextTick } from 'vue'
import type { AxiosResponse } from 'axios'

vi.mock('@/services/mandate')
vi.mock('@kpmg/common', () => ({
  commonStore: defineStore('common', {
    state: () => ([]),
  }),
}))

const createWrapper = (props: any) =>
  wrapperFactory(Home, {
    props,
  })

describe('test Home.vue', () => {
  let wrapper: VueWrapper
  let mockedGetMandatesCollection: SpyInstance
  beforeEach(() => {
    mockedGetMandatesCollection = vi
      .spyOn(mandateService, 'getMandatesCollection')
      .mockImplementation(() => {
        const mandatesList = getMockedMandatesList()

        return Promise.resolve({
          data: mandatesList,
        } as AxiosResponse<any, any>)
      })
    wrapper = createWrapper({})
  })

  it('should call mockedGetMandatesCollection only once when Header emits "refresh-mandate-collection" twice', () => {
    const pagination = wrapper.findComponent({ name: 'Pagination' })

    pagination.vm.$emit('page-selected', {
      currentPage: 2,
    })
    const expectedParams = {
      limit: 10,
      searchTerm: '',
      skip: 10,
      sortCriteria: '',
      sortOrder: 'Descending',
      statusCodes: [],
    }

    expect(mockedGetMandatesCollection).toHaveBeenCalledTimes(2)
    expect(mockedGetMandatesCollection).toHaveBeenLastCalledWith(expectedParams)
  })

  it('should call mockedGetMandatesCollection when Header emits "refresh-mandate-collection"', () => {
    const header = wrapper.findComponent({ name: 'Header' })
    expect(mockedGetMandatesCollection).toHaveBeenCalledOnce()

    header.vm.$emit('refresh-mandate-collection', {})
    expect(mockedGetMandatesCollection).toHaveBeenCalledTimes(2)
  })

  it('should call console.error when mockedGetMandatesCollection throws an error', async () => {
    const header = wrapper.findComponent({ name: 'Header' })
    const error = 'thrown-error'
    const consoleErrorSpy = vi.spyOn(console, 'error')
    mockedGetMandatesCollection.mockRejectedValueOnce(error)

    header.vm.$emit('refresh-mandate-collection', {})
    await nextTick()
    await flushPromises()

    expect(consoleErrorSpy).toHaveBeenCalledOnce()
    expect(consoleErrorSpy).toHaveBeenNthCalledWith(1, error)
  })

  it('should call api with search term', async () => {
    vi.useFakeTimers()
    const inputValue = 'BNP Paribas'
    await wrapper.find('.btn-next').trigger('click')
    const ibsInputElement = wrapper
      .find('input[data-testid="mandate-search-bar"]')
    await ibsInputElement
      .setValue(inputValue)
    await ibsInputElement.trigger('change')
    await vi.advanceTimersByTimeAsync(550)
    expect(mockedGetMandatesCollection).toHaveBeenLastCalledWith({
      skip: 0,
      limit: 10,
      searchTerm: inputValue,
      sortCriteria: '',
      sortOrder: 'Descending',
      statusCodes: [],
    })
  })

  it('should call console.error when mockedGetMandatesCollection throws an error since begining', async () => {
    const error = 'thrown-error'
    mockedGetMandatesCollection.mockRejectedValueOnce(error)
    const consoleErrorSpy = vi.spyOn(console, 'error')

    createWrapper({})
    await flushPromises()

    expect(consoleErrorSpy).toHaveBeenCalledOnce()
    expect(consoleErrorSpy).toHaveBeenNthCalledWith(1, `Error in mandate mount ${error}`)
  })
})

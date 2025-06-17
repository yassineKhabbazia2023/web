import { nextTick, reactive } from 'vue'
import type { MockInstance } from 'vitest'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { loggerErrorSpy, loggerMock } from '@pulse/core/mocks'
import { getMockedMandatesList } from '@mandate/__mocks__/mandate.mocks'
import wrapperFactory from '@mandate/__mocks__/wrapper.factory'
import { amplitudeServiceMock, amplitudeServiceTrackMock } from '@pulse/common/mocks'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import type { AxiosResponse } from 'axios'
import type { SearchMandateParams } from '@mandate/services/mandate/ServiceMandateTypes'
import * as mandateService from '@mandate/services/mandate'
import Home from '@mandate/pages/mandate'

vi.mock('@pulse/core', () => ({ logger: loggerMock, useDebounce: (fn: any) => fn }))

const routerQuery = vi.hoisted(() => vi.fn(() => ''))
vi.mock('vue-router', () => ({
  useRoute: () =>
    reactive({
      name: 'mandate',
      query: {
        bankAccountNumber: routerQuery(),
      },
    }),
}))

vi.mock('@mandate/services/mandate')
vi.mock('@pulse/common', () => ({
  amplitudeService: amplitudeServiceMock,
}))

const createWrapper = (props: any) =>
  wrapperFactory(Home, {
    props,
    global: {
      stubs: {
        Header: true,
        PLoader: true,
        ListMandate: true,
      },
    },
  })

const baseParams: SearchMandateParams = {
  limit: 15,
  searchTerm: '',
  currentPage: 2,
  sortCriteria: '',
  sortOrder: 'Descending',
  statusCodes: [],
  creationDateStart: '',
  creationDateEnd: '',
  modificationDateStart: '',
  modificationDateEnd: '',
}

describe('test Mandate.vue', () => {
  let wrapper: VueWrapper
  let mockedGetMandatesCollection: MockInstance
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

    expect(mockedGetMandatesCollection).toHaveBeenCalledTimes(2)
    expect(mockedGetMandatesCollection).toHaveBeenLastCalledWith(baseParams)
  })

  it('should call mockedGetMandatesCollection when Header emits "refresh-mandate-collection"', () => {
    const header = wrapper.findComponent({ name: 'Header' })
    expect(mockedGetMandatesCollection).toHaveBeenCalledOnce()

    const eventBody = {
      ...baseParams,
      statusCodes: [10],
    }
    header.vm.$emit('refresh-mandate-collection', eventBody)
    expect(mockedGetMandatesCollection).toHaveBeenCalledWith(eventBody)
    expect(mockedGetMandatesCollection).toHaveBeenCalledTimes(2)
  })

  it('should call logger.error when mockedGetMandatesCollection throws an error', async () => {
    const header = wrapper.findComponent({ name: 'Header' })
    const error = 'thrown-error'
    const expected = `Error while refresh data ${error}`

    mockedGetMandatesCollection.mockRejectedValueOnce(error)

    header.vm.$emit('refresh-mandate-collection', {})
    await nextTick()
    await flushPromises()

    expect(loggerErrorSpy).toHaveBeenCalledOnce()
    expect(loggerErrorSpy).toHaveBeenNthCalledWith(1, expected)
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
    const expected: SearchMandateParams = {
      ...baseParams,
      searchTerm: inputValue,
      currentPage: 1,
    }

    expect(amplitudeServiceTrackMock).toHaveBeenCalledWith('Bank Mandate Searched', {
      bank_mandate_search: inputValue,
    })
    expect(mockedGetMandatesCollection).toHaveBeenLastCalledWith(expected)
  })

  it('should call logger.error when mockedGetMandatesCollection throws an error since beginning', async () => {
    const error = 'thrown-error'
    mockedGetMandatesCollection.mockRejectedValueOnce(error)


    createWrapper({})
    await flushPromises()

    expect(loggerErrorSpy).toHaveBeenCalledOnce()
    expect(loggerErrorSpy).toHaveBeenNthCalledWith(1, `Error while refresh data ${error}`)
  })

  it('should apply the bank account number from query if available', async () => {
    const mockQueryValue = '12345'
    routerQuery.mockReturnValueOnce(mockQueryValue)
    const baseParamsWithQuery: SearchMandateParams = {
      ...baseParams,
      currentPage: 1,
      searchTerm: mockQueryValue,
    }
    createWrapper({})
    await flushPromises()
    expect(mockedGetMandatesCollection).toHaveBeenCalledWith(baseParamsWithQuery)
  })
})

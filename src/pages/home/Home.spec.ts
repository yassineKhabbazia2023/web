// import { defineStore } from 'pinia'
import { describe, it, expect, vi } from 'vitest'
import wrapperFactory from '../../../tests/utils/wrapperFactory'
import { getMandatesCollection } from '@/services/mandate'
import Home from '@/pages/home'

const mandatesList = {
  counters: {
    all: 3,
    status10: 0,
    status20: 3,
    status30: 1,
    status40: 1,
    status50: 0
  },
  data: [
    {
      id: 'e4ec92f2-a375-4574-b6de-235a9fe13028',
      erpId: '1000265308',
      companyName: 'Boulangerie du canal',
      accountNumber: '66842913356',
      bankName: 'Crédit Agricole',
      creationDate: '2022-04-14T13:12:31.926Z',
      modificationDate: '2023-09-17T13:12:31.926Z',
      statusCode: '40'
    },
    {
      id: 'e4ec92f2-a375-4574-b6de-235a9fe13029',
      erpId: '1000265309',
      companyName: 'Fleurs and co.',
      accountNumber: '66842913357',
      bankName: 'BNP Paribas',
      creationDate: '2021-09-14T13:12:31.926Z',
      modificationDate: '2023-08-17T13:12:31.926Z',
      statusCode: '20'
    },
    {
      id: 'e4ec92f2-a375-4574-b6de-235a9fe13030',
      erpId: '1000265310',
      companyName: 'La compagnie du voyage',
      accountNumber: '66842913358',
      bankName: 'Société Générale',
      creationDate: '2020-08-14T13:12:31.926Z',
      modificationDate: '2023-06-11T13:12:31.926Z',
      statusCode: '30'
    }
  ]
}

/* vi.mock('@kpmg/common', () => ({
  commonStore: defineStore('common', {
    state: () => ({})
  })
})) */

vi.mock('@/services/mandate', () => ({
  getMandatesCollection: vi.fn(() => {
    return Promise.resolve({
      data: mandatesList
    })
  })
}))

const createWrapper = (props: any) =>
  wrapperFactory(Home, {
    props
  })

describe('componentName.vue', () => {
  it('renders Header component', async () => {
    const wrapper = createWrapper({})
    vi.useFakeTimers()
    const inputValue = 'BNP Paribas'
    await wrapper.find('.btn-next').trigger('click')
    const ibsInputElement = wrapper
      .find('input[data-testid="search-mandate-test"]')
    await ibsInputElement
      .setValue(inputValue)
    await ibsInputElement.trigger('change')
    await vi.waitUntil(
      () => (ibsInputElement.element as HTMLInputElement).value
    )
    expect(getMandatesCollection).toHaveBeenLastCalledWith({
      skip: 0,
      limit: 10,
      searchTerm: inputValue
    })
  })
})

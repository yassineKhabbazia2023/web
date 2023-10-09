import wrapperFactory from '../../../../tests/utils/wrapperFactory'
import Table from '.'
import { expect, describe, it } from 'vitest'
import { waitForAsyncImports } from '@kpmg/common/src/testing-helpers'

const createWrapper = (props: any = {}) =>
  wrapperFactory(Table, { props })
describe('mandate collection', () => {
  it('renders the mandate table', async () => {
    const wrapper = createWrapper({
      data: [
        {
          id: 'e4ec92f2-a375-4574-b6de-235a9fe13028',
          erpId: '1000265308',
          companyName: 'Boulangerie du canal',
          accountNumber: '66842913356',
          bankName: 'Crédit Agricole',
          creationDate: '2023-08-14T13:12:31.926Z',
          modificationDate: '2023-08-14T13:12:31.926Z',
          statusCode: '40'
        },
        {
          id: 'e4ec92f2-a375-4574-b6de-235a9fe13029',
          erpId: '1000265309',
          companyName: 'Fleurs and co.',
          accountNumber: '66842913357',
          bankName: 'BNP Paribas',
          creationDate: '2023-08-14T13:12:31.926Z',
          modificationDate: '2023-08-14T13:12:31.926Z',
          statusCode: '20'
        },
        {
          id: 'e4ec92f2-a375-4574-b6de-235a9fe13030',
          erpId: '1000265310',
          companyName: 'La compagnie du voyage',
          accountNumber: '66842913358',
          bankName: 'Société Générale',
          creationDate: '2023-08-14T13:12:31.926Z',
          modificationDate: '2023-08-14T13:12:31.926Z',
          statusCode: '30'
        }
      ]
    })
    await waitForAsyncImports(2)
    expect(wrapper.exists()).toBeTruthy()
  })

})

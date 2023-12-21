import wrapperFactory from '../../../../tests/utils/wrapperFactory'
import Table from '.'
import { expect, describe, it, vi } from 'vitest'
import * as mandateService from '@/services/mandate'

interface CustomWindow extends Window {
  showSaveFilePicker?: (_: any) => Promise<any>
}
declare let window: CustomWindow

vi.mock('@/services/mandate', () => {
  return {
    downloadUnsignedMandate: vi.fn(() => {
      // Mock implementation or return value for downloadUnsignedMandate
      return Promise.resolve(Promise.resolve({ data: 'pdf-data' }))
    }),
    downloadSignedMandate: vi.fn(() => {
      // Mock implementation or return value for downloadSignedMandate
      return Promise.resolve(Promise.resolve({ data: 'pdf-data' }))
    })
  }
})

vi.mock('@/helpers/utils', () => {
  return {
    dateFormatter: vi.fn(),
    debounce: vi.fn(),
    downloadFile: vi.fn()
  }
})

const mockShowSaveFilePicker = (withShowSaveFilePicker: boolean = true) => {
  if (withShowSaveFilePicker) {
    // Resetting the window object to its original state before each test
    window = Object.create(window)
    document.body.innerHTML = ''

    const writableStreamMock = {
      write: vi.fn(),
      close: vi.fn()
    }
    const fileHandleMock = {
      createWritable: vi.fn(() => Promise.resolve(writableStreamMock))
    }

    // Mocking window.showSaveFilePicker directly
    window.showSaveFilePicker = vi.fn(() => Promise.resolve(fileHandleMock))
  } else {
    // Mocking window.showSaveFilePicker directly
    window.showSaveFilePicker = undefined
  }
}

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
    expect(wrapper.exists()).toBeTruthy()
  })

  it('renders the mandate table click on download unsigned mandate', async () => {
    const wrapper = createWrapper({
      data: []
    })

    mockShowSaveFilePicker()

    const mandate = { id: '123' }

    // Trigger the action
    await wrapper.vm.actionClicked('download-pre-filled-mandate', mandate)

    // Assert that the correct service function was called
    expect(mandateService.downloadUnsignedMandate).toHaveBeenCalledWith(mandate.id)
  })

  it('renders the mandate table click on download signed mandate', async () => {
    const wrapper = createWrapper({
      data: []
    })

    mockShowSaveFilePicker()

    const mandate = { id: '123' }

    // Trigger the action
    await wrapper.vm.actionClicked('download-signed-mandate', mandate)

    // Assert that the correct service function was called
    expect(mandateService.downloadSignedMandate).toHaveBeenCalledWith(mandate.id)
  })

  it('renders the mandate table click on download signed mandate without showSaveFilePicker',
    async () => {
      const wrapper = createWrapper({
        data: []
      })

      mockShowSaveFilePicker(false)

      const mandate = { id: '123' }

      // Trigger the action
      await wrapper.vm.actionClicked('download-signed-mandate', mandate)

      // Assert that the correct service function was called
      expect(mandateService.downloadSignedMandate).toHaveBeenCalledWith(mandate.id)
    })
})

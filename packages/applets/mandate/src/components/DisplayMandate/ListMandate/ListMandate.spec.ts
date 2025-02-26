import { expect, describe, it, vi } from 'vitest'
import { utilsMocks } from '@mandate/__mocks__/utils.mocks'
import wrapperFactory from '@mandate/__mocks__/wrapper.factory'
import { getMockedMandatesData } from '@mandate/__mocks__/mandate.mock'
import { amplitudeServiceMock, amplitudeTrackMock } from '@mandate/__mocks__/amplitude.mocks'
import { mockedNotification, notificationHelperMock, showNotificationMock } from '@mandate/__mocks__/notification.helper.mocks'
import * as mandateService from '@mandate/services/mandate'
import { nextTick } from 'vue'
import { flushPromises } from '@vue/test-utils'
import Table from '.'

interface Window {
  showSaveFilePicker: any
  URL: any
}
declare let window: Window
declare let document: any

const currentPage = 1

vi.mock('@mandate/helpers/NotificationHelper', () => notificationHelperMock)
vi.mock('@mandate/helpers/utils', () => utilsMocks)
vi.mock('@pulse/common', () => ({
  amplitudeService: amplitudeServiceMock,
}))


vi.mock('@mandate/services/mandate', () => {
  return {
    downloadUnsignedMandate: vi.fn(() => {
      // Mock implementation or return value for downloadUnsignedMandate
      return Promise.resolve(Promise.resolve({ data: 'pdf-data' }))
    }),
    downloadSignedMandate: vi.fn(() => {
      // Mock implementation or return value for downloadSignedMandate
      return Promise.resolve(Promise.resolve({ data: 'pdf-data' }))
    }),
    terminateMandate: vi.fn(() => {
      // Mock implementation or return value for terminateMandate
      return Promise.resolve(Promise.resolve({ data: {} }))
    }),
    uploadSignedMandate: vi.fn(() => {
      // Mock implementation or return value for terminateMandate
      return Promise.resolve(Promise.resolve(true))
    }),
  }
})

const mockShowSaveFilePicker = (withShowSaveFilePicker: boolean = true) => {
  if (withShowSaveFilePicker) {
    // Resetting the window object to its original state before each test
    window = Object.create(window)
    const writableStreamMock = {
      write: vi.fn(() => Promise.resolve()),
      close: vi.fn(() => Promise.resolve()),
    }
    const fileHandleMock = {
      createWritable: vi.fn(() => Promise.resolve(writableStreamMock)),
    }
    window.showSaveFilePicker = () => Promise.resolve(fileHandleMock)
    // Mocking window.showSaveFilePicker directly
    vi.spyOn(window, 'showSaveFilePicker').mockResolvedValue(fileHandleMock)
    // window.showSaveFilePicker = fileHandleMock.createWritable
  } else {
    // Mocking window.showSaveFilePicker directly
    window.showSaveFilePicker = undefined
  }
}

const createWrapper = (props: any = {}) =>
  wrapperFactory(Table, {
    props,
    global: {
      mocks: {
        t: (key: any) => `mocked-${key}`,
      },
    },
  })

describe('mandate collection', () => {
  it('renders the mandate table and click on dropdown', async () => {
    const wrapper = createWrapper({
      data: getMockedMandatesData(),
      currentPage,
    })

    await vi.dynamicImportSettled()
    const firstDropdown = wrapper.find('.el-dropdown')
    const toolbox = wrapper.findComponent({ name: 'PToolbox' })
    const button = firstDropdown.find('.el-button')
    await button.trigger('click')

    expect(toolbox.attributes('data-testid')).toBe('mandate-actions-toolbox')
    expect(wrapper.exists()).toBeTruthy()
  })

  it('renders the mandate table click on download signed mandate', async () => {
    const wrapper = createWrapper({
      data: [],
      currentPage,
    })

    const mandate = { id: '123' }

    // Trigger the action
    await wrapper.vm.actionClicked('download-signed-mandate', mandate)

    // Assert that the correct service function was called
    expect(wrapper.exists()).toBeTruthy()
    expect(mandateService.downloadSignedMandate).toHaveBeenCalledWith(mandate.id)
  })

  it('emits actionClicked', async () => {
    const wrapper = createWrapper({
      data: getMockedMandatesData(),
      currentPage,
    })
    await flushPromises()

    const pToolbox = wrapper.findComponent({ name: 'PToolbox' })
    pToolbox.vm.$emit('p-toolbox-item-clicked', 'cancel-telecollection')
    const id = 567
    await wrapper.vm.terminateMandateAction(id)

    expect(mandateService.terminateMandate).toHaveBeenCalledWith(id)
  })

  it('renders the mandate table click on terminate mandate', async () => {
    const wrapper = createWrapper({
      data: [],
      currentPage,
    })

    const mandate = { id: '123' }

    // Trigger the action
    await wrapper.vm.actionClicked('cancel-telecollection',
      { id: '123', accountNumber: '123', companyName: '123' })
    await wrapper.vm.terminateMandateAction(mandate.id)

    // Assert that the correct service function was called
    expect(mandateService.terminateMandate).toHaveBeenCalledWith('123')
  })

  it('renders the mandate table click on download signed mandate without showSaveFilePicker',
    async () => {
      const wrapper = createWrapper({
        data: [],
        currentPage,
      })

      const mandate = { id: '123' }

      // Trigger the action
      await wrapper.vm.actionClicked('download-signed-mandate', mandate)

      // Assert that the correct service function was called
      expect(mandateService.downloadSignedMandate).toHaveBeenCalledWith(mandate.id)
    })

  it('should sort the table data', async () => {
    const wrapper = createWrapper({
      data: [],
      currentPage,
    })
    wrapper.vm.handleFileUpload({ target: { files: [{ name: 'mandate.pdf' }] } })
    await flushPromises()
    await wrapper.vm.sortColumnChange({ order: 'ascending', prop: 'erpId' })
    await wrapper.vm.sortColumnChange({ order: 'descending', prop: '' })

    const emittedEvents = wrapper.emitted('refresh-mandate-collection')
    expect(emittedEvents?.at(0)).toStrictEqual([{
      currentPage: 1,
    }])
    expect(emittedEvents?.at(1)).toStrictEqual([{
      sortCriteria: 'ErpId',
      sortOrder: 'Ascending',
    }])
    expect(emittedEvents?.at(2)).toStrictEqual([{
      sortCriteria: '',
      sortOrder: 'Descending',
    }])
  })
  it('submit the signed mandate', async () => {
    const currentPage = 2
    const wrapper = createWrapper({
      currentPage,
      data: [],
    })
    vi.spyOn(wrapper.vm, 'handleFileUpload')
    let fileInput: any
    const originalCreateElement = document.createElement.bind(document)
    vi.spyOn(document, 'createElement').mockImplementation((tagName) => {
      if (tagName === 'input') {
        fileInput = originalCreateElement('input')
        return fileInput
      }
      return originalCreateElement(tagName)
    })
    vi.spyOn(document.body, 'appendChild').mockImplementation(() => {})
    vi.spyOn(document.body, 'removeChild').mockImplementation(() => {})
    await wrapper.vm.actionClicked('submit-signed-mandate',
      { id: '123', accountNumber: 'accountNumber', companyName: 'companyName' })
    await nextTick()

    const file = new File(['mandate content'], 'mandate.pdf', { type: 'application/pdf' })
    Object.defineProperty(fileInput, 'files', {
      value: [file],
      writable: false,
    })
    // Dispatch the change event
    const changeEvent = new Event('change', { bubbles: true })
    fileInput.dispatchEvent(changeEvent)
    await flushPromises()
    const notificationMessages = {
      downloading: 'The download is in preparation',
      error: 'There was an error during transmission',
      loading: 'The signed mandate is being transmitted...',
      success: 'The signed mandate has been submitted!',
    }

    expect(mandateService.uploadSignedMandate).toHaveBeenCalledWith({ mandateId: '123', file })
    expect(showNotificationMock).toHaveBeenCalledTimes(2)
    expect(showNotificationMock).toHaveBeenNthCalledWith(1, notificationMessages, 'loading', false)
    expect(showNotificationMock)
      .toHaveBeenNthCalledWith(2, notificationMessages, 'success', true, mockedNotification)
    const refreshMandateCollectionEvent = wrapper.emitted('refresh-mandate-collection')
    expect(refreshMandateCollectionEvent).toStrictEqual([[{
      currentPage,
    }]])
  })
  it('renders the mandate table click on download unsigned mandate', async () => {
    const wrapper = createWrapper({
      data: [],
      currentPage,
    })
    mockShowSaveFilePicker()
    const mandate = { id: '123' }
    // Trigger the action
    await wrapper.vm.actionClicked('download-pre-filled-mandate', mandate)
    // Assert that the correct service function was called
    expect(mandateService.downloadUnsignedMandate).toHaveBeenCalledWith(mandate.id)
  })

  it('should track telecollection cancellation', async () => {
    const wrapper = createWrapper({
      data: [],
      currentPage,
    })

    await wrapper.vm.actionClicked('cancel-telecollection',
      { id: '123', accountNumber: '123', companyName: '123' })

    expect(amplitudeTrackMock).toHaveBeenCalledWith('Bank Mandate Deleted', {
      bank_mandate_delete: '',
    })
  })

  it('should track pre filled mandate download', async () => {
    const wrapper = createWrapper({
      data: [],
      currentPage,
    })

    await wrapper.vm.actionClicked('download-pre-filled-mandate',
      { id: '123', accountNumber: '123', companyName: '123' })

    expect(amplitudeTrackMock).toHaveBeenCalledWith('Blank Bank Mandate Downloaded', {
      blank_bank_mandate_download: '',
    })
  })
})

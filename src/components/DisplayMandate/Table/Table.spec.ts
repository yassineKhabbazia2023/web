import wrapperFactory from '../../../../tests/utils/wrapperFactory'
import Table from '.'
import { expect, describe, it, vi } from 'vitest'
import * as mandateService from '@/services/mandate'
import { nextTick } from 'vue'
import { getMockedMandatesData } from '@/../tests/mocks/mandateMock'

interface CustomWindow extends Window {
  showSaveFilePicker?: (_: any) => Promise<any>
  URL: any
}
declare let window: CustomWindow
declare let document: any

vi.mock('@/services/mandate', () => {
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

vi.mock('@/helpers/utils', () => {
  return {
    dateFormatter: vi.fn(),
    debounce: vi.fn(),
    downloadFile: vi.fn(),
  }
})

const mockShowSaveFilePicker = (withShowSaveFilePicker: boolean = true) => {
  if (withShowSaveFilePicker) {
    // Resetting the window object to its original state before each test
    window = Object.create(window)
    document.body.innerHTML = ''
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
    })

    const mandate = { id: '123' }

    // Trigger the action
    await wrapper.vm.actionClicked('download-signed-mandate', mandate)

    // Assert that the correct service function was called
    expect(wrapper.exists()).toBeTruthy()
    expect(mandateService.downloadSignedMandate).toHaveBeenCalledWith(mandate.id)
  })

  it('renders the mandate table click on terminate mandate', async () => {
    const wrapper = createWrapper({
      data: [],
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
    })
    wrapper.vm.handleFileUpload({ target: { files: [{ name: 'mandate.pdf' }] } })
    await wrapper.vm.sortColumnChange({ order: 'ascending', prop: 'erpId' })
    let sortColumnEvent: any = wrapper.emitted('sort-column-change')
    expect(sortColumnEvent[0]).toStrictEqual([{ sortOrder: 'Ascending', sortCriteria: 'ErpId' }])
    await wrapper.vm.sortColumnChange({ order: 'descending', prop: '' })
    sortColumnEvent = wrapper.emitted('sort-column-change')
    expect(sortColumnEvent[1]).toStrictEqual([{ sortOrder: 'Descending', sortCriteria: '' }])
  })
  it('submit the signed mandate', async () => {
    const wrapper = createWrapper({
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

    expect(mandateService.uploadSignedMandate).toHaveBeenCalledWith({ mandateId: '123', file })
  })
  it('renders the mandate table click on download unsigned mandate', async () => {
    const wrapper = createWrapper({
      data: [],
    })
    mockShowSaveFilePicker()
    const mandate = { id: '123' }
    // Trigger the action
    await wrapper.vm.actionClicked('download-pre-filled-mandate', mandate)
    // Assert that the correct service function was called
    expect(mandateService.downloadUnsignedMandate).toHaveBeenCalledWith(mandate.id)
  })
})

import type { AxiosResponse } from 'axios'
import { getMockedMandatesData } from '@mandate/__mocks__/mandate.mocks'
import { mockedNotification } from '@mandate/__mocks__/notification.helper.mocks'
import { showNotification } from '@mandate/helpers/NotificationHelper'
import * as mandateService from '@mandate/services/mandate'
import { nextTick } from 'vue'
import { flushPromises, shallowMount } from '@vue/test-utils'
import type { ListMandateProps } from './ListMandateTypes'
import { MandateTracking } from '@mandate/services/mandate-tracking.service'
import Table from '.'
import { armMandateModuleDefaults } from '@mandate/__mocks__'

declare let document: any

const currentPageMock = 1
const idMock = 'id-mock'

const mockShowSaveFilePicker = () => {
  const writableStreamMock = {
    write: vi.fn(() => Promise.resolve()),
    close: vi.fn(() => Promise.resolve()),
  }
  const fileHandleMock = {
    createWritable: vi.fn(() => Promise.resolve(writableStreamMock)),
  }
  // stubGlobal (auto-unstubbed after each test) instead of a direct window
  // assignment: the jsdom window is shared by the whole worker in no-isolate.
  vi.stubGlobal('showSaveFilePicker', vi.fn(() => Promise.resolve(fileHandleMock)))
}

const defaultProps: ListMandateProps = {
  currentPage: currentPageMock,
  data: [],
}

function createWrapper(override: Partial<ListMandateProps> = {}) {
  const props = {
    ...defaultProps,
    ...override,
  }

  return shallowMount(Table, {
    props,
    global: {
      stubs: {
        PTable: {
          name: 'PTable',
          template: '<div><slot /></div>',
        },
        PTableColumn: {
          name: 'PTableColumn',
          template: '<div><slot :row="row" /><slot name="header" /></div>',
          data() {
            const row = {
              id: idMock,
              accountNumber: 'account-number',
              companyName: 'company-name',
            }

            return {
              row,
            }
          },
        },
        PToolbox: {
          name: 'PToolbox',
          template: '<div><slot /></div>',
          props: ['pElements'],
        },
        PDialog: {
          name: 'PDialog',
          template: '<div><slot/><slot name="footer"/></div>',
          events: ['update:model-value'],
          props: [
            'modelValue',
            'pWidth',
            'pModal',
            'pCenter',
            'pBeforeClose',
            'PDialog',
            'dialogCloseOnClickModal',
            'dialogCloseOnPressEscape',
            'pTitle',
          ],
        },
      },
    },
  })
}

beforeEach(() => {
  armMandateModuleDefaults()
  // The submit flow passes the loading notification handle to the success one.
  vi.mocked(showNotification).mockReturnValue(mockedNotification)
  vi.mocked(mandateService.downloadUnsignedMandate).mockResolvedValue({ data: 'pdf-data' } as AxiosResponse)
  vi.mocked(mandateService.downloadSignedMandate).mockResolvedValue({ data: 'pdf-data' } as AxiosResponse)
  vi.mocked(mandateService.terminateMandate).mockResolvedValue({ data: {} } as AxiosResponse)
  vi.mocked(mandateService.uploadSignedMandate).mockResolvedValue(true)
})

describe('mandate collection', () => {
  it('renders the mandate table and click on dropdown', async () => {
    const wrapper = createWrapper({
      data: getMockedMandatesData(),
    })

    const toolbox = wrapper.findComponent({ name: 'PToolbox' })
    await toolbox.vm.$emit('p-toolbox-item-clicked', 'download-pre-filled-mandate')

    expect(toolbox.attributes('data-testid')).toBe('mandate-actions-toolbox')
    await expect(wrapper.html()).toMatchFileSnapshot('__snap__/mandate-table.html')
  })

  it('renders the mandate table click on download signed mandate', async () => {
    const wrapper = createWrapper()

    // Trigger the action
    const toolbox = wrapper.findComponent({ name: 'PToolbox' })
    await toolbox.vm.$emit('p-toolbox-item-clicked', 'download-signed-mandate')

    // Assert that the correct service function was called
    expect(wrapper.exists()).toBeTruthy()
    expect(mandateService.downloadSignedMandate).toHaveBeenCalledWith(idMock)
  })

  it('emits actionClicked', async () => {
    const wrapper = createWrapper({
      data: getMockedMandatesData(),
    })
    await flushPromises()

    const pToolbox = wrapper.findComponent({ name: 'PToolbox' })
    const pButtons = wrapper.findAllComponents({ name: 'PButton' })

    await pToolbox.vm.$emit('p-toolbox-item-clicked', 'cancel-telecollection')
    await pButtons[2].vm.$emit('click')

    expect(mandateService.terminateMandate).toHaveBeenCalledWith(idMock)
  })

  it('renders the mandate table click on terminate mandate', async () => {
    const wrapper = createWrapper()

    // Trigger the action
    const pToolbox = wrapper.findComponent({ name: 'PToolbox' })
    const pButtons = wrapper.findAllComponents({ name: 'PButton' })

    await pToolbox.vm.$emit('p-toolbox-item-clicked', 'cancel-telecollection')
    pButtons[2].vm.$emit('click')

    // Assert that the correct service function was called
    expect(mandateService.terminateMandate).toHaveBeenCalledWith(idMock)
  })

  it('renders the mandate table click on download signed mandate without showSaveFilePicker',
    async () => {
      const wrapper = createWrapper()

      // Trigger the action
      const pToolbox = wrapper.findComponent({ name: 'PToolbox' })

      await pToolbox.vm.$emit('p-toolbox-item-clicked', 'download-signed-mandate')

      // Assert that the correct service function was called
      expect(mandateService.downloadSignedMandate).toHaveBeenCalledWith(idMock)
    })

  it('should sort the table data', async () => {
    const wrapper = createWrapper()
    const pTable = wrapper.findComponent({ name: 'PTable' })

    const file = new File(['mandate content'], 'mandate.pdf', { type: 'application/pdf' })
    const event = {
      target: {
        files: [file],
      },
    }
    wrapper.vm.handleFileUpload(event, idMock)
    await flushPromises()

    await pTable.vm.$emit('sort-change', { order: 'ascending', prop: 'erpId' })
    await pTable.vm.$emit('sort-change', { order: 'descending', prop: '' })

    const emittedEvents = wrapper.emitted('refresh-mandate-collection')
    expect(emittedEvents?.at(0)).toStrictEqual([{
      currentPage: 1,
    }])
    expect(emittedEvents?.at(1)).toStrictEqual([{
      currentPage: 1,
      sortCriteria: 'ErpId',
      sortOrder: 'Ascending',
    }])
    expect(emittedEvents?.at(2)).toStrictEqual([{
      currentPage: 1,
      sortCriteria: '',
      sortOrder: 'Descending',
    }])
  })

  it('submit the signed mandate', async () => {
    const currentPage = 2
    const wrapper = createWrapper({
      currentPage,
    })

    const trackingSpy = vi.spyOn(MandateTracking, 'trackSubmitSignedMandateSuccess')

    let fileInput: any
    const originalCreateElement = document.createElement.bind(document)
    vi.spyOn(document, 'createElement').mockImplementation((tagName) => {
      if (tagName === 'input') {
        fileInput = originalCreateElement('input')
        return fileInput
      }
      return originalCreateElement(tagName)
    })
    vi.spyOn(document.body, 'appendChild').mockImplementation(() => { })
    vi.spyOn(document.body, 'removeChild').mockImplementation(() => { })

    const pToolbox = wrapper.findComponent({ name: 'PToolbox' })

    await pToolbox.vm.$emit('p-toolbox-item-clicked', 'submit-signed-mandate')
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

    expect(mandateService.uploadSignedMandate).toHaveBeenCalledWith({ mandateId: idMock, file })
    expect(vi.mocked(showNotification)).toHaveBeenCalledTimes(2)
    expect(vi.mocked(showNotification)).toHaveBeenNthCalledWith(1, notificationMessages, 'loading', false)
    expect(vi.mocked(showNotification))
      .toHaveBeenNthCalledWith(2, notificationMessages, 'success', true, mockedNotification)

    expect(trackingSpy).toHaveBeenCalled()

    const refreshMandateCollectionEvent = wrapper.emitted('refresh-mandate-collection')
    expect(refreshMandateCollectionEvent).toStrictEqual([[{
      currentPage,
    }]])
  })
  it('renders the mandate table click on download unsigned mandate', async () => {
    const wrapper = createWrapper()
    mockShowSaveFilePicker()

    // Trigger the action
    const pToolbox = wrapper.findComponent({ name: 'PToolbox' })
    await pToolbox.vm.$emit('p-toolbox-item-clicked', 'download-pre-filled-mandate')

    // Assert that the correct service function was called
    expect(mandateService.downloadUnsignedMandate).toHaveBeenCalledWith(idMock)
  })

  it('should track telecollection cancellation', async () => {
    const wrapper = createWrapper()
    const trackingSpy = vi.spyOn(MandateTracking, 'trackTelecollectionCancellation')

    const pToolbox = wrapper.findComponent({ name: 'PToolbox' })
    await pToolbox.vm.$emit('p-toolbox-item-clicked', 'cancel-telecollection')

    expect(trackingSpy).toHaveBeenCalled()
  })

  it('should track pre filled mandate download', async () => {
    const wrapper = createWrapper()
    const trackingSpy = vi.spyOn(MandateTracking, 'trackPreFilledMandateDownload')

    const pToolbox = wrapper.findComponent({ name: 'PToolbox' })
    await pToolbox.vm.$emit('p-toolbox-item-clicked', 'download-pre-filled-mandate')

    expect(trackingSpy).toHaveBeenCalled()
  })
})

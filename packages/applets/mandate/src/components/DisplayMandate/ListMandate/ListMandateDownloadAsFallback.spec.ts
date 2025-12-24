import { flushPromises } from '@vue/test-utils'
import wrapperFactory from '@mandate/__mocks__/wrapper.factory'
import { notificationHelperMock } from '@mandate/__mocks__/notification.helper.mocks'
import { utilsMocks } from '@mandate/__mocks__/utils.mocks'
import { AmplitudeServiceMock } from '@pulse/common/mocks/vitest'
import { downloadFile, saveFileAs } from '@mandate/helpers/utils'
import Table from '.'

interface Window {
  showSaveFilePicker: any
  URL: any
}
declare let window: Window
// declare let document: any

const currentPage = 1

vi.mock('@mandate/helpers/NotificationHelper', () => notificationHelperMock)
vi.mock('@mandate/helpers/utils', () => utilsMocks)

vi.mock('@pulse/common/services/amplitude', () => ({
  AmplitudeService: AmplitudeServiceMock,
}))

vi.mock('@mandate/services/mandate', () => {
  return {
    downloadUnsignedMandate: vi.fn(() => {
      // Mock implementation or return value for downloadUnsignedMandate
      return Promise.resolve(Promise.resolve({ data: 'pdf-data' }))
    }),
  }
})

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
  it('should use download fallback when showSaveFilePicker is available but failed in runtime', async () => {
    vi.mocked(saveFileAs).mockRejectedValueOnce(new Error('Failed to execute  showSaveFilePicker on Window'))
    const wrapper = createWrapper({
      data: [],
      currentPage,
    })

    window.showSaveFilePicker = vi.fn(() => Promise.resolve({
      createWritable: vi.fn(() => Promise.resolve({
        write: vi.fn(),
        close: vi.fn(),
      })),
    }))
    const mandate = { id: '1234' }
    // Act
    await wrapper.vm.actionClicked('download-pre-filled-mandate', mandate)
    await flushPromises()

    // Assertions
    expect(downloadFile).toHaveBeenCalledOnce()
  })
})

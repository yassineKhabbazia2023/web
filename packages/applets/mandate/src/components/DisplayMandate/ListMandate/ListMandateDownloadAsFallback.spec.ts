import wrapperFactory from '../../../../tests/utils/wrapperFactory'
import Table from '.'
import { expect, describe, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { downloadFile, saveFileAs } from '@mandate/helpers/utils'

interface Window {
  showSaveFilePicker: any
  URL: any
}
declare let window: Window
// declare let document: any

const currentPage = 1

const mockedNotification = {
  close: vi.fn(),
}
const showNotificationMock = vi.hoisted(() => vi.fn(() => mockedNotification))

vi.mock('@mandate/helpers/NotificationHelper', () => ({
  showNotification: showNotificationMock,
}))

vi.mock('@mandate/services/mandate', () => {
  return {
    downloadUnsignedMandate: vi.fn(() => {
      // Mock implementation or return value for downloadUnsignedMandate
      return Promise.resolve(Promise.resolve({ data: 'pdf-data' }))
    }),
  }
})

const amplitudeTrackMock = vi.hoisted(() => vi.fn())
vi.mock('@pulse/common', () => ({
  amplitudeService: {
    track: amplitudeTrackMock,
  },
}))

vi.mock('@mandate/helpers/utils', () => {
  return {
    dateFormatter: vi.fn(),
    downloadFile: vi.fn(),
    saveFileAs: vi.fn(),
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

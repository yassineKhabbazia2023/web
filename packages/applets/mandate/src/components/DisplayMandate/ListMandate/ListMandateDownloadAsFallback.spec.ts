import type { AxiosResponse } from 'axios'
import { flushPromises } from '@vue/test-utils'
import wrapperFactory from '@mandate/__mocks__/wrapper.factory'
import { downloadFile, saveFileAs } from '@mandate/helpers/utils'
import { downloadUnsignedMandate } from '@mandate/services/mandate'
import Table from '.'
import { armMandateModuleDefaults } from '@mandate/__mocks__'

const currentPage = 1

const createWrapper = (props: any = {}) =>
  wrapperFactory(Table, {
    props,
    global: {
      mocks: {
        t: (key: any) => `mocked-${key}`,
      },
    },
  })

beforeEach(() => {
  armMandateModuleDefaults()
  vi.mocked(downloadUnsignedMandate).mockImplementation(() => Promise.resolve({ data: 'pdf-data' } as AxiosResponse))
})

describe('mandate collection', () => {
  it('should use download fallback when showSaveFilePicker is available but failed in runtime', async () => {
    vi.mocked(saveFileAs).mockRejectedValue(new Error('Failed to execute  showSaveFilePicker on Window'))
    const wrapper = createWrapper({
      data: [],
      currentPage,
    })

    // stubGlobal (auto-unstubbed after each test) instead of a direct window
    // assignment: the jsdom window is shared by the whole worker in no-isolate.
    vi.stubGlobal('showSaveFilePicker', vi.fn(() => Promise.resolve({
      createWritable: vi.fn(() => Promise.resolve({
        write: vi.fn(),
        close: vi.fn(),
      })),
    })))
    const mandate = { id: '1234' }
    // Act
    await wrapper.vm.actionClicked('download-pre-filled-mandate', mandate)
    await flushPromises()

    // Assertions
    expect(vi.mocked(downloadFile)).toHaveBeenCalledOnce()
  })
})

import type { AxiosResponse } from 'axios'

import { loggerErrorSpy } from '@pulse/toolbox/mocks'
import wrapperFactory from '@mandate/__mocks__/wrapper.factory'
import { PNotification } from '@pulse/styleguide'
import type { DownloadProps } from './DownloadTypes'
import { downloadUnsignedMandate, getMandateAvailability } from '@mandate/services/mandate'
import { showNotification } from '@mandate/helpers/NotificationHelper'
import { downloadFile, saveFileAs } from '@mandate/helpers/utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mandateAvailabilityCheckStatuses } from '@mandate/constants/mandateStatuses'
import Download from '.'
import { armMandateModuleDefaults } from '@mandate/__mocks__'

interface Window {
  showSaveFilePicker: any
  URL: any
}
declare let window: Window

const data = 'pdf-data'

const apiMocks = {
  availableMandate: vi.fn(() =>
    Promise.resolve({ status: mandateAvailabilityCheckStatuses.AVAILABLE }),
  ),
  unavailableMandate: vi.fn(() =>
    Promise.resolve({ status: mandateAvailabilityCheckStatuses.NOT_AVAILABLE }),
  ),
  erroredMandate: vi.fn(() =>
    Promise.resolve({ status: mandateAvailabilityCheckStatuses.ERRORED, errorMessage: 'Some error occurred' }),
  ),
}

const mandateId = '1243-4546-35323-43'

const baseProps: DownloadProps = {
  mandateId,
}
const createWrapper = () => wrapperFactory(Download, {
  props: baseProps,
})

function getMandateDownloadFileCard(wrapper: VueWrapper<DownloadProps>) {
  return wrapper.find('[data-testid="download-prefilled-mandate"]')
}

beforeEach(() => {
  armMandateModuleDefaults()
  // The component always calls notification.close() in a finally block, so
  // the no-op default of the hub would make every download reject.
  vi.mocked(showNotification).mockImplementation(() => ({ close: vi.fn() }))
  vi.mocked(getMandateAvailability).mockImplementation(apiMocks.availableMandate)
  vi.mocked(downloadUnsignedMandate).mockImplementation(() => Promise.resolve({ data } as AxiosResponse))
})

describe('download mandate prefilled', () => {
  let wrapper: VueWrapper<DownloadProps>
  beforeEach(async () => {
    wrapper = createWrapper()
    // wait for promises in beforeMount hook to resolve
    await flushPromises()
  })
  it('should use download fallback when showSaveFilePicker is available but failed in runtime', async () => {
    // stubGlobal (auto-unstubbed after each test) instead of a direct window
    // assignment: the jsdom window is shared by the whole worker in no-isolate.
    vi.stubGlobal('showSaveFilePicker', vi.fn())
    vi.mocked(saveFileAs).mockRejectedValue(new Error('Failed to execute  showSaveFilePicker on Window'))
    // Act
    await getMandateDownloadFileCard(wrapper).trigger('click')

    // Assertions

    expect(saveFileAs).toHaveBeenCalled()
  })

  it('uses showSaveFilePicker when available', async () => {
    vi.stubGlobal('showSaveFilePicker', vi.fn(() => Promise.resolve({
      createWritable: vi.fn(() => Promise.resolve({
        write: vi.fn(),
        close: vi.fn(),
      })),
    })))

    // Act
    await wrapper.find('[data-testid="download-prefilled-mandate"]').trigger('click')

    // Assertions
    expect(saveFileAs).toHaveBeenCalledWith(mandateId, data, 'unsigned')
  })

  it('uses traditional download method when showSaveFilePicker is not available', async () => {
    delete window.showSaveFilePicker
    // Act
    await wrapper.find('[data-testid="download-prefilled-mandate"]').trigger('click')

    // Assertions

    expect(downloadFile).toHaveBeenCalled()
  })

  it('handles errors correctly', async () => {
    // Mocking a scenario where downloadUnsignedMandate fails
    vi.mocked(downloadUnsignedMandate).mockRejectedValue(new Error('Download error'))

    // Spy on logger.error

    const wrapper = createWrapper()
    await flushPromises()
    // Act
    await wrapper.find('[data-testid="download-prefilled-mandate"]').trigger('click')

    // Assertions
    expect(loggerErrorSpy).toHaveBeenCalledWith('Error downloading file:', expect.any(Error))
  })
})

describe('mandate not yet available', () => {
  beforeEach(() => {
    vi.mocked(getMandateAvailability).mockReturnValue(apiMocks.unavailableMandate())
  })

  it('should NOT show the download option', () => {
    const wrapper = createWrapper()
    const downloadCardWrapper = getMandateDownloadFileCard(wrapper)
    expect(downloadCardWrapper.exists()).toBeFalsy()
  })

  it('should check mandate availability when mounted', () => {
    createWrapper()
    expect(vi.mocked(getMandateAvailability)).toHaveBeenCalledOnce()
  })

  it('should check availability of tracked mandate every 10 seconds when unavailable', async () => {
    const wrapper = createWrapper()
    vi.useFakeTimers()

    await vi.advanceTimersByTimeAsync(10000)
    await vi.advanceTimersByTimeAsync(10000)
    await vi.advanceTimersByTimeAsync(10000)

    expect(vi.mocked(getMandateAvailability)).toHaveBeenCalledTimes(4)

    // Making sure the interval is killed when component is unmounted
    wrapper.unmount()

    await vi.advanceTimersByTimeAsync(10000)
    expect(vi.mocked(getMandateAvailability)).toHaveBeenCalledTimes(4)
  })
})

describe('mandate is errored', () => {
  it('should display a notification when mandated becomes errored', async () => {
    vi.mocked(getMandateAvailability).mockReturnValue(apiMocks.erroredMandate())
    const wrapper = createWrapper()
    await flushPromises()

    expect(wrapper.emitted()).toHaveProperty('close-drawer')
    expect(vi.mocked(PNotification)).toHaveBeenCalledOnce()
  })
})

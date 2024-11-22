/* eslint-disable vitest/prefer-spy-on */
import Download from '.'
import type { DownloadProps } from './DownloadTypes'
import wrapperFactory from '../../../../tests/utils/wrapperFactory'
import { expect, describe, it, vi, beforeEach } from 'vitest'
import { downloadUnsignedMandate, getMandateAvailability } from '@mandate/services/mandate'
import { downloadFile, saveFileAs } from '@mandate/helpers/utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mandateAvailabilityCheckStatuses } from '@mandate/constants/mandateStatuses'

interface Window {
  showSaveFilePicker: any
  URL: any
}
declare let window: Window

const data = 'pdf-data'

const apiMocks = vi.hoisted(() => ({
  availaibleMandate: vi.fn(() => Promise.resolve(mandateAvailabilityCheckStatuses.AVAILABLE)),
  unavailaibleMandate: vi.fn(() => Promise.resolve(mandateAvailabilityCheckStatuses.NOT_AVAILABLE)),
  erroredMandate: vi.fn(() => Promise.resolve(mandateAvailabilityCheckStatuses.ERRORED)),
}))

vi.mock('@mandate/services/mandate', () => ({
  downloadUnsignedMandate: vi.fn(() => Promise.resolve({ data })),
  getMandateAvailability: apiMocks.availaibleMandate,
}))

vi.mock('@mandate/helpers/utils', () => ({
  saveFileAs: vi.fn(),
  downloadFile: vi.fn(),
}))

const notificationSpy = vi.hoisted(() => vi.fn(() => ({ close: vi.fn() })))
vi.mock('@pulse/styleguide', async () => ({
  PNotification: notificationSpy,
}))

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

describe('download mandate prefilled', () => {
  let wrapper: VueWrapper<DownloadProps>
  beforeEach(async () => {
    wrapper = createWrapper()
    // wait for promises in beforeMount hook to resolve
    await flushPromises()
  })
  it('should use download fallback when showSaveFilePicker is available but failed in runtime', async () => {
    window.showSaveFilePicker = vi.fn()
    vi.mocked(saveFileAs).mockRejectedValueOnce(new Error('Failed to execute  showSaveFilePicker on Window'))
    // Act
    await getMandateDownloadFileCard(wrapper).trigger('click')

    // Assertions
    // eslint-disable-next-line vitest/prefer-called-with
    expect(saveFileAs).toHaveBeenCalled()
  })

  it('uses showSaveFilePicker when available', async () => {
    window.showSaveFilePicker = vi.fn(() => Promise.resolve({
      createWritable: vi.fn(() => Promise.resolve({
        write: vi.fn(),
        close: vi.fn(),
      })),
    }))

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
    // eslint-disable-next-line vitest/prefer-called-with
    expect(downloadFile).toHaveBeenCalled()
  })

  it('handles errors correctly', async () => {
    // Mocking a scenario where downloadUnsignedMandate fails
    vi.mocked(downloadUnsignedMandate).mockRejectedValueOnce(new Error('Download error'))

    // Spy on console.error
    const consoleSpy = vi.spyOn(console, 'error')
    const wrapper = createWrapper()
    await flushPromises()
    // Act
    await wrapper.find('[data-testid="download-prefilled-mandate"]').trigger('click')

    // Assertions
    expect(consoleSpy).toHaveBeenCalledWith('Error downloading file:', expect.any(Error))
  })
})

describe('mandate not yet available', () => {
  beforeEach(() => {
    vi.mocked(getMandateAvailability).mockReturnValue(apiMocks.unavailaibleMandate())
  })

  it('should show the wait illustration', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    const waitIllustrationWrapper = wrapper.find('[data-testid="wait-illustration"]')
    expect(waitIllustrationWrapper.exists()).toBeTruthy()
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
    expect(notificationSpy).toHaveBeenCalledOnce()
  })
})

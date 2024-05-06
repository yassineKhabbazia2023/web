/* eslint-disable vitest/prefer-spy-on */
import Download from '.'
import wrapperFactory from '../../../../tests/utils/wrapperFactory'
import { expect, describe, it, vi } from 'vitest'
import { downloadUnsignedMandate } from '@/services/mandate'
import { downloadFile, saveFileAs } from '@/helpers/utils'

interface Window {
  showSaveFilePicker: any
  URL: any
}
declare let window: Window

const data = 'pdf-data'

vi.mock('@/services/mandate', () => ({
  downloadUnsignedMandate: vi.fn(() => Promise.resolve({ data })),
}))

vi.mock('@/helpers/utils', () => ({
  saveFileAs: vi.fn(),
  downloadFile: vi.fn(),
}))

const mandateId = '1243-4546-35323-43'

const createWrapper = () => wrapperFactory(Download, {
  props: {
    mandateId,
  },
})

describe('download mandate prefilled', () => {
  it('should use download fallback when showSaveFilePicker is available but failed in runtime', async () => {
    const wrapper = createWrapper()
    window.showSaveFilePicker = vi.fn()
    vi.mocked(saveFileAs).mockRejectedValueOnce(new Error('Failed to execute  showSaveFilePicker on Window'))
    // Act
    await wrapper.find('[data-testid="download-prefilled-mandate"]').trigger('click')

    // Assertions
    // eslint-disable-next-line vitest/prefer-called-with
    expect(saveFileAs).toHaveBeenCalled()
  })

  it('uses showSaveFilePicker when available', async () => {
    const wrapper = createWrapper()
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
    const wrapper = createWrapper()
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
    // Act
    await wrapper.find('[data-testid="download-prefilled-mandate"]').trigger('click')

    // Assertions
    expect(consoleSpy).toHaveBeenCalledWith('Error downloading file:', expect.any(Error))
  })
})

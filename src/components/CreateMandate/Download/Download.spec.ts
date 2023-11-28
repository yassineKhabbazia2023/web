import Download from '.'
import wrapperFactory from '../../../../tests/utils/wrapperFactory'
import { expect, describe, it, vi } from 'vitest'
import { downloadUnsignedMandate } from '@/services/mandate'
import { waitForAsyncImports } from '@kpmg/common/src/testing-helpers'

vi.mock('@/services/mandate', () => ({
  downloadUnsignedMandate: vi.fn(() => Promise.resolve({ data: 'pdf-data' }))
}))

const createWrapper = () => wrapperFactory(Download, {
  props: {
    mandateId: 'mandate-id'
  }
})

interface CustomWindow extends Window {
  showSaveFilePicker?: (_: any) => Promise<any>;
}
declare let window: CustomWindow

describe('download mandate prefilled', () => {
  it('uses showSaveFilePicker when available', async () => {
    // Resetting the window object to its original state before each test
    global.window = Object.create(window)
    document.body.innerHTML = ''

    const writableStreamMock = {
      write: vi.fn(),
      close: vi.fn()
    }
    const fileHandleMock = {
      createWritable: vi.fn(() => Promise.resolve(writableStreamMock))
    }

    // Mocking window.showSaveFilePicker directly
    // eslint-disable-next-line vitest/prefer-spy-on
    window.showSaveFilePicker = vi.fn(() => Promise.resolve(fileHandleMock))
    const wrapper = createWrapper()
    await waitForAsyncImports(50)

    // Act
    await wrapper.find('[data-testid="download-prefilled-mandate"]').trigger('click')

    // Assertions
    expect(downloadUnsignedMandate).toHaveBeenCalledOnce()
    expect(window.showSaveFilePicker).toHaveBeenCalledWith({
      suggestedName: 'unsigned-mandate-mandate-id.pdf',
      types: [{
        description: 'PDF Document',
        accept: { 'application/pdf': ['.pdf'] }
      }]
    })
  })

  // eslint-disable-next-line vitest/expect-expect, vitest/no-disabled-tests
  it.skip('uses traditional download method when showSaveFilePicker is not available', async () => {
    // Mocking window functions and objects
    window.showSaveFilePicker = undefined

    const wrapper = createWrapper()
    await waitForAsyncImports(50)

    // Act
    await wrapper.find('[data-testid="download-prefilled-mandate"]').trigger('click')

    // Assertions
    // eslint-disable-next-line vitest/prefer-called-with
    // expect(window.URL.createObjectURL).toHaveBeenCalled()
  })

  it('handles errors correctly', async () => {
    // Mocking a scenario where downloadUnsignedMandate fails
    vi.mocked(downloadUnsignedMandate).mockRejectedValueOnce(new Error('Download error'))

    // Spy on console.error
    const consoleSpy = vi.spyOn(console, 'error')
    const wrapper = createWrapper()
    await waitForAsyncImports(50)

    // Act
    await wrapper.find('[data-testid="download-prefilled-mandate"]').trigger('click')

    // Assertions
    expect(consoleSpy).toHaveBeenCalledWith('Error downloading file:', expect.any(Error))
  })
})

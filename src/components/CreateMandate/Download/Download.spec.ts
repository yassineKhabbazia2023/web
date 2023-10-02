import Download from '.'
import wrapperFactory from '../../../../tests/utils/wrapperFactory'
import { expect, describe, it, vi } from 'vitest'
import { downloadDocumentById } from '@/services/mandate'
import {
  waitForAsyncImports
} from '@kpmg/common/src/testing-helpers'

vi.mock('@/services/mandate', () => {
  const downloadDocumentById = vi.fn()
  return { downloadDocumentById }
})

const createWrapper = () =>
  wrapperFactory(Download, { })

describe('download madate prefilled', () => {
  it('should call the download method', async () => {
    const wrapper = createWrapper()
    await waitForAsyncImports(50)
    wrapper.find('[data-testid="download-prefilled-mandate"]').trigger('click')
    expect(downloadDocumentById).toHaveBeenCalledOnce()
  })

})

import { copyMock } from '@styleguide/__mocks__/vueuse.mocks'

import { useCopyClipboard } from './clipboard'

describe('clipboard', () => {
  it('should copy to clipboard a value', () => {
    useCopyClipboard('test')
    expect(copyMock).toHaveBeenCalledOnce()
  })
})

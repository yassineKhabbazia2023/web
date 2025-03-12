import { describe, it, expect, vi } from 'vitest'
import { copyMock, vueuseCoreMock } from '@styleguide/__mocks__/vueuse.mocks'

import { useCopyClipboard } from './clipboard'

vi.mock('@vueuse/core', () => vueuseCoreMock)

describe('clipboard', () => {
  it('should copy to clipboard a value', () => {
    useCopyClipboard('test')
    expect(copyMock).toHaveBeenCalledOnce()
  })
})
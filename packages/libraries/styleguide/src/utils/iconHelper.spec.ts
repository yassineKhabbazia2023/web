import { describe, it, expect, vi } from 'vitest'
import { getIconComponent } from '../utils/iconHelper'
import { PIXCircle } from '../atoms/PIcon/components'

const defineAsyncComponentMock = vi.hoisted(() => vi.fn())
vi.mock('vue', () => ({
  defineAsyncComponent: defineAsyncComponentMock,
}))

describe('test iconHelper', () => {
  describe('getIconComponent', () => {
    it('should call defineAsyncComponent when icon name is not null', () => {
      const mockedIconComponent = {}
      const expectedParams = {
        errorComponent: PIXCircle,
        loader: expect.any(Function),
      }

      defineAsyncComponentMock.mockReturnValue(mockedIconComponent)

      const iconComponent = getIconComponent('arrowBarLeft')

      expect(defineAsyncComponentMock).toHaveBeenCalledOnce()
      expect(defineAsyncComponentMock).toHaveBeenCalledWith(expectedParams)
      expect(iconComponent).toStrictEqual(mockedIconComponent)
    })

    it('should NOT call defineAsyncComponent when icon name is null', () => {
      const iconComponent = getIconComponent()

      expect(defineAsyncComponentMock).not.toHaveBeenCalled()
      expect(iconComponent).toBeUndefined()
    })
  })
})

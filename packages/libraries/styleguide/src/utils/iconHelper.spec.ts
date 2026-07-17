import { getIconComponent } from '../utils/iconHelper'
import { PIXCircle } from '../atoms/PIcon/components'

import { defineAsyncComponent } from 'vue'

const defineAsyncComponentMock = vi.mocked(defineAsyncComponent)

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

      expect(defineAsyncComponentMock).toHaveBeenCalledExactlyOnceWith(expectedParams)
      expect(iconComponent).toStrictEqual(mockedIconComponent)
    })

    it('should NOT call defineAsyncComponent when icon name is null', () => {
      const iconComponent = getIconComponent()

      expect(defineAsyncComponentMock).not.toHaveBeenCalled()
      expect(iconComponent).toBeUndefined()
    })
  })
})

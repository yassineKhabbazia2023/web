import { describe, it, expect } from 'vitest'
import { type Component } from 'vue'
import { getIconComponent } from '../utils/iconHelper'

const iconResolverMock = vi.hoisted(() => vi.fn())

vi.mock('./iconResolver', () => ({
  iconResolver: iconResolverMock,
}))

describe('test iconHelper', () => {
  describe('getIconComponent', () => {
    it('should call iconResolver when icon name is not null', () => {
      const mockedIconComponent = {} as Component
      iconResolverMock.mockReturnValue(mockedIconComponent)

      const iconComponent = getIconComponent('arrowBarLeft')

      expect(iconResolverMock).toHaveBeenCalledOnce()
      expect(iconResolverMock).toHaveBeenCalledWith('PIArrowBarLeft')
      expect(iconComponent).toStrictEqual(mockedIconComponent)
    })

    it('should not call iconResolver when icon name is null', () => {
      const iconComponent = getIconComponent(undefined)

      expect(iconResolverMock).not.toHaveBeenCalled()
      expect(iconComponent).toBeUndefined()
    })
  })
})

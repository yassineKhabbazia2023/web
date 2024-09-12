import { describe, it, expect } from 'vitest'
import { useFooterLink } from './useFooterLink'

describe('useFooterLink', () => {
  it('should call the handleCloseDrawer function and close the copyright drawer', () => {
    const { handleCloseDrawer, isCopyrightDrawerOpened } = useFooterLink()
    handleCloseDrawer()

    expect(isCopyrightDrawerOpened.value).toBeFalsy()
  })
  it('should call the handleCopyrightLink and open the copyright drawer', () => {
    const { handleCopyrightLink, isCopyrightDrawerOpened } = useFooterLink()
    handleCopyrightLink()

    expect(isCopyrightDrawerOpened.value).toBeTruthy()
  })
})

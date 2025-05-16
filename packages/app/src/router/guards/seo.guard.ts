import { NavigationHookAfter } from 'vue-router'
import { HTMLService } from '@pulse/core'
import { HTML_TITLE_META } from '@pulse/common/constants'

export const seoGuard: NavigationHookAfter = (to, _from) => {
  if(to?.meta?.[HTML_TITLE_META]) {
    HTMLService.setDocumentTitle(to.meta[HTML_TITLE_META] as string)
  } else {
    HTMLService.resetDocumentTitle()
  }
}

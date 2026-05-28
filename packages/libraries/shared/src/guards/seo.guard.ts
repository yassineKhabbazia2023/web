import { NavigationHookAfter } from 'vue-router'
import { HTMLService } from '@pulse/common/services/html'
import { HTML_TITLE_META } from '@pulse/common/constants'

export const seoGuard: NavigationHookAfter = (to, _from) => {
  const htmlTitle = to?.meta?.[HTML_TITLE_META]

  if (htmlTitle !== undefined && htmlTitle !== '') {
    HTMLService.setDocumentTitle(htmlTitle)
  } else {
    HTMLService.resetDocumentTitle()
  }
}

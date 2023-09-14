import { commonApi } from '@kpmg/common'
import { Link } from '../layouts/Login/types'
import { ref } from 'vue'

export const useFooterLink = () => {
  const getUrlTerm = async (lang: string = 'fr'): Promise<any> => {
    const urlTerms = `/GetUrlOfTheCurrentActiveTerms(TermCultureInfoType='${lang}')`
    try {
      const { data: { value } } = await commonApi().portal.get(urlTerms)
      return value
    } catch {}
  }

  const handleFooterLinkClick = async ({ translationKey, href }: Link) => {
    let CGUHref: string = ''
    if (translationKey === 'CGU') {
      CGUHref = await getUrlTerm()
    }
    window.open(CGUHref || href, '_blank')
  }

  const isCopyrightDrawerOpened = ref(false)
  const handleCopyrightLink = () => {
    isCopyrightDrawerOpened.value = true
  }
  const handleCloseDrawer = () => {
    isCopyrightDrawerOpened.value = false
  }

  return {
    getUrlTerm,
    handleFooterLinkClick,
    handleCopyrightLink,
    handleCloseDrawer,
    isCopyrightDrawerOpened
  }
}

import type { CguTerms } from '@common/services/cgu/cgu.service.types'

export const getTermsMock = (overridden: Partial<CguTerms> = {}) => {
  const defaultTerms: CguTerms = {
    isCurrent: true,
    hasAcceptedBefore: false,
    terms: {
      termsId: 123456,
      linkFr: 'link-fr',
      linkEn: 'link-en',
      uploadDate: '2024-06-19T14:37:18',
    },
  }
  return {
    ...defaultTerms,
    ...overridden,
  }
}

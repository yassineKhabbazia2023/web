import type { OfferDescription, OfferCatalogReferent, OfferCatalogDocument } from '../../types/offers-catalog.types'
import type { PDocumentDisplayProps, IconName } from '@pulse/styleguide/types'
import { APICallStatus } from '@pulse/common/enums'
import { CatalogDrawerTabs } from './catalog-drawer.enums'

export interface CatalogDrawerTab {
  name: CatalogDrawerTabs
  label: string
  iconName: IconName | undefined
}

export interface CatalogDrawerTabsLabels {
  pdf: string
  contacts: string
  documents: string
  recommendation: string
}

export interface CatalogDrawerProps {
  isOpened: boolean
  offer: OfferDescription
  offerReferents?: OfferCatalogReferent[]
  offerDocuments?: OfferCatalogDocument[]
  offerPdf: PDocumentDisplayProps['pSrc']
  pdfApiCallStatus: APICallStatus
  offerReferentsApiCallStatus: APICallStatus
  isSmartSearchEnabled: boolean
  offerResponseId: string
}

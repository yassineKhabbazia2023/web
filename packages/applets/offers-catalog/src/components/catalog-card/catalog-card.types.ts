export interface CatalogCardProps {
  offerId: string
  title: string
  subtitle: string
  tags: string[]
  offerRecommendationsId: string
  similarityScore?: number
  isSmartSearchEnabled: boolean
}

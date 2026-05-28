import type { CatalogCard } from '../types/offers-catalog.types'

export function getCatalogCardMock(override: Partial<CatalogCard> = {}) {
  const defaultCardMock: CatalogCard = {
    title: 'Comptabilité',
    subtitle: 'Gestion de la comptabilité, qui optimise l’acquisition de données et inclus des outils connectés',
    tags: ['Pack', 'Gestion sociale', 'Transverse'],
  }

  return {
    ...defaultCardMock,
    ...override,
  }
}

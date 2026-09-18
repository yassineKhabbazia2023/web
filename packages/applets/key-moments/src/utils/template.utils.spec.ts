import { latestTemplateOf, resolveTemplateModels, templateVersionsOf } from './template.utils'
import type { TemplateSummary } from '../types/key-moments.types'

/**
 * Two models, one of them served in three versions out of order — including a
 * tenth minor, which a plain string order would rank below the second.
 */
const CATALOGUE: TemplateSummary[] = [
  { templateId: 1, id: 'engagement', version: '1.2.0', label: "Comptabilité d'engagement" },
  { templateId: 2, id: 'tresorerie', version: '1.0.0', label: 'Comptabilité de trésorerie' },
  { templateId: 3, id: 'engagement', version: '1.10.0', label: "Comptabilité d'engagement (2026)" },
  { templateId: 4, id: 'engagement', version: '1.9.0', label: "Comptabilité d'engagement" },
]

describe('key-moments templates', () => {

  describe('templateVersionsOf', () => {

    it('should list the versions of a model, the most recent first', () => {
      expect(templateVersionsOf(CATALOGUE, 'engagement').map(summary => summary.version))
        .toEqual(['1.10.0', '1.9.0', '1.2.0'])
    })

    it('should list nothing for a model the catalogue does not carry', () => {
      expect(templateVersionsOf(CATALOGUE, 'gone')).toEqual([])
    })

    it('should leave the catalogue untouched', () => {
      const before = [...CATALOGUE]

      templateVersionsOf(CATALOGUE, 'engagement')

      expect(CATALOGUE).toEqual(before)
    })
  })

  describe('latestTemplateOf', () => {

    it('should pick the most recent version of a model', () => {
      expect(latestTemplateOf(CATALOGUE, 'engagement')?.templateId).toBe(3)
    })

    it('should pick nothing for a model the catalogue does not carry', () => {
      expect(latestTemplateOf(CATALOGUE, 'gone')).toBeUndefined()
    })
  })

  describe('resolveTemplateModels', () => {

    it('should name each model once, in the order of the catalogue', () => {
      expect(resolveTemplateModels(CATALOGUE).map(model => model.code))
        .toEqual(['engagement', 'tresorerie'])
    })

    it('should name a model the way its most recent version does', () => {
      expect(resolveTemplateModels(CATALOGUE)[0]?.label).toBe("Comptabilité d'engagement (2026)")
    })

    it('should resolve no model from an empty catalogue', () => {
      expect(resolveTemplateModels([])).toEqual([])
    })
  })
})

import { slugify } from './slug.utils'

describe('slugify', () => {
  it('should lowercase, unaccent and dash-join a title', () => {
    expect(slugify('Votre activité')).toBe('votre-activite')
    expect(slugify("Synthèse de l'activité")).toBe('synthese-de-l-activite')
  })

  it('should drop what cannot be part of an id', () => {
    expect(slugify('Marge  /  CA (%)')).toBe('marge-ca')
    expect(slugify('   ')).toBe('')
  })
})

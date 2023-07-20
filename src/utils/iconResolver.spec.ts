import { describe, it, expect } from 'vitest'
import { iconResolver } from '@/utils/iconResolver'
const iconsToImport = [
  {
    iconName: 'PIAdd'
  },
  {
    iconName: 'PITrash'
  },
  {
    iconName: 'PISend'
  }
]
describe('iconResolver', () => {
  it('should correctly retrieve import objects', () => {
    const importsObject = iconResolver(iconsToImport, 'iconName')
    expect(importsObject).toHaveLength(iconsToImport.length)
  })
})

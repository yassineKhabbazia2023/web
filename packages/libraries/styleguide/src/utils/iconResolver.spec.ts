import { describe, it, expect } from 'vitest'
import { iconResolver, iconsResolver } from '../utils/iconResolver'
const iconToImport = 'PITrash'
const iconsToImport = [
  {
    iconName: 'PIAdd',
  },
  {
    iconName: 'PITrash',
  },
  {
    iconName: 'PISend',
  },
]
describe('iconResolver', () => {
  it('should correctly retrieve import objects', () => {
    const importsObject = iconsResolver(iconsToImport, 'iconName')
    expect(importsObject).toHaveLength(iconsToImport.length)
  })

  it('should correctly retrieve a single object', () => {
    const importedObject = iconResolver(iconToImport)
    expect(importedObject).toBeTruthy()
  })
})

import { describe, it, expect } from 'vitest'
import { iconResolver } from '../utils/iconResolver'
const iconToImport = 'PITrash'

describe('iconResolver', () => {
  it('should correctly retrieve a single object', () => {
    const importedObject = iconResolver(iconToImport)
    expect(importedObject).toBeTruthy()
  })
})

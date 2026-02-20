import { addPathValue, getPatchOperations, type PatchOperation, type PatchValue } from '.'

describe('test PatchRecordService', () => {
  const fieldKey = 'a.b.c'
  const path = '/a/b/c'
  const originalValue = 1
  const newValue = 2
  let patchValues: PatchValue[]
  beforeEach(() => {
    patchValues = []
  })
  describe('addPathValue', () => {
    it('should add a new value', () => {
      addPathValue(patchValues, fieldKey, originalValue, newValue)
      const expected = [{
        path,
        originalValue,
        newValue,
      }]
      expect(patchValues).toMatchObject(expected)
    })

    it('should keep a original value when updated twice with a newerValue', () => {
      const newerValue = 3
      addPathValue(patchValues, fieldKey, originalValue, newValue)
      addPathValue(patchValues, fieldKey, newValue, newerValue)
      const expected = [{
        path,
        originalValue,
        newValue: newerValue,
      }]
      expect(patchValues).toMatchObject(expected)
    })

    it('should remove a original value when updated twice with originalValue', () => {
      const newerValue = originalValue
      addPathValue(patchValues, fieldKey, originalValue, newValue)
      addPathValue(patchValues, fieldKey, newValue, newerValue)
      expect(patchValues).toHaveLength(0)
    })
  })

  describe('getPatchOperations', () => {
    it('should add a new value', () => {
      addPathValue(patchValues, fieldKey, originalValue, newValue)
      const patchOperations = getPatchOperations(patchValues)
      const expected: PatchOperation[] = [{
        op: 'replace',
        path,
        value: newValue,
      }]
      expect(patchOperations).toMatchObject(expected)
    })
  })
})

import { movedInList, patchRecord } from './patch.utils'

describe('patchRecord', () => {
  it('should write what the patch names and drop what it sets to undefined', () => {
    expect(patchRecord({ a: 1, b: 2 }, { a: 3, b: undefined, c: 4 })).toEqual({ a: 3, c: 4 })
  })

  it('should never touch the record it is given', () => {
    const record = { a: 1 }

    patchRecord(record, { a: undefined })

    expect(record).toEqual({ a: 1 })
  })
})

describe('movedInList', () => {
  it('should move an item without touching the list it is given', () => {
    const list = ['a', 'b', 'c']

    expect(movedInList(list, 0, 2)).toEqual(['b', 'c', 'a'])
    expect(list).toEqual(['a', 'b', 'c'])
  })
})

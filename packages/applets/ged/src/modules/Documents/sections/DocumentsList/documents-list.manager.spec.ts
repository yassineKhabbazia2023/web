import { describe, expect, it } from 'vitest'
import { getRowAlignmentClass } from './documents-list.manager'

describe('documents list manager', () => {

  const getRowAlignmentClassTestTable = new Array(3)
  it.each([
    {
      index: 0,
      expectedResult: 'default',
    },
    {
      index: 1,
      expectedResult: 'default',
    },
    {
      index: 2,
      expectedResult: 'right',
    },
  ])('should return "$expectedResult" when the index is $index', ({ index, expectedResult }) => {
    const result = getRowAlignmentClass(index, getRowAlignmentClassTestTable)
    expect(result).toStrictEqual(expectedResult)
  })
})

import { describe, it, expect, beforeEach } from 'vitest'
import {
  formatDateToLocale,
  generateObject,
  getInitials,
  removeFalsyValues,
  getPaginationLabel,
} from './helper'
import type { PaginationData } from './helperTypes'

describe('getInitials', () => {
  it.each([
    ['gojo', 'satoru', 'GS'],
    ['Gojo', '', 'G'],
    ['', 'Satoru', 'S'],
    [undefined, 'Gojo', 'G'],
    ['', '', ''],
    [undefined, undefined, ''],
  ])(
    'returns correct initials (%s, %s) => %s',
    (firstName, lastName, expected) => {
      const initials = getInitials(firstName, lastName)
      expect(initials).toBe(expected)
    },
  )
})

describe('generateObject', () => {
  it('should construct and return the correct object', () => {
    const expectedObject = { a: { b: 5 } }
    const generatedObject = generateObject('a', { 'a.b': 5 })
    expect(generatedObject).toStrictEqual(expectedObject)
  })
})

describe('formatDateToLocale', () => {
  it('should return the date formatted according to the local format', () => {
    const expectedDate = '19/02/2024'
    const dateString = formatDateToLocale('2024-02-19T07:25:58.8491912')
    expect(expectedDate).toStrictEqual(dateString)
  })
})

describe('removeFalsyValues', () => {
  it('remove falsy value in object', () => {
    const OBJECT_WITH_FALSY_VALUES = {
      a: undefined,
      b: 'b',
      c: false,
      d: null,
      e: '',
      f: 0,
    }
    expect(removeFalsyValues(OBJECT_WITH_FALSY_VALUES)).toStrictEqual({ b: 'b' })
  })
})

describe('getPaginationLabel', () => {
  let params: PaginationData<number>
  beforeEach(() => {
    params = {
      currentPage: 1,
      limit: 10,
      data: [0, 1, 2, 3, 4],
      totalItems: 55,
    }
  })
  it('should return proper pagination label when value are given', () => {
    const paginationLabel = getPaginationLabel<number>('sur', params)
    const expected = '1 - 5 sur 55'
    expect(paginationLabel).toBe(expected)
  })

  it('should return proper pagination label when totalItems is undefined', () => {
    params.totalItems = undefined
    const paginationLabel = getPaginationLabel('sur', params)
    expect(paginationLabel).toBe('')
  })

  it('should return proper pagination label when currentPage is undefined', () => {
    params.currentPage = undefined
    const paginationLabel = getPaginationLabel('sur', params)
    expect(paginationLabel).toBe('')
  })
})

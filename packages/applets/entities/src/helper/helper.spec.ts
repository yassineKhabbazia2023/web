import { describe, it, expect, beforeEach } from 'vitest'
import {
  formatDateToLocale,
  generateObject,
  getInitials,
  getPaginationLabel,
  returnSortQueryField,
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

describe('getPaginationLabel', () => {
  let params: PaginationData<number>
  beforeEach(() => {
    params = {
      currentPage: 1,
      limit: 3,
      data: [0, 1, 2],
      totalItems: 55,
    }
  })

  it('should return proper pagination label when value are given on page 0', () => {
    params.currentPage = 0
    const paginationLabel = getPaginationLabel<number>('sur', params)
    const expected = '1 - 3 sur 55'
    expect(paginationLabel).toBe(expected)
  })

  it('should return proper pagination label when value are given on page 1', () => {
    const paginationLabel = getPaginationLabel<number>('sur', params)
    const expected = '1 - 3 sur 55'
    expect(paginationLabel).toBe(expected)
  })

  it('should return proper pagination label when value are given on page 2', () => {
    params.currentPage = 2
    const paginationLabel = getPaginationLabel<number>('sur', params)
    const expected = '4 - 6 sur 55'
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

  describe('should return the correct sort query field', () => {
    const testCases = [
      ['user', false, '+lastname'],
      ['user', true, '-lastname'],
      ['email', false, '+email'],
      ['email', true, '-email'],
      ['persona', false, '+persona'],
      ['persona', true, '-persona'],
      ['createdAt', false, '+created'],
      ['createdAt', true, '-created'],
      ['role', false, '+persona'],
      ['role', true, '-persona'],
      ['office', false, '+office'],
      ['office', true, '-office'],
    ]

    it.each(testCases)(
      'helper mapping with "%s"',
      (columnLabel, order, expectedResult) => {
        const actualResult = returnSortQueryField(columnLabel as string, order as boolean)
        expect(actualResult).toBe(expectedResult)
      },
    )
  })
})

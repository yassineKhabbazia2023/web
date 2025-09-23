import { describe, it, expect } from 'vitest'
import {
  formatDateToLocale,
  generateObject,
  getInitials,
  returnSortQueryField,
} from './helper'

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

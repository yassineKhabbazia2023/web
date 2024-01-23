import { describe, it, expect } from 'vitest'
import { returnSortQueryField } from './sortHelper'

describe('sortHelper', () => {
  describe('should return the correct sort query field', () => {
    const testCases = [
      ['Nom du document', 'ascending', '+name'],
      ['Nom du document', 'descending', '-name'],
      ['Déposé le', 'ascending', '+created'],
      ['Déposé le', 'descending', '-created'],
      ['Supprimé le', 'ascending', '+deleted'],
      ['Supprimé le', 'descending', '-deleted']
    ]

    it.each(testCases)(
      'helper mapping with "%s"',
      (columnLabel, order, expectedResult) => {
        const actualResult = returnSortQueryField(columnLabel, order)
        expect(actualResult).toBe(expectedResult)
      }
    )
  })
})

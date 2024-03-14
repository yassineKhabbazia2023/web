import { documentsMock, documentsMockWithError } from '../mocks/documentMock'
import {
  mapExplorerDocumentFromDocuments,
  mapExplorerDocumentFromFiles,
} from './documentExplorerMapper'
import { describe, it, expect } from 'vitest'

describe('mapping functions', () => {
  describe('mapExplorerDocumentFromFiles', () => {
    it('maps files to ExplorerUploadDocument', () => {
      const files = [
        new File(['content'], 'example.txt', { type: 'text/plain' }),
      ]
      const result = mapExplorerDocumentFromFiles(files)
      result.forEach((document) => {
        expect(document).toHaveProperty('givenActionState')
        expect(document).toHaveProperty('isSelected')
        expect(document).toHaveProperty('file')
      })
      expect(result).toHaveLength(files.length)
      expect(result[0].givenActionState).toBe('TO_DO')
    })
    it('maps files to ExplorerUploadDocument with error UnauthorizedFileType', () => {
      const files2 = [
        new File(['content'], 'example.kgjfh', { type: 'text/plain' }),
      ]
      const result = mapExplorerDocumentFromFiles(files2)
      expect(result[0].givenActionState).toBe('ERROR')
      expect(result[0].codeError).toBe('UnauthorizedFileType')
    })

    it('maps files to ExplorerUploadDocument with error FileNameLengthExceeded', () => {
      const files2 = [
        new File(['content'],
          'jzdahfhqzjfhqskjghqksjglkjqgkqkjgqkgkqgkqgqsfjksqfsqgqsg' +
          'jzdahfhqzjfhqskjghqksjglkjqgkqkjgqkgkqgkqgqsfjksqfsqgqsg' +
          'jzdahfhqzjfhqskjghqksjglkjqgkqkjgqkgkqgkqgqsfjksqfsqgqsg' +
          'jzdahfhqzjfhqskjghqksjglkjqgkqkjgqkgkqgkqgqsfjksqfsqgqsg' +
          'jzdahfhqzjfhqskjghqksjglkjqgkqkjgqkgkqgkqgqsfjksqfsqgqsg' +
          'jzdahfhqzjfhqskjghqksjglkjqgkqkjgqkgkqgkqgqsfjksqfsqgqsg' +
          'kqshgkjqskgqskg.txt',
          { type: 'text/plain' }),
      ]
      const result = mapExplorerDocumentFromFiles(files2)
      expect(result[0].givenActionState).toBe('ERROR')
      expect(result[0].codeError).toBe('FileNameLengthExceeded')
    })

    it('maps files to ExplorerUploadDocument with error UnauthorizedCharFileName', () => {
      const files2 = [
        new File(['content'],
          'test*kiki.txt',
          { type: 'text/plain' }),
      ]
      const result = mapExplorerDocumentFromFiles(files2)
      expect(result[0].givenActionState).toBe('ERROR')
      expect(result[0].codeError).toBe('UnauthorizedCharFileName')
    })
  })

  describe('mapExplorerDocumentFromDocuments', () => {
    it('maps documents to ExplorerMoveDocument', () => {
      const documents = documentsMock
      const result = mapExplorerDocumentFromDocuments(documents)
      expect(result).toHaveLength(documents.length)
      result.forEach((explorerDocument) => {
        expect(explorerDocument).toHaveProperty('id')
        expect(explorerDocument).toHaveProperty('isSelected')
      })
      expect(result).toHaveLength(documents.length)
      expect(result[0].givenActionState).toBe('TO_DO')
    })
    it('maps documents to ExplorerMoveDocument with error', () => {
      const documents = documentsMockWithError
      const result = mapExplorerDocumentFromDocuments(documents)
      expect(result).toHaveLength(documents.length)
      expect(result[0].givenActionState).toBe('ERROR')
      expect(result[0].codeError).toBe('DocumentCertifiedError')
      expect(result[1].givenActionState).toBe('ERROR')
      expect(result[1].codeError).toBe('PermissionInvalidError')
    })
  })
})

import { getFileErrorMessage, getFileErrorDescription }
  from '@ged/modules/common/helpers/documentCodeErrorHelper'

import { MAX_FILE_SIZE_MB } from '@ged/modules/common/constants/files'

describe('document Code Error Helper', () => {
  describe('should return the proper message based on code error', () => {
    const cases = [
      {
        input: 'FileEmpty',
        expectedResult: 'Fichier vide',
      },
      {
        input: 'UnauthorizedFileType',
        expectedResult: 'Format non reconnu',
      },
      {
        input: 'UnauthorizedCharFileName',
        expectedResult: 'Caractères interdit',
      },
      {
        input: 'tessssst',
        expectedResult: 'Connexion au serveur interrompue.',
      },
    ]

    it.each(cases)(
      'pText mapping validation',
      ({ input, expectedResult }) => {
        const result = getFileErrorMessage(input)
        expect(result).toStrictEqual(expectedResult)
      },
    )
  })

  describe('should return the proper description based on code error', () => {
    const cases = [
      {
        input: 'FileEmpty',
        expectedResult: 'Le document doit faire  minimum 1 octet',
      },
      {
        input: 'FileTooLarge',
        expectedResult: `Le document doit faire maximum ${MAX_FILE_SIZE_MB}MB`,
      },
      {
        input: 'UnauthorizedCharFileName',
        expectedResult:
          'Le nom ne doit contenir aucun des caractères suivants : ' +
          '“ * : &lt; &gt; ? / \\ |.',
      },
      {
        input: 'tessssst',
        expectedResult: 'Connexion au serveur interrompue.',
      },
    ]

    it.each(cases)(
      'pText mapping validation',
      ({ input, expectedResult }) => {
        const result = getFileErrorDescription(input)
        expect(result).toStrictEqual(expectedResult)
      },
    )
  })
})

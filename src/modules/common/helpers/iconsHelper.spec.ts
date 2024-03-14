import { describe, it, expect } from 'vitest'
import { getFileIcon } from '@/modules/common/helpers/iconsHelper'
import {
  PIFileText,
  PIFiletypeBmp,
  PIFiletypeCsv,
  PIFiletypeDoc,
  PIFiletypeDocx,
  PIFiletypeGif,
  PIFiletypeHeic,
  PIFiletypeJpg,
  PIFiletypeMd,
  PIFiletypePdf,
  PIFiletypePng,
  PIFiletypePpt,
  PIFiletypePptx,
  PIFiletypeRaw,
  PIFiletypeSvg,
  PIFiletypeTiff,
  PIFiletypeTxt,
  PIFiletypeXls,
  PIFiletypeXlsx,
  PIFiletypeXml,
} from '@kpmg/styleguide'

describe('toolget File Iconbox helper', () => {
  describe('should return the propper icon based on file extension', () => {
    const cases = [
      {
        input: '.bmp',
        expectedResult: PIFiletypeBmp,
      },
      {
        input: '.csv',
        expectedResult: PIFiletypeCsv,
      },
      {
        input: '.doc',
        expectedResult: PIFiletypeDoc,
      },
      {
        input: '.docx',
        expectedResult: PIFiletypeDocx,
      },
      {
        input: '.gif',
        expectedResult: PIFiletypeGif,
      },
      {
        input: '.heic',
        expectedResult: PIFiletypeHeic,
      },
      {
        input: '.jpg',
        expectedResult: PIFiletypeJpg,
      },
      {
        input: '.md',
        expectedResult: PIFiletypeMd,
      },
      {
        input: '.pdf',
        expectedResult: PIFiletypePdf,
      },
      {
        input: '.png',
        expectedResult: PIFiletypePng,
      },
      {
        input: '.ppt',
        expectedResult: PIFiletypePpt,
      },
      {
        input: '.pptx',
        expectedResult: PIFiletypePptx,
      },
      {
        input: '.raw',
        expectedResult: PIFiletypeRaw,
      },
      {
        input: '.svg',
        expectedResult: PIFiletypeSvg,
      },
      {
        input: '.tiff',
        expectedResult: PIFiletypeTiff,
      },
      {
        input: '.txt',
        expectedResult: PIFiletypeTxt,
      },
      {
        input: '.xls',
        expectedResult: PIFiletypeXls,
      },
      {
        input: '.xlsx',
        expectedResult: PIFiletypeXlsx,
      },
      {
        input: '.xml',
        expectedResult: PIFiletypeXml,
      },
      {
        input: '.test',
        expectedResult: PIFileText,
      },
      {
        input: '.text',
        expectedResult: PIFileText,
      },
      {
        input: 'noDot',
        expectedResult: PIFileText,
      },
    ]

    it.each(cases)(
      'pIcon mapping validation',
      ({ input, expectedResult }) => {
        expect.hasAssertions()
        const result = getFileIcon(input)
        expect(result).toStrictEqual(expectedResult)
      },
    )
  })
})

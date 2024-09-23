import type { Deadline } from '../models/Deadline'
import {
  dateToLocaleFormat,
  accountsDataTransformer,
  dateISOFormatter,
  daysInTheMonth,
  getYearMonth,
  getTypeLabel,
  base64ToBase64URL,
  getFileExtension,
  fileSizeHumanFormatter,
  downloadFile,
  saveFileAs,
  base64ToBlob,
  getDefaultFilters,
  getAppliedFilterCount,
} from './utils'
import { expect, describe, it, vi } from 'vitest'
import { accountsCollectionForSelectFormat, accountsCollection } from '@app/schedule/tests/mocks/Account'
import { TEMPLATE_TYPE_SHORT_OTHER } from './scheduleConsts'
import type { Filters } from '@app/schedule/components/FilterDrawer/FilterDrawerTypes'

const TEST_DATE = '2024-08-14'

interface Window {
  showSaveFilePicker: any
  URL: any
  atob: any
}
declare let window: Window

describe('utils helpers', () => {
  it('should format date accordingly', () => {
    expect(dateToLocaleFormat(
      '2022-07-27T00:00:00')).toBe('27/07/2022')
  })
  it('should format date in iso standard whenever possible', () => {
    expect(dateISOFormatter(
      new Date('Wed Mar 20 2024 11:55:50 GMT+0100 (heure normale d’Europe centrale)')),
    ).toBe('2024-03-20')
    expect(dateISOFormatter('xxx'),
    ).toBe('')
    expect(dateISOFormatter(''),
    ).toBe('')
  })
  it('should format account data accordingly', () => {
    expect(accountsDataTransformer(accountsCollection)).toStrictEqual(
      accountsCollectionForSelectFormat,
    )
  })
  it('should return the number of days of the target month in specific year', () => {
    expect(daysInTheMonth(2024, 2)).toBe(29)
  })
  describe('getYearMonth', () => {
    it('should return proper year-month', () => {
      const yearMonth = getYearMonth(new Date(TEST_DATE))

      expect(yearMonth).toBe(TEST_DATE.substring(0, 7))
    })
  })

  describe('getTypeLabel', () => {
    const scheduleModelsByKey: Record<string, string> = {
      TVA: 'taxe sur la valeur ajoutée',
    }
    const templateTva = {
      typeShort: 'TVA',
    } as Deadline['template']
    const templateCustom = {
      typeShort: 'Custom type',
    } as Deadline['template']
    const templateAutre = {
      typeShort: TEMPLATE_TYPE_SHORT_OTHER,
      typeLong: 'Type long',
    } as Deadline['template']

    const tests = [{
      template: templateTva,
      expected: 'taxe sur la valeur ajoutée',
    }, {
      template: templateCustom,
      expected: templateCustom.typeShort,
    }, {
      template: templateAutre,
      expected: templateAutre.typeLong,
    }]
    it.each(tests)('expect return $expected when isB is $isB', ({
      template,
      expected,
    }) => {
      const typeLabel = getTypeLabel(scheduleModelsByKey, template)
      expect(typeLabel).toBe(expected)
    })
  })
  describe('file helpers', () => {
    const base64Data = 'SGVsbG8g+d29ybGQ='
    const base64UrlData = 'SGVsbG8g-d29ybGQ='
    const fileName = 'facture_leroy-merlin.pdf'
    it('should convert a base64 string to a base64Url', () => {
      expect(base64ToBase64URL(base64Data)).toStrictEqual(base64UrlData)
    })
    it('should get file extension based on name', () => {
      expect(getFileExtension(fileName)).toBe('PDF')
    })
    it('should convert a file size in human readable one', () => {
      // expect(fileSizeHumanFormatter(0)).toBe('0B')
      expect(fileSizeHumanFormatter(1024)).toBe('1KB')
    })
    it('saves file with a prompt folder selection', async () => {
      // eslint-disable-next-line vitest/prefer-spy-on
      window.atob = vi.fn(() => 'abcdef')
      // eslint-disable-next-line vitest/prefer-spy-on
      window.showSaveFilePicker = vi.fn(() => Promise.resolve({
        createWritable: vi.fn(() => Promise.resolve({
          write: vi.fn(),
          close: vi.fn(),
        })),
      }))
      // Execute the function
      await saveFileAs('facture_leroy-merlin.pdf', base64Data)
      // Assertions
      expect(window.showSaveFilePicker).toHaveBeenCalledWith({
        suggestedName: 'facture_leroy-merlin.pdf',
      })
    })
    it('creates a link and triggers a download', () => {
      const createObjectURLMock = vi.fn()
      const revokeObjectURLMock = vi.fn()
      const clickMock = vi.fn()
      const setAttributeMock = vi.fn()
      window.URL = {
        createObjectURL: createObjectURLMock,
        revokeObjectURL: revokeObjectURLMock,
      }
      // eslint-disable-next-line vitest/prefer-spy-on
      window.atob = vi.fn(() => 'abcdef')
      const createElementSpy: any = vi.spyOn(document, 'createElement')
      createElementSpy.mockImplementation(() => ({
        setAttribute: setAttributeMock,
        click: clickMock,
      }))
      downloadFile(fileName, 'base64Data')
      // Assertions
      expect(createObjectURLMock).toHaveBeenCalledWith(new Blob([base64Data]))
      expect(document.createElement).toHaveBeenCalledWith('a')
      expect(setAttributeMock).toHaveBeenCalledWith('download', fileName)
      expect(revokeObjectURLMock).toHaveBeenCalledOnce()
    })
    it('should return a Blob when given a base64 string', () => {
      // eslint-disable-next-line vitest/prefer-spy-on
      window.atob = vi.fn(() => 'abcdef')
      const result = base64ToBlob(base64Data)
      expect(result).toBeInstanceOf(Blob)
    })
  })

  describe('getDefaultFilters', () => {
    const tests = [{
      isCollab: false,
      expected: {
        targets: [],
        templates: [],
        status: [],
        mineOnly: false,
      },
    }, {
      isCollab: true,
      expected: {
        targets: [],
        templates: [],
        status: [],
        mineOnly: true,
      },
    }]
    it.each(tests)('shoud returns expected default filters when isCollab is $isCollab', ({
      isCollab,
      expected,
    }) => {
      const defaultFilters = getDefaultFilters(isCollab)

      expect(defaultFilters).toStrictEqual(expected)
    })
  })

  describe('getAppliedFilterCount', () => {
    const defaultFilters = {
      targets: [],
      templates: [],
      status: [],
      mineOnly: false,
    }
    const tests: {
      filters: Filters
      expected: number
      reason: string
    }[] = [{
      filters: {
        ...defaultFilters,
      },
      expected: 0,
      reason: 'default filters',
    }, {
      filters: {
        ...defaultFilters,
        targets: [1],
      },
      expected: 1,
      reason: 'default filters and one change',
    }, {
      filters: {
        ...defaultFilters,
        targets: [1],
        templates: ['TVA', 'Bilan'],
      },
      expected: 2,
      reason: 'default filters and two changes',
    }, {
      filters: {
        ...defaultFilters,
        targets: [1],
        templates: ['TVA', 'Bilan'],
        status: ['Todo'],
      },
      expected: 3,
      reason: 'default filters and three changes',
    }, {
      filters: {
        targets: [1],
        templates: ['TVA', 'Bilan'],
        status: ['Todo'],
        mineOnly: !defaultFilters.mineOnly,
      },
      expected: 4,
      reason: 'default filters and four changes',
    }]
    it.each(tests)('shoud returns $expected when $reason', ({
      filters,
      expected,
    }) => {
      const proxyFilters = new Proxy(filters, {})
      const appliedFilterCount = getAppliedFilterCount(defaultFilters, proxyFilters)

      expect(appliedFilterCount).toStrictEqual(expected)
    })
  })
})

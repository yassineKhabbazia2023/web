import { HIDE_ACCOUNTING_HEADER_KEY, HIDE_ACCOUNTING_HEADER_TRUE, HIDE_ACCOUNTING_HEADER_FALSE } from './accounting.const'
import { localStorageMock } from '@pulse/toolbox/mocks'
import { persistHideAccountingHeader, getHideAccountingHeader } from './accounting.helper'

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('accounting.helper', () => {
  describe('persistHideAccountingHeader', () => {
    const tests = [{
      hideAccountingHeader: true,
      expected: HIDE_ACCOUNTING_HEADER_TRUE,
    }, {
      hideAccountingHeader: false,
      expected: HIDE_ACCOUNTING_HEADER_FALSE,
    }]

    it.each(tests)('should call setItem() with $expected when hideAccountingHeader equals $hideAccountingHeader', ({
      hideAccountingHeader,
      expected,
    }) => {
      persistHideAccountingHeader(hideAccountingHeader)

      expect(localStorageMock.setItem).toHaveBeenCalledExactlyOnceWith(HIDE_ACCOUNTING_HEADER_KEY, expected)
    })
  })

  describe('getHideAccountingHeader', () => {
    const tests = [{
      hideAccountingHeaderStringified: HIDE_ACCOUNTING_HEADER_TRUE,
      expectedHideAccountingHeader: true,
    }, {
      hideAccountingHeaderStringified: HIDE_ACCOUNTING_HEADER_FALSE,
      expectedHideAccountingHeader: false,
    }, {
      hideAccountingHeaderStringified: undefined,
      expectedHideAccountingHeader: false,
    }]

    it.each(tests)('should return $expectedHideAccountingHeader when persisted value equals $hideAccountingHeaderStringified', ({
      hideAccountingHeaderStringified,
      expectedHideAccountingHeader,
    }) => {
      localStorageMock.getItem.mockReturnValue(hideAccountingHeaderStringified)
      const hideAccountingHeader = getHideAccountingHeader()

      expect(hideAccountingHeader).toBe(expectedHideAccountingHeader)
      expect(localStorageMock.getItem).toHaveBeenCalledExactlyOnceWith(HIDE_ACCOUNTING_HEADER_KEY)
    })
  })
})

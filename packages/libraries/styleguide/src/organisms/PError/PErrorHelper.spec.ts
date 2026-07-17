import { getErrorText } from './PErrorHelper'

describe('test PErrorHelper', () => {
  const tests = [{
    pErrorName: '',
    pErrorText: '',
    expected: '',
  }, {
    pErrorName: 'error name',
    pErrorText: '',
    expected: 'error name',
  }, {
    pErrorName: 'error name',
    pErrorText: 'error text',
    expected: 'error name - error text',
  }, {
    pErrorName: '',
    pErrorText: 'error text',
    expected: 'error text',
  }]
  it.each(tests)('should return $expected', ({
    pErrorName,
    pErrorText,
    expected,
  }) => {
    const errorText = getErrorText(pErrorName, pErrorText)

    expect(errorText).toBe(expected)
  })
})

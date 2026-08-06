import { convertRecordToDropdownOptions } from './forms'

describe('convertRecordToDropdownOptions', () => {
  it('returns an empty array when options is an empty object', () => {
    expect(convertRecordToDropdownOptions({})).toEqual([])
  })

  it('maps record entries to dropdown options', () => {
    const options = {
      SAS: 'Société par actions simplifiée',
      SARL: 'Société à responsabilité limitée',
    }

    expect(convertRecordToDropdownOptions(options)).toEqual([
      { pValue: 'SAS', pLabel: 'Société par actions simplifiée' },
      { pValue: 'SARL', pLabel: 'Société à responsabilité limitée' },
    ])
  })
})

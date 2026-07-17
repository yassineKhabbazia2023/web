import { formatBinData } from './binHelper'

import type { Service } from '@ged/models/Service'

const entryData: Service[] = [
  {
    ServiceId: '1',
    ServiceName: 'abc',
    IsReadOnly: false,
  },
  {
    ServiceId: '2',
    ServiceName: 'def',
    IsReadOnly: false,
  },
]

describe('binHelper', () => {
  it('should format bin data', () => {
    expect.hasAssertions()
    const formattedBinData = formatBinData(entryData)

    const expectedServiceFormat = [
      {
        id: '1',
        name: 'abc',
        iconName: 'binIcon',
      },
      {
        id: '2',
        name: 'def',
        iconName: 'binIcon',
      },
    ]

    const expectedOutput = [
      {
        id: 'bin',
        name: 'Corbeille',
        iconName: 'binIcon',
        isRootFolder: true,
        children: expectedServiceFormat,
      },
    ]

    expect(formattedBinData).toStrictEqual(expectedOutput)
  })
})

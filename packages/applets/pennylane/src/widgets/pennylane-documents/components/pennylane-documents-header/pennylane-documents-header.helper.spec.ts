import { getDayLabel } from './pennylane-documents-header.helper'

const YESTERDAY = '2023-09-01T00:00:00Z'
const TODAY = '2023-10-01T00:00:00Z'

const formattedLastSynchroDateMock = '1er octobre 2023'
const todayMock = new Date(TODAY)
const yesterdayMock = new Date(YESTERDAY)
const todayLabel = 'today'
const onLabel = 'on'

describe('pennylane-documents-header.helper', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(todayMock)
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  describe('getDayLabel', () => {
    const tests = [{
      lastSynchroDate: todayMock,
      expected: todayLabel,
    }, {
      lastSynchroDate: yesterdayMock,
      expected: `${onLabel} ${formattedLastSynchroDateMock}`,
    }, {
      lastSynchroDate: undefined,
      formattedLastSynchroDate: '',
      expected: '',
    }]
    it.each(tests)('should return $expected when lastSynchroDate is $lastSynchroDate', ({
      lastSynchroDate,
      expected,
    }) => {
      const dayLabel = getDayLabel({
        lastSynchroDate,
        formattedLastSynchroDate: formattedLastSynchroDateMock,
        todayLabel,
        onLabel,
      })
      expect(dayLabel).toBe(expected)
    })
  })
})

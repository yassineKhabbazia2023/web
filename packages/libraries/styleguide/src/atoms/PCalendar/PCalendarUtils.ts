import dayjs from 'dayjs'
export type DateType = 'prev-month' | 'current-month' | 'next-month'

const ISO_FORMAT = 'YYYY-MM-DD'

function isDateType(value: unknown): value is DateType {
  return value === 'prev-month' || value === 'current-month' || value === 'next-month'
}

export function getDateType(
  dateRange: [Date, Date] | undefined,
  date: Date | string,
  nativeDateType: unknown,
): DateType {
  if (dateRange === undefined) {
    if (isDateType(nativeDateType) === true) {
      return nativeDateType
    }

    return 'current-month'
  }
  const [rangeBegin, rangeEnd] = dateRange
  const rangeBeginIso = dayjs(rangeBegin).format(ISO_FORMAT)
  const rangeEndIso = dayjs(rangeEnd).format(ISO_FORMAT)
  const dateIso = dayjs(date).format(ISO_FORMAT)

  if (dateIso < rangeBeginIso) {
    return 'prev-month'
  }
  if (dateIso > rangeEndIso) {
    return 'next-month'
  }
  return 'current-month'
}

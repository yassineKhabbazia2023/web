import dayjs from 'dayjs'
export type DateType = 'prev-month' | 'current-month' | 'next-month'

const ISO_FORMAT = 'YYYY-MM-DD'

export function getDateType(
  dateRange: [Date, Date] | undefined,
  date: Date,
  nativeDateType: DateType,
): DateType {
  if (!dateRange) {
    return nativeDateType
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

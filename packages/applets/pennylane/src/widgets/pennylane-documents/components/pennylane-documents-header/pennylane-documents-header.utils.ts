export function getDayLabel({
  lastSynchroDate,
  formattedLastSynchroDate,
  todayLabel,
  onLabel,
}: {
  lastSynchroDate?: Date,
  formattedLastSynchroDate: string,
  todayLabel: string,
  onLabel: string,
}) {
  if (lastSynchroDate === undefined) {
    return ''
  }
  const today = new Date()
  const isoLastSynchroDateDay = lastSynchroDate.toISOString().substring(0, 10)
  const isoTodayDay = today.toISOString().substring(0, 10)
  const isToday = isoLastSynchroDateDay === isoTodayDay

  return isToday === true
    ? todayLabel
    : `${onLabel} ${formattedLastSynchroDate}`

}

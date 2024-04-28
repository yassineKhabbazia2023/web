import type { DeadlinesByDate } from '@/schedule/models/Deadline'

export function getDates(deadlineItems: DeadlinesByDate[]) {
  return deadlineItems.reduce<string[]>((dates: string[], deadlineItem) => {
    const { date } = deadlineItem
    if (!dates.includes(date)) {
      dates.push(date)
    }
    return dates
  }, [])
}

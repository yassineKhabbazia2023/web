import type { Deadline } from '@/schedule/models/Deadline'

export function getDeadlineCompletionSummary(accountsList: Deadline['accountList']) {
  const accountsAmount = accountsList.length
  const accountsWithCompletedDeadline = accountsList.filter(
    (d) => d.status === 'Done',
  ).length

  return {
    accountsAmount,
    accountsWithCompletedDeadline,
  }
}

import type { Deadline, DeadlineAccounts } from '@/schedule/models/Deadline'

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

export function getProgressText(
  accountList: DeadlineAccounts[],
  doneLabel: string,
) {
  const completion = getDeadlineCompletionSummary(accountList)
  if (completion.accountsAmount === 1) {
    return accountList[0]?.name
  }
  const { accountsWithCompletedDeadline, accountsAmount } = completion

  return `${accountsWithCompletedDeadline}/${accountsAmount} ${doneLabel}`
}


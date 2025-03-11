import type { DeadlineAccount, Template, Deadline, DeadlinesByDate } from '@app/schedule/models/Deadline'

export function getNotCompletelyDoneDeadlinesByDateMock(): DeadlinesByDate[] {
  const template = getTvaMockedTemplate()
  const deadlineAccount1done = getMockedDeadlineAccount(1, 'Done')
  const deadlineAccount2todo = getMockedDeadlineAccount(2, 'Todo')

  const deadline = getMockedDeadline({
    time: '09:01:56',
    template,
    accountList: [
      deadlineAccount1done,
      deadlineAccount2todo,
    ],
  })
  const deadlines = [deadline]

  return [{
    date: '2024-02-22',
    deadlines,
  }, {
    date: '2024-02-21',
    deadlines,
  }]
}

export function getMockedDeadlineAccount(
  id: number,
  status: DeadlineAccount['status'],
  name?: string,
): DeadlineAccount {
  return {
    id,
    status,
    name: name ?? `Account ${id}`,
  }
}

export function getDoneDeadlinesByDateMock(): DeadlinesByDate[] {
  const template = getTvaMockedTemplate()
  const deadlineAccount1done = getMockedDeadlineAccount(1, 'Done')

  const deadline = getMockedDeadline({
    time: '09:01:56',
    template,
    accountList: [
      deadlineAccount1done,
    ],
  })
  const deadlines = [deadline]

  return [{
    date: '2024-02-22',
    deadlines,
  }, {
    date: '2024-02-21',
    deadlines,
  }]
}

export function getMockedDeadlines(): Deadline[] {
  return [getMockedBasicDeadline()]
}

export function getTvaMockedTemplate(): Template {
  return {
    typeShortCollaborator: 'TVA au 21',
    typeShortCustomer: 'TVA',
    typeLong: 'Taxe sur la valeur ajoutée',
    typeShort: 'TVA',
  }
}

export function getSmartMockedDeadline(deadlineAccount1Name?: string) {
  const template = getTvaMockedTemplate()
  const deadlineAccount1done = getMockedDeadlineAccount(1, 'Done', deadlineAccount1Name)
  const deadlineAccount2todo = getMockedDeadlineAccount(2, 'Todo')

  return getMockedDeadline({
    template,
    accountList: [
      deadlineAccount1done,
      deadlineAccount2todo,
    ],
  })
}

export function getMockedBasicDeadline() {
  const template = getTvaMockedTemplate()
  const deadlineAccount = getMockedDeadlineAccount(66842913356, 'Todo', 'Aperture science')

  return getMockedDeadline({
    template,
    accountList: [deadlineAccount],
  })
}

export function getMockedDeadline(override: Partial<Deadline> = {}) {
  const defaultDeadline: Deadline = {
    scheduleId: 1,
    occurrenceId: 1,
    time: '',
    template: {
      typeShortCollaborator: '',
      typeShortCustomer: '',
      typeLong: '',
      typeShort: '',
    },
    globalStatus: 'Done',
    accountList: [],
  }

  return {
    ...defaultDeadline,
    ...override,
  }
}

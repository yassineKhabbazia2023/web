import type { Schedule } from '@/components/CreateSchedule/Form/CreateScheduleFormModel'
import { recipientsIdCollection } from './Account'
import type { DeadlinesByDate, Deadline, DeadlineAccounts } from '@/models/Deadline'

export const notCompletelyDoneDeadlinesByDateMock: DeadlinesByDate[] = [
  {
    date: '2024-02-22',
    deadlines: [
      {
        id: 1,
        time: '09:01:56',
        template: {
          typeShortCustomer: 'TVA',
          typeShortCollaborator: 'TVA au 21',
          typeLong: 'Taxe sur la valeur ajoutée',
        },
        globalStatus: 'Done',
        accountList: [
          { id: 1, name: 'Account 1', status: 'Done' },
          { id: 2, name: 'Account 2', status: 'Todo' },
        ],
      },
    ],
  },
  {
    date: '2024-02-21',
    deadlines: [
      {
        id: 1,
        time: '09:01:56',
        template: {
          typeShortCustomer: 'TVA',
          typeShortCollaborator: 'TVA au 21',
          typeLong: 'Taxe sur la valeur ajoutée',
        },
        globalStatus: 'Done',
        accountList: [
          { id: 1, name: 'Account 1', status: 'Done' },
          { id: 2, name: 'Account 2', status: 'Todo' },
        ],
      },
    ],
  },
]

export const doneDeadlinesByDateMock: DeadlinesByDate[] = [
  {
    date: '2024-02-22',
    deadlines: [
      {
        id: 1,
        time: '09:01:56',
        template: {
          typeShortCustomer: 'TVA',
          typeShortCollaborator: 'TVA au 21',
          typeLong: 'Taxe sur la valeur ajoutée',
        },
        globalStatus: 'Done',
        accountList: [
          { id: 1, name: 'Account 1', status: 'Done' },
        ],
      },
    ],
  },
  {
    date: '2024-02-21',
    deadlines: [
      {
        id: 1,
        time: '09:01:56',
        template: {
          typeShortCustomer: 'TVA',
          typeShortCollaborator: 'TVA au 21',
          typeLong: 'Taxe sur la valeur ajoutée',
        },
        globalStatus: 'Done',
        accountList: [
          { id: 1, name: 'Account 1', status: 'Done' },
        ],
      },
    ],
  },
]

const frequency = 'None'
const date = '2024-03-20'
const time = ''

export const createScheduleMock: Schedule = {
  template: {
    typeShort: 'TVA',
  },
  targets: recipientsIdCollection,
  scheduling: {
    date,
    time,
    frequency,
  },
  description: '',
  isDraft: false,
  isPrivate: false,
}

export const createScheduleMockWithTypeLong: Schedule = {
  template: {
    typeShort: 'autre',
    typeLong: 'IS',
  },
  targets: recipientsIdCollection,
  scheduling: {
    date,
    time,
    frequency,
  },
  description: '',
  isDraft: false,
  isPrivate: false,
}

export const demoDeadlinesByDateMock: DeadlinesByDate[] = [
  {
    date: '2024-03-10',
    deadlines: [
      {
        id: 1,
        time: '09:01:56',
        template: {
          typeShortCustomer: 'TVA',
          typeShortCollaborator: 'TVA au 21',
          typeLong: 'Taxe sur la valeur ajoutée',
        },
        globalStatus: 'Done',
        accountList: [
          { id: 1, name: 'Account 1', status: 'Done' },
          { id: 2, name: 'Account 2', status: 'Todo' },
          { id: 3, name: 'Account 1', status: 'Done' },
          { id: 4, name: 'Account 2', status: 'Todo' },
        ],
      },
      {
        id: 1,
        time: '09:01:56',
        template: {
          typeShortCustomer: 'TVA',
          typeShortCollaborator: 'TVA au 21',
          typeLong: 'Taxe sur la valeur ajoutée',
        },
        globalStatus: 'Todo',
        accountList: [
          { id: 1, name: 'Account 1', status: 'Done' },
          { id: 2, name: 'Account 2', status: 'Todo' },
          { id: 3, name: 'Account 1', status: 'Done' },
          { id: 4, name: 'Account 2', status: 'Todo' },
        ],
      },
      {
        id: 3,
        time: '09:01:56',
        template: {
          typeShortCustomer: 'TVA',
          typeShortCollaborator: 'TVA au 21',
          typeLong: 'Taxe sur la valeur ajoutée',
        },
        globalStatus: 'Done',
        accountList: [
          { id: 1, name: 'Account 1', status: 'Done' },
          { id: 2, name: 'Account 2', status: 'Todo' },
          { id: 3, name: 'Account 1', status: 'Done' },
          { id: 4, name: 'Account 2', status: 'Todo' },
        ],
      },
    ],
  },
]

// Mock data each time we refresh the component
export function generateMockData(startDateStr: string, endDateStr: string) {
  let currentDate = new Date(startDateStr)
  const endDate = new Date(endDateStr)
  const data = []

  while (currentDate <= endDate) {
    const dayData = {
      date: currentDate.toISOString().split('T')[0],
      deadlines: [] as Deadline[],
    }

    const numDeadlines = Math.floor(Math.random() * 9) + 1 // Between 1 and 9 deadlines
    for (let i = 0; i < numDeadlines; i++) {
      const deadline: Deadline = {
        id: i + 1,
        time: `${Math.floor(Math.random() * 24)
          .toString()
          .padStart(2, '0')}:${Math.floor(Math.random() * 60)
          .toString()
          .padStart(2, '0')}:${Math.floor(Math.random() * 60)
          .toString()
          .padStart(2, '0')}`,
        template: {
          typeShortCustomer: 'TVA',
          typeShortCollaborator: 'TVA au 21',
          typeLong: 'Taxe sur la valeur ajoutée',
        },
        globalStatus: Math.random() > 0.5 ? 'Done' : 'Todo',
        accountList: [] as DeadlineAccounts[],
      }

      const numAccounts = Math.floor(Math.random() * 10) + 1 // Between 1 and 10 accounts
      for (let j = 0; j < numAccounts; j++) {
        const status = '011100'.at(j % 6)

        deadline.accountList.push({
          id: j + 1,
          name: `Account ${j + 1}`,
          status: status === '0' ? 'Done' : 'Todo',
        })
      }

      dayData.deadlines.push(deadline)
    }

    data.push(dayData)
    currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1))
  }

  return data
}

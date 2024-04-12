import type { Schedule } from '@/schedule/components/CreateSchedule/CreateScheduleForm/CreateScheduleFormModel'
import { recipientsIdCollection } from './Account'
import type { DeadlinesByDate, Deadline, DeadlineAccounts } from '@/schedule/models/Deadline'

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
          typeShort: 'TVA',
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
          typeShort: 'TVA',
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
          typeShort: 'TVA',
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
          typeShort: 'TVA',
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
          typeShort: 'TVA',
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
          typeShort: 'TVA',
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
          typeShort: 'TVA',
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

function getFormatted(index: number, modulo: number) {
  const n = index % modulo

  return `${n}`.padStart(2, '0')
}
// Mock data each time we refresh the component
export function generateMockData(startDateStr: string, endDateStr: string) {
  let currentDate = new Date(startDateStr)
  const endDate = new Date(endDateStr)
  const data = []

  let index = 0

  while (currentDate <= endDate) {
    const dayData = {
      date: currentDate.toISOString().split('T')[0],
      deadlines: [] as Deadline[],
    }

    const numDeadlines = index++ % 9
    for (let i = 0; i < numDeadlines; i++) {
      const hour = getFormatted(i * index, 24)
      const min = getFormatted(i * index, 60)
      const sec = getFormatted(45 + i * index, 24)
      const deadline: Deadline = {
        id: i + 1,
        time: `${hour}${min}${sec}`,
        template: {
          typeShortCustomer: 'TVA',
          typeShortCollaborator: 'TVA au 21',
          typeLong: 'Taxe sur la valeur ajoutée',
          typeShort: 'TVA',
        },
        globalStatus: (i % 2) ? 'Done' : 'Todo',
        accountList: [] as DeadlineAccounts[],
      }

      const numAccounts = (i % 10) + 1 // Between 1 and 10 accounts
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

export function getMockedDeadlines() {
  return [
    {
      template: {
        typeShortCollaborator: 'TVA au 21',
        typeShortCustomer: 'TVA',
        typeLong: 'Taxe sur la valeur ajoutée',
      },
      globalStatus: 'Done',
      accountList: [{
        id: '66842913356',
        name: 'Aperture science',
        status: 'Todo',
      }],
    },
  ]
}

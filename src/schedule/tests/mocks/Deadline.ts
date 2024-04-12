import type { Schedule } from '@/schedule/components/CreateSchedule/CreateScheduleForm/CreateScheduleFormModel'
import { recipientsIdCollection } from './Account'
import type { DeadlinesByDate } from '@/schedule/models/Deadline'

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

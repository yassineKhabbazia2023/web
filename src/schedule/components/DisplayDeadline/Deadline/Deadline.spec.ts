import { defineStore } from 'pinia'
import { createTestingPinia } from '@pinia/testing'
import Deadline from '.'
import wrapperFactory from '@/schedule/tests/utils/wrapperFactory'
import type { Deadline as DeadlineData } from '@/schedule/models/Deadline'
import { expect, describe, it, vi } from 'vitest'
import { collabUser } from '@/schedule/tests/mocks/User'

const pinia = createTestingPinia()
vi.mock('@kpmg/common', () => ({
  commonStore: defineStore('common', {
    state: () => ({
      user: {
        ...collabUser,
      },
    }),
    getters: {
      isCollab: () => true,
    },
  }),
}))

const createWrapper = (deadlineData: DeadlineData[]) =>
  wrapperFactory(Deadline, {
    props: { deadlineData },
    global: {
      plugins: [pinia],
    },
  })

describe('deadline component', () => {
  it('renders deadline information with folders progression', () => {
    const deadlineData: DeadlineData[] = [{
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
    }]

    const wrapper = createWrapper(deadlineData)
    expect(wrapper.find('.p-schedule-deadline__content-label').text()).toBe(
      `${deadlineData[0].template.typeShortCollaborator} (${deadlineData[0].template.typeLong})`,
    )
    const completed = deadlineData[0].accountList
      .filter(account => account.status === 'Done').length
    const total = deadlineData[0].accountList.length
    expect(wrapper.find('.p-schedule-deadline__content-progress').text())
      .toBe(`${completed}/${total} files done`)
    expect(wrapper.findComponent({ name: 'Tag' })
      .props('status')).toBe(deadlineData[0].globalStatus)
    expect(wrapper.findComponent({ name: 'Icon' })
      .props('status')).toBe(deadlineData[0].globalStatus)
  })

  it('should renders list item information with ibs name', () => {
    const deadlineData: DeadlineData[] = [
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
          { id: 2, name: 'Account 2', status: 'Todo' },
        ],
      },
    ]

    const wrapper = createWrapper(deadlineData)

    expect(wrapper.find('.p-schedule-deadline__content-progress').text())
      .toBe(deadlineData[0].accountList[0].name)
    expect(wrapper.find('.p-schedule-deadline__tag').text())
      .toBe(deadlineData[0].globalStatus)
  })

  it('should emit update-drawer-visibility event', async () => {
    const deadlineData: DeadlineData[] = [
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
          { id: 2, name: 'Account 2', status: 'Todo' },
        ],
      },
    ]

    const wrapper = createWrapper(deadlineData)
    await wrapper.find('.p-schedule-deadline__content').trigger('click')
    expect(wrapper.emitted('update-drawer-visibility')).toStrictEqual([
      [''],
    ])
  })
})

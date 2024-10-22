import { TvaLabel, mockedGetScheduleModelsByKey } from '@app/schedule/tests/mocks/commonViMock'
import { defineStore } from 'pinia'
import { createTestingPinia } from '@pinia/testing'
import Deadlines from '.'
import wrapperFactory from '@app/schedule/tests/utils/wrapperFactory'
import type { Deadline } from '@app/schedule/models/Deadline'
import { expect, describe, it, vi } from 'vitest'
import { collabUser } from '@app/schedule/tests/mocks/User'
import { flushPromises } from '@vue/test-utils'
import { getSmartMockedDeadline } from '@app/schedule/tests/mocks/Deadline'

const pinia = createTestingPinia()
const amplitudeTrackMock = vi.hoisted(() => vi.fn())

vi.mock('@pulse/common', () => ({
  amplitudeService: {
    track: amplitudeTrackMock,
  },
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
  dataProvider: () => {
    return {
      fetchUserData: vi.fn(),
    }
  },
}))

vi.mock('@app/schedule/services', () => ({
  getScheduleModelsByKey: (_: string) => mockedGetScheduleModelsByKey(_),
}))

const deadlineData: Deadline[] = [getSmartMockedDeadline()]

const createWrapper = (deadlines: Deadline[]) =>
  wrapperFactory(Deadlines, {
    props: { deadlines },
    global: {
      plugins: [pinia],
    },
  })

describe('deadline component', () => {
  it('should call getScheduleModelsByKey with proper arguments', async () => {
    createWrapper(deadlineData)
    await flushPromises()
    expect(mockedGetScheduleModelsByKey).toHaveBeenCalledOnce()
    expect(mockedGetScheduleModelsByKey).toHaveBeenNthCalledWith(1, 'both')
  })

  it('renders deadline information with folders progression', async () => {
    const wrapper = createWrapper(deadlineData)
    await flushPromises()
    const TvaLabelText = wrapper.find('.p-schedule-deadline__content-label').text()
    expect(TvaLabelText).toBe(TvaLabel)
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

  it('should renders list item information with ibs name', async () => {
    const deadlineData: Deadline[] = [getSmartMockedDeadline('1/2 files done')]

    const wrapper = createWrapper(deadlineData)
    await flushPromises()

    expect(wrapper.find('.p-schedule-deadline__content-progress').text())
      .toBe(deadlineData[0].accountList[0].name)
    expect(wrapper.find('.p-schedule-deadline__tag').text())
      .toBe(deadlineData[0].globalStatus)
  })

  it('should emit select-deadline event on item clicked', async () => {
    const deadline = getSmartMockedDeadline()
    const deadlineData: Deadline[] = [deadline]
    const { occurrenceId } = deadline

    const wrapper = createWrapper(deadlineData)
    await wrapper.find('.p-schedule-deadline__content').trigger('click')
    expect(wrapper.emitted('select-deadline')).toStrictEqual([
      [occurrenceId],
    ])
  })

  it('should emit select-deadline event on toolbox clicked', async () => {
    const deadline = getSmartMockedDeadline()
    const deadlineData: Deadline[] = [deadline]
    const { occurrenceId } = deadline

    const wrapper = createWrapper(deadlineData)
    await wrapper.vm.actionClicked('view-reminder-details', occurrenceId)
    expect(wrapper.emitted('select-deadline')).toStrictEqual([
      [occurrenceId],
    ])
    expect(amplitudeTrackMock).toHaveBeenCalledWith('Reminder Consulted',
      { reminder_consultation_localisation: 'list' })
  })
})

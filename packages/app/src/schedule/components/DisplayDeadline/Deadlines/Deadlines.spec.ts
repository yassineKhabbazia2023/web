import { flushPromises } from '@vue/test-utils'
import wrapperFactory from '@app/__mocks__/wrapper.factory'
import { getSmartMockedDeadline } from '@app/__mocks__/deadline.mocks'
import { tvaLabelMock } from '@app/__mocks__/schedule.mocks'
import { scheduleServicesMock, getScheduleModelsByKeyMock } from '@app/__mocks__/schedule.service.mocks'
import type { Deadline } from '@app/schedule/models/Deadline'
import { AmplitudeService as AmplitudeServiceMock } from '@pulse/common/services/amplitude'

import Deadlines from '.'

vi.mock('@app/schedule/services', () => scheduleServicesMock)

vi.mock('@pulse/common/services/amplitude')

const deadlineData: Deadline[] = [getSmartMockedDeadline()]

const createWrapper = (deadlines: Deadline[]) =>
  wrapperFactory(Deadlines, {
    props: { deadlines },
    global: {
    },
  })

describe('deadline component', () => {
  it('should call getScheduleModelsByKey with proper arguments', async () => {
    createWrapper(deadlineData)
    await flushPromises()
    expect(getScheduleModelsByKeyMock).toHaveBeenCalledOnce()
    expect(getScheduleModelsByKeyMock).toHaveBeenNthCalledWith(1, 'both')
  })

  it('renders deadline information with folders progression', async () => {
    const wrapper = createWrapper(deadlineData)
    await flushPromises()
    const TvaLabelText = wrapper.find('.p-schedule-deadline__content-label').text()
    expect(TvaLabelText).toBe(tvaLabelMock)
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
    expect(AmplitudeServiceMock.track).toHaveBeenCalledWith('Reminder Consulted',
      { reminder_consultation_localisation: 'list' })
  })
})

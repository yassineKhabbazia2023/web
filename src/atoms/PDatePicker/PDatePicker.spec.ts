import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { nextTick } from 'vue'
import PDatePicker from '.'

const createWrapper = (props: any = {}) =>
  mount(PDatePicker, {
    props,
  })

describe('calendar lite', () => {
  it('renders the calendar lite component', async () => {
    const date = new Date()
    const day = '2024-01-29'
    const wrapper: VueWrapper<any> = createWrapper(
      {
        modelValue: day,
        pValueFormat: 'YYYY-MM-DD',
        pFormat: 'YYYY-MM-DD',
        pCalendarLite: true,
        pSchedulesCollection: ['2024-01-29', '2024-01-27', '2024-02-05'],
      })

    await wrapper.setProps({ pMonth: 'next-month' })
    await nextTick()
    await wrapper.setProps({ pMonth: 'today' })
    await nextTick()
    expect(wrapper.emitted()['update:modelValue'][0]).toStrictEqual([(new Date()).toISOString().split('T')[0]])
    wrapper.vm.handleChange(date)
    wrapper.vm.calendarChange([date, date])
    wrapper.vm.selectedDate(day)
    expect(wrapper.emitted().change[0]).toStrictEqual([date])
    expect(wrapper.emitted()['calendar-change'][0]).toStrictEqual([[date, date]])
    expect(wrapper.emitted()['selected-date'][0]).toStrictEqual([day])
  })
})


import DeadlineReminders from '.'
import { expect, describe, it } from 'vitest'
import type { DeadlineRemindersProps } from './DeadlineRemindersTypes'
import { shallowMount } from '@vue/test-utils'

function createWrapper(override: Partial<DeadlineRemindersProps> = {}) {
  const defaultProps: DeadlineRemindersProps = {
    reminders: [],
  }
  const props = {
    ...defaultProps,
    ...override,
  }

  const wrapper = shallowMount(DeadlineReminders, {
    props,
    global: {
      stubs: {
        PIcon: true,
        'i18n-t': {
          template: '<div>Notification <slot name="days" /> <slot name="beforeOrAfter" /> deadline date</div>',
        },
      },
    },
  })
  return wrapper
}

describe('test DeadlineReminders', () => {
  it('should display reminders properly', () => {
    const reminders = [-1, 1, 3]
    const wrapper = createWrapper({
      reminders,
    })
    const rows = wrapper.findAll('[data-testid="deadline-reminders-row"]')

    expect(rows).toHaveLength(reminders.length)
    expect(rows[0].text()).toBe('Notification 1 day before deadline date')
    expect(rows[1].text()).toBe('Notification 1 day after deadline date')
    expect(rows[2].text()).toBe('Notification 3 days after deadline date')
  })

  it('should be empty when no reminders', () => {
    const wrapper = createWrapper()
    const rootElement = wrapper.find('[data-testid="deadline-reminders"]')

    expect(rootElement.exists()).toBeFalsy()
  })
})

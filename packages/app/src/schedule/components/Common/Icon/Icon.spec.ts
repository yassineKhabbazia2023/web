import Icon from '.'
import { shallowMount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import type { Status } from '@app/schedule/models/Deadline'
import type { IconName } from '@pulse/styleguide/types'

const createWrapper = (status: Status) =>
  shallowMount(Icon, {
    props: { status },
    global: {
      stubs: {
        PIcon: {
          name: 'PIcon',
          template: '<div />',
          props: ['pName'],
        },
      }
    }
  })

describe('tag status management', () => {
  const tests: {
    status: Status
    expected: IconName
  }[] = [
    { status: 'Done', expected: 'checkCircle' },
    { status: 'Todo', expected: 'loader' },

    { status: 'Draft', expected: 'sticky' },
  ]

  it.each(tests)('icon($statusCode)', ({ status, expected }) => {
    const wrapper = createWrapper(status)
    const iconName = wrapper
      .findComponent({ name: 'PIcon' })
      .props('pName')

    expect(iconName).toBe(expected)
    wrapper.unmount()
  })
})

import { shallowMount, type VueWrapper } from '@vue/test-utils'
import type { DeadlinesByDate } from '@app/schedule/models/Deadline'
import { expect, describe, beforeEach, it, vi } from 'vitest'
import { getNotCompletelyDoneDeadlinesByDateMock } from '@app/schedule/tests/mocks/Deadline'
import type { DeadlineListProps } from './DeadlineListTypes'
import DeadlineList from '.'

const notCompletelyDoneDeadlinesByDateMock = getNotCompletelyDoneDeadlinesByDateMock()

const activeDate = new Date(2024, 5, 1)

function createWrapper(override: Partial<DeadlineListProps> = {}) {
  const deadlinesByDate: DeadlinesByDate[] = []
  const defaultProps: DeadlineListProps = {
    deadlinesByDate,
    activeDate,
    isSearchState: false,
  }
  const props = {
    ...defaultProps,
    ...override,
  }

  return shallowMount(DeadlineList, {
    props,
    global: {
      stubs: {
        PScrollbar: {
          name: 'PScrollbar',
          template: '<div><slot /></div>',
        },
      },
    },
  })
}

vi.mock('@app/schedule/services', () => ({
  getScheduleModelsByKey: () => ({
    TVA: 'TVA au 21 (Taxe sur la valeur ajoutée)',
  }),
}))

describe('test DeadlineList', () => {
  describe('when list is NOT empty', () => {
    let wrapper: VueWrapper
    beforeEach(() => {
      wrapper = createWrapper({
        deadlinesByDate: notCompletelyDoneDeadlinesByDateMock,
      })
    })
    it('should emit select-deadline event when first ListItem emits select-deadline', () => {
      const occurrenceId = 123456789

      const firstListItem = wrapper.findComponent({ name: 'ListItem' })
      firstListItem.vm.$emit('select-deadline', occurrenceId)

      expect(wrapper.emitted('select-deadline')).toStrictEqual([
        [occurrenceId],
      ])
    })

    it('should emit click-date when click on ListItem', async () => {
      const firstListItem = wrapper.findComponent({ name: 'ListItem' })
      const firstDate = notCompletelyDoneDeadlinesByDateMock[0].date
      await firstListItem.trigger('click')

      expect(wrapper.emitted('click-date')).toStrictEqual([[firstDate]])
    })
  })

  describe('when list is empty', () => {
    const tests = [{
      isSearchState: false,
      expectedErrorMessage: 'No events for June',
    }, {
      isSearchState: true,
      expectedErrorMessage: 'No events matching your search',
    }]

    it.each(tests)('should display $expectedErrorMessage when isSearchState is $isSearchState', ({
      isSearchState,
      expectedErrorMessage,
    }) => {
      const wrapper = createWrapper({
        isSearchState,
      })
      const message = wrapper.find('[data-testid="deadlines-list-empty-list-message"]')
      expect(message.text()).toBe(expectedErrorMessage)
    })
  })
})

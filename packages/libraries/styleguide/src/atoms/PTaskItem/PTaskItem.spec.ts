import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import PTaskItem from '.'
import type { PTaskItemProps } from './PTaskItemTypes'

const title = 'Title'
const completedTasks = 3
const totalTasks = 10

const defaultProps: PTaskItemProps = {
  pStatus: 'todo',
  pTitle: title,
  pCompletedTasks: completedTasks,
  pTotalTasks: totalTasks,
}

const createWrapper = (props = defaultProps) => mount(PTaskItem, {
  props,
})

describe('pTaskItem', () => {
  describe('props', () => {
    it('should render the text values of the component', () => {
      const wrapper = createWrapper({
        ...defaultProps,
      })

      expect(wrapper.find('.p-task-item__title').text()).toContain(title)
      expect(wrapper.find('[data-test-id=task-item-completed]').text()).toContain(completedTasks)
      expect(wrapper.find('[data-test-id=task-item-total]').text()).toContain(totalTasks)
    })
    it('should render correctly with all passed props', () => {
      const wrapper = createWrapper()
      const taskItem = wrapper.find('.p-task-item')

      expect(taskItem.classes()).toContain(
        `p-task-item--status-${defaultProps.pStatus}`,
      )
    })
  })
})

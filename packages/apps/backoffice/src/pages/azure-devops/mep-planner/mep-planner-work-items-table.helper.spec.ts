import { getTypeColor, getStateColor, isWorkItemIncomplete, getRowClassName } from './mep-planner-work-items-table.helper'

describe('getTypeColor', () => {
  it.each([
    ['User Story', 'info'],
    ['Enabler Story', 'orange'],
    ['Bug', 'danger'],
    ['Task', 'warning'],
    ['Feature', 'success'],
    ['Epic', 'purple'],
  ])('should return "%s" → "%s"', (type, expected) => {
    expect(getTypeColor(type)).toBe(expected)
  })

  it('should return "gray" for an unknown type', () => {
    expect(getTypeColor('Unknown')).toBe('gray')
  })
})

describe('getStateColor', () => {
  it.each([
    ['New', 'warning'],
    ['Active', 'warning'],
    ['Ready for test', 'warning'],
    ['Ready for check', 'warning'],
    ['In Progress', 'warning'],
    ['Resolved', 'success'],
    ['Validated', 'success'],
    ['Closed', 'dark-green'],
    ['Released', 'success'],
    ['Done', 'success'],
    ['Removed', 'danger'],
  ])('should return "%s" → "%s"', (state, expected) => {
    expect(getStateColor(state)).toBe(expected)
  })

  it('should return "gray" for an unknown state', () => {
    expect(getStateColor('Unknown')).toBe('gray')
  })
})

describe('isWorkItemIncomplete', () => {
  it.each(['Validated', 'Closed', 'Released', 'Resolved'])(
    'should return false for completed state "%s"',
    (state) => {
      expect(isWorkItemIncomplete(state)).toBe(false)
    },
  )

  it.each(['New', 'Active', 'In Progress', 'Ready for test'])(
    'should return true for incomplete state "%s"',
    (state) => {
      expect(isWorkItemIncomplete(state)).toBe(true)
    },
  )
})

describe('getRowClassName', () => {
  it('should return the incomplete CSS class for an incomplete work item', () => {
    expect(getRowClassName({ row: { state: 'Active' } })).toBe('mep-planner-work-items-table__row--incomplete')
  })

  it('should return an empty string for a completed work item', () => {
    expect(getRowClassName({ row: { state: 'Validated' } })).toBe('')
  })
})

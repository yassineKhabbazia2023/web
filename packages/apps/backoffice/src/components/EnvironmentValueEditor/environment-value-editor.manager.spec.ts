import { describe, it, expect } from 'vitest'
import { EnvironmentValueEditorManager } from './environment-value-editor.manager'
import type { EnvironmentOption } from '@backoffice/types/environment-option.type'

describe('EnvironmentValueEditorManager', () => {
  describe('setTargetValue', () => {
    it('should create map when current is undefined', () => {
      const next = EnvironmentValueEditorManager.setTargetValue(undefined, 'ITG', 'v')
      expect(next).toEqual({ ITG: 'v' })
    })

    it('should set trimmed value', () => {
      const next = EnvironmentValueEditorManager.setTargetValue({}, 'ITG', '  hello  ')
      expect(next).toEqual({ ITG: 'hello' })
    })

    it('should override existing value', () => {
      const next = EnvironmentValueEditorManager.setTargetValue({ ITG: 'old' }, 'ITG', 'new')
      expect(next).toEqual({ ITG: 'new' })
    })

    it('should delete key when value is empty', () => {
      const next = EnvironmentValueEditorManager.setTargetValue({ ITG: 'x' }, 'ITG', '')
      expect(next).toEqual({})
    })

    it('should delete key when value is only spaces', () => {
      const next = EnvironmentValueEditorManager.setTargetValue({ ITG: 'x' }, 'ITG', '   ')
      expect(next).toEqual({})
    })

    it('should not mutate original object', () => {
      const current = { ITG: 'x' }
      const next = EnvironmentValueEditorManager.setTargetValue(current, 'ITG', 'y')
      expect(current).toEqual({ ITG: 'x' })
      expect(next).toEqual({ ITG: 'y' })
    })
  })

  describe('groupEnvironments', () => {
    it('should map environments to grouped structure', () => {
      const input: EnvironmentOption[] = [
        { environment: 'ITG', labels: ['itg01'] },
        { environment: 'PRD', labels: [] },
      ]

      expect(EnvironmentValueEditorManager.groupEnvironments(input)).toEqual([
        { environment: 'ITG', labels: ['itg01'] },
        { environment: 'PRD', labels: [] },
      ])
    })

    it('should return empty array for empty input', () => {
      expect(EnvironmentValueEditorManager.groupEnvironments([])).toEqual([])
    })
  })
})

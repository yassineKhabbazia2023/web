import { describe, it, expect } from 'vitest'
import { EnvironmentHierarchicalSelectorManager } from './environment-hierarchical-selector.manager'
import type { EnvironmentOption } from '@backoffice/types/environment-option.type'

describe('EnvironmentHierarchicalSelectorManager', () => {
  const mockEnvironments: EnvironmentOption[] = [
    { environment: 'ITG', labels: ['ITG01', 'ITG02'] },
    { environment: 'REC', labels: ['REC01', 'REC02'] },
    { environment: 'PRD', labels: ['PRD01'] },
    { environment: 'DEV', labels: [] },
  ]

  describe('groupEnvironments', () => {
    it('should group environments without selection state', () => {
      const grouped = EnvironmentHierarchicalSelectorManager.groupEnvironments(mockEnvironments)

      expect(grouped).toHaveLength(4)
      expect(grouped[0]).toEqual({
        environment: 'ITG',
        labels: ['ITG01', 'ITG02'],
      })
      expect(grouped[1]).toEqual({
        environment: 'REC',
        labels: ['REC01', 'REC02'],
      })
      expect(grouped[2]).toEqual({
        environment: 'PRD',
        labels: ['PRD01'],
      })
      expect(grouped[3]).toEqual({
        environment: 'DEV',
        labels: [],
      })
    })

    it('should handle empty environment list', () => {
      const grouped = EnvironmentHierarchicalSelectorManager.groupEnvironments([])

      expect(grouped).toEqual([])
    })
  })

  describe('isEnvironmentSelected', () => {
    it('should return true when environment is in selection', () => {
      expect(EnvironmentHierarchicalSelectorManager.isEnvironmentSelected(['ITG', 'REC'], 'ITG')).toBe(true)
      expect(EnvironmentHierarchicalSelectorManager.isEnvironmentSelected(['ITG', 'REC'], 'REC')).toBe(true)
    })

    it('should return false when environment is not in selection', () => {
      expect(EnvironmentHierarchicalSelectorManager.isEnvironmentSelected(['ITG'], 'REC')).toBe(false)
      expect(EnvironmentHierarchicalSelectorManager.isEnvironmentSelected([], 'ITG')).toBe(false)
    })

    it('should return false when only labels are selected', () => {
      expect(EnvironmentHierarchicalSelectorManager.isEnvironmentSelected(['ITG:ITG01'], 'ITG')).toBe(false)
    })
  })

  describe('isLabelSelected', () => {
    it('should return true when specific label is selected', () => {
      expect(EnvironmentHierarchicalSelectorManager.isLabelSelected(['ITG:ITG01'], 'ITG', 'ITG01')).toBe(true)
    })

    it('should return false when label is not selected', () => {
      expect(EnvironmentHierarchicalSelectorManager.isLabelSelected(['ITG:ITG01'], 'ITG', 'ITG02')).toBe(false)
      expect(EnvironmentHierarchicalSelectorManager.isLabelSelected([], 'ITG', 'ITG01')).toBe(false)
    })

    it('should return false when only environment is selected', () => {
      expect(EnvironmentHierarchicalSelectorManager.isLabelSelected(['ITG'], 'ITG', 'ITG01')).toBe(false)
    })
  })

  describe('handleCheckboxToggle', () => {
    describe('adding values', () => {
      it('should add environment when checking', () => {
        const newValue = EnvironmentHierarchicalSelectorManager.handleCheckboxToggle([], 'ITG', true)

        expect(newValue).toEqual(['ITG'])
      })

      it('should add label when checking', () => {
        const newValue = EnvironmentHierarchicalSelectorManager.handleCheckboxToggle([], 'ITG:ITG01', true)

        expect(newValue).toEqual(['ITG:ITG01'])
      })

      it('should add value to existing selection', () => {
        const newValue = EnvironmentHierarchicalSelectorManager.handleCheckboxToggle(['ITG'], 'REC', true)

        expect(newValue).toEqual(['ITG', 'REC'])
      })

      it('should not duplicate if value already exists', () => {
        const newValue = EnvironmentHierarchicalSelectorManager.handleCheckboxToggle(['ITG'], 'ITG', true)

        expect(newValue).toEqual(['ITG'])
      })
    })

    describe('removing values', () => {
      it('should remove environment when unchecking', () => {
        const newValue = EnvironmentHierarchicalSelectorManager.handleCheckboxToggle(['ITG', 'REC'], 'ITG', false)

        expect(newValue).toEqual(['REC'])
      })

      it('should remove label when unchecking', () => {
        const newValue = EnvironmentHierarchicalSelectorManager.handleCheckboxToggle(['ITG:ITG01', 'ITG:ITG02'], 'ITG:ITG01', false)

        expect(newValue).toEqual(['ITG:ITG02'])
      })

      it('should handle unchecking when value not in selection', () => {
        const newValue = EnvironmentHierarchicalSelectorManager.handleCheckboxToggle(['REC'], 'ITG', false)

        expect(newValue).toEqual(['REC'])
      })

      it('should handle unchecking from empty selection', () => {
        const newValue = EnvironmentHierarchicalSelectorManager.handleCheckboxToggle([], 'ITG', false)

        expect(newValue).toEqual([])
      })
    })

    describe('independent checkbox behavior', () => {
      it('should allow both environment and its labels to be selected independently', () => {
        let selection: string[] = []

        selection = EnvironmentHierarchicalSelectorManager.handleCheckboxToggle(selection, 'ITG', true)
        selection = EnvironmentHierarchicalSelectorManager.handleCheckboxToggle(selection, 'ITG:ITG01', true)

        expect(selection).toEqual(['ITG', 'ITG:ITG01'])
      })

      it('should not remove labels when unchecking environment', () => {
        const selection = ['ITG', 'ITG:ITG01', 'ITG:ITG02']
        const newValue = EnvironmentHierarchicalSelectorManager.handleCheckboxToggle(selection, 'ITG', false)

        expect(newValue).toEqual(['ITG:ITG01', 'ITG:ITG02'])
      })

      it('should not remove environment when unchecking label', () => {
        const selection = ['ITG', 'ITG:ITG01']
        const newValue = EnvironmentHierarchicalSelectorManager.handleCheckboxToggle(selection, 'ITG:ITG01', false)

        expect(newValue).toEqual(['ITG'])
      })

      it('should preserve other environments when toggling', () => {
        const selection = ['ITG', 'REC:REC01']
        const newValue = EnvironmentHierarchicalSelectorManager.handleCheckboxToggle(selection, 'ITG:ITG01', true)

        expect(newValue).toContain('ITG')
        expect(newValue).toContain('REC:REC01')
        expect(newValue).toContain('ITG:ITG01')
      })
    })
  })
})

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

  describe('getParentCheckboxState', () => {
    it.each([
      {
        description: 'should return checked=true, indeterminate=false when all labels selected',
        selected: ['ITG:ITG01', 'ITG:ITG02'],
        environment: 'ITG',
        labels: ['ITG01', 'ITG02'],
        expected: { checked: true, indeterminate: false },
      },
      {
        description: 'should return checked=false, indeterminate=true when some labels selected',
        selected: ['ITG:ITG01'],
        environment: 'ITG',
        labels: ['ITG01', 'ITG02'],
        expected: { checked: false, indeterminate: true },
      },
      {
        description: 'should return checked=false, indeterminate=false when no labels selected',
        selected: [],
        environment: 'ITG',
        labels: ['ITG01', 'ITG02'],
        expected: { checked: false, indeterminate: false },
      },
      {
        description: 'should return checked=true for single label environment when selected',
        selected: ['PRD:PRD01'],
        environment: 'PRD',
        labels: ['PRD01'],
        expected: { checked: true, indeterminate: false },
      },
      {
        description: 'should handle environment with no labels when selected',
        selected: ['DEV'],
        environment: 'DEV',
        labels: [],
        expected: { checked: true, indeterminate: false },
      },
      {
        description: 'should return unchecked for environment with no labels when not selected',
        selected: [],
        environment: 'DEV',
        labels: [],
        expected: { checked: false, indeterminate: false },
      },
    ])('$description', ({ selected, environment, labels, expected }) => {
      const result = EnvironmentHierarchicalSelectorManager.getParentCheckboxState(
        selected,
        environment,
        labels,
      )

      expect(result).toEqual(expected)
    })
  })

  describe('handleCheckboxToggle', () => {
    describe('parent checkbox behavior (check all / uncheck all pattern)', () => {
      describe('checking parent', () => {
        it('should add all children when checking parent', () => {
          const selection: string[] = []
          const newValue = EnvironmentHierarchicalSelectorManager.handleCheckboxToggle(
            selection,
            'ITG',
            true,
            mockEnvironments,
          )

          expect(newValue).toContain('ITG:ITG01')
          expect(newValue).toContain('ITG:ITG02')
          expect(newValue).toHaveLength(2)
        })

        it('should work with multiple-label environments', () => {
          const selection: string[] = []
          const newValue = EnvironmentHierarchicalSelectorManager.handleCheckboxToggle(
            selection,
            'REC',
            true,
            mockEnvironments,
          )

          expect(newValue).toContain('REC:REC01')
          expect(newValue).toContain('REC:REC02')
        })

        it('should work with single-label environments', () => {
          const selection: string[] = []
          const newValue = EnvironmentHierarchicalSelectorManager.handleCheckboxToggle(
            selection,
            'PRD',
            true,
            mockEnvironments,
          )

          expect(newValue).toContain('PRD:PRD01')
          expect(newValue).toHaveLength(1)
        })

        it('should not duplicate if children already checked', () => {
          const selection = ['ITG:ITG01']
          const newValue = EnvironmentHierarchicalSelectorManager.handleCheckboxToggle(
            selection,
            'ITG',
            true,
            mockEnvironments,
          )

          expect(newValue).toContain('ITG:ITG01')
          expect(newValue).toContain('ITG:ITG02')
          expect(newValue.filter((v) => v === 'ITG:ITG01')).toHaveLength(1)
        })

        it('should preserve other environments', () => {
          const selection = ['REC:REC01']
          const newValue = EnvironmentHierarchicalSelectorManager.handleCheckboxToggle(
            selection,
            'ITG',
            true,
            mockEnvironments,
          )

          expect(newValue).toContain('ITG:ITG01')
          expect(newValue).toContain('ITG:ITG02')
          expect(newValue).toContain('REC:REC01')
        })
      })

      describe('unchecking parent', () => {
        it('should remove all children when unchecking parent', () => {
          const selection = ['ITG:ITG01', 'ITG:ITG02']
          const newValue = EnvironmentHierarchicalSelectorManager.handleCheckboxToggle(
            selection,
            'ITG',
            false,
            mockEnvironments,
          )

          expect(newValue).not.toContain('ITG:ITG01')
          expect(newValue).not.toContain('ITG:ITG02')
          expect(newValue).toHaveLength(0)
        })

        it('should preserve other environments', () => {
          const selection = ['ITG:ITG01', 'ITG:ITG02', 'REC:REC01']
          const newValue = EnvironmentHierarchicalSelectorManager.handleCheckboxToggle(
            selection,
            'ITG',
            false,
            mockEnvironments,
          )

          expect(newValue).not.toContain('ITG:ITG01')
          expect(newValue).not.toContain('ITG:ITG02')
          expect(newValue).toContain('REC:REC01')
        })
      })
    })

    describe('child checkbox behavior', () => {
      describe('checking child', () => {
        it('should add child when checking', () => {
          const selection: string[] = []
          const newValue = EnvironmentHierarchicalSelectorManager.handleCheckboxToggle(
            selection,
            'ITG:ITG01',
            true,
            mockEnvironments,
          )

          expect(newValue).toContain('ITG:ITG01')
          expect(newValue).toHaveLength(1)
        })

        it('should not affect other children', () => {
          const selection = ['ITG:ITG02']
          const newValue = EnvironmentHierarchicalSelectorManager.handleCheckboxToggle(
            selection,
            'ITG:ITG01',
            true,
            mockEnvironments,
          )

          expect(newValue).toContain('ITG:ITG01')
          expect(newValue).toContain('ITG:ITG02')
        })

        it('should preserve other environments', () => {
          const selection = ['REC:REC01']
          const newValue = EnvironmentHierarchicalSelectorManager.handleCheckboxToggle(
            selection,
            'ITG:ITG01',
            true,
            mockEnvironments,
          )

          expect(newValue).toContain('ITG:ITG01')
          expect(newValue).toContain('REC:REC01')
        })
      })

      describe('unchecking child', () => {
        it('should remove child when unchecking', () => {
          const selection = ['ITG:ITG01', 'ITG:ITG02']
          const newValue = EnvironmentHierarchicalSelectorManager.handleCheckboxToggle(
            selection,
            'ITG:ITG01',
            false,
            mockEnvironments,
          )

          expect(newValue).not.toContain('ITG:ITG01')
          expect(newValue).toContain('ITG:ITG02')
        })

        it('should not affect other children', () => {
          const selection = ['ITG:ITG01', 'ITG:ITG02']
          const newValue = EnvironmentHierarchicalSelectorManager.handleCheckboxToggle(
            selection,
            'ITG:ITG02',
            false,
            mockEnvironments,
          )

          expect(newValue).toContain('ITG:ITG01')
          expect(newValue).not.toContain('ITG:ITG02')
        })

        it('should preserve other environments', () => {
          const selection = ['ITG:ITG01', 'REC:REC01']
          const newValue = EnvironmentHierarchicalSelectorManager.handleCheckboxToggle(
            selection,
            'ITG:ITG01',
            false,
            mockEnvironments,
          )

          expect(newValue).not.toContain('ITG:ITG01')
          expect(newValue).toContain('REC:REC01')
        })
      })
    })

    describe('backward compatibility', () => {
      it('should maintain backward compatibility when availableEnvironments is not provided', () => {
        const selection = ['ITG:ITG01']
        const newValue = EnvironmentHierarchicalSelectorManager.handleCheckboxToggle(
          selection,
          'ITG:ITG02',
          true,
        )

        expect(newValue).toContain('ITG:ITG01')
        expect(newValue).toContain('ITG:ITG02')
      })

      it('should handle simple toggle for legacy behavior', () => {
        let selection: string[] = []

        selection = EnvironmentHierarchicalSelectorManager.handleCheckboxToggle(selection, 'ITG', true)
        expect(selection).toEqual(['ITG'])

        selection = EnvironmentHierarchicalSelectorManager.handleCheckboxToggle(selection, 'ITG', false)
        expect(selection).toEqual([])
      })
    })

    describe('environment without labels (edge cases)', () => {
      it('should add environment itself when checking environment with no labels', () => {
        const selection: string[] = []
        const newValue = EnvironmentHierarchicalSelectorManager.handleCheckboxToggle(
          selection,
          'DEV',
          true,
          mockEnvironments,
        )

        expect(newValue).toContain('DEV')
        expect(newValue).toHaveLength(1)
      })

      it('should remove environment itself when unchecking environment with no labels', () => {
        const selection = ['DEV']
        const newValue = EnvironmentHierarchicalSelectorManager.handleCheckboxToggle(
          selection,
          'DEV',
          false,
          mockEnvironments,
        )

        expect(newValue).not.toContain('DEV')
        expect(newValue).toEqual([])
      })
    })

    describe('standalone value fallback (invalid format)', () => {
      describe('checking standalone values', () => {
        it.each([
          {
            description: 'should treat value as standalone when format is invalid (more than 2 parts)',
            value: 'ENV:LABEL:EXTRA',
          },
          {
            description: 'should treat value as standalone when it is not a parent and not a valid child',
            value: 'UNKNOWN_VALUE',
          },
        ])('$description', ({ value }) => {
          const selection: string[] = []
          const newValue = EnvironmentHierarchicalSelectorManager.handleCheckboxToggle(
            selection,
            value,
            true,
            mockEnvironments,
          )

          expect(newValue).toContain(value)
        })
      })

      describe('unchecking standalone values', () => {
        it('should remove standalone value when unchecking', () => {
          const selection = ['UNKNOWN_VALUE']
          const newValue = EnvironmentHierarchicalSelectorManager.handleCheckboxToggle(
            selection,
            'UNKNOWN_VALUE',
            false,
            mockEnvironments,
          )

          expect(newValue).not.toContain('UNKNOWN_VALUE')
          expect(newValue).toEqual([])
        })
      })
    })
  })
})

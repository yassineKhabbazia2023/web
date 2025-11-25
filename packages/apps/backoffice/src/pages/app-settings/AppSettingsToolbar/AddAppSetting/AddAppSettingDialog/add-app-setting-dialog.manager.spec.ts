import { describe, it, expect } from 'vitest'
import { AddAppSettingDialogManager } from './add-app-setting-dialog.manager'

describe('AddAppSettingDialogManager', () => {
  describe('createInitialFormState', () => {
    it('should return form data with default values', () => {
      const formState = AddAppSettingDialogManager.createInitialFormState()

      expect(formState).toEqual({
        name: '',
        value: '',
        isSecret: false,
        allEnvs: false,
        withLabels: false,
        selectedEnvironments: [],
      })
    })

    it('should create a new instance each time', () => {
      const formState1 = AddAppSettingDialogManager.createInitialFormState()
      const formState2 = AddAppSettingDialogManager.createInitialFormState()

      expect(formState1).not.toBe(formState2)
      expect(formState1.selectedEnvironments).not.toBe(formState2.selectedEnvironments)
    })
  })

  describe('buildTargetsFromSelection', () => {
    it('should build targets from simple environment selection', () => {
      const selectedEnvironments = ['ITG', 'REC']

      const targets = AddAppSettingDialogManager.buildTargetsFromSelection(selectedEnvironments)

      expect(targets).toHaveLength(2)
      expect(targets).toContainEqual({ environment: 'ITG', labels: [] })
      expect(targets).toContainEqual({ environment: 'REC', labels: [] })
    })

    it('should build targets from environment:label selection', () => {
      const selectedEnvironments = ['ITG:itg01', 'ITG:itg02']

      const targets = AddAppSettingDialogManager.buildTargetsFromSelection(selectedEnvironments)

      expect(targets).toHaveLength(1)
      expect(targets[0]).toEqual({
        environment: 'ITG',
        labels: expect.arrayContaining(['itg01', 'itg02']),
      })
      expect(targets[0].labels).toHaveLength(2)
    })

    it('should build targets from mixed selection (environment + labels)', () => {
      const selectedEnvironments = ['ITG:itg01', 'REC']

      const targets = AddAppSettingDialogManager.buildTargetsFromSelection(selectedEnvironments)

      expect(targets).toHaveLength(2)
      expect(targets).toContainEqual({ environment: 'ITG', labels: ['itg01'] })
      expect(targets).toContainEqual({ environment: 'REC', labels: [] })
    })

    it('should handle multiple labels for the same environment', () => {
      const selectedEnvironments = ['ITG:itg01', 'ITG:itg02', 'ITG:itg03']

      const targets = AddAppSettingDialogManager.buildTargetsFromSelection(selectedEnvironments)

      expect(targets).toHaveLength(1)
      expect(targets[0].environment).toBe('ITG')
      expect(targets[0].labels).toHaveLength(3)
      expect(targets[0].labels).toContain('itg01')
      expect(targets[0].labels).toContain('itg02')
      expect(targets[0].labels).toContain('itg03')
    })

    it('should handle environment selection combined with label selection for same environment', () => {
      const selectedEnvironments = ['ITG', 'ITG:itg01']

      const targets = AddAppSettingDialogManager.buildTargetsFromSelection(selectedEnvironments)

      expect(targets).toHaveLength(1)
      expect(targets[0]).toEqual({
        environment: 'ITG',
        labels: ['itg01'],
      })
    })

    it('should handle empty selection', () => {
      const targets = AddAppSettingDialogManager.buildTargetsFromSelection([])

      expect(targets).toEqual([])
    })

    it('should handle mixed environments with multiple labels', () => {
      const selectedEnvironments = [
        'ITG:itg01',
        'ITG:itg02',
        'REC:rec01',
        'PRD',
      ]

      const targets = AddAppSettingDialogManager.buildTargetsFromSelection(selectedEnvironments)

      expect(targets).toHaveLength(3)

      const itgTarget = targets.find(t => t.environment === 'ITG')
      expect(itgTarget?.labels).toHaveLength(2)
      expect(itgTarget?.labels).toContain('itg01')
      expect(itgTarget?.labels).toContain('itg02')

      const recTarget = targets.find(t => t.environment === 'REC')
      expect(recTarget?.labels).toEqual(['rec01'])

      const prdTarget = targets.find(t => t.environment === 'PRD')
      expect(prdTarget?.labels).toEqual([])
    })

    it('should not create duplicate labels', () => {
      const selectedEnvironments = ['ITG:itg01', 'ITG:itg01']

      const targets = AddAppSettingDialogManager.buildTargetsFromSelection(selectedEnvironments)

      expect(targets).toHaveLength(1)
      expect(targets[0].labels).toHaveLength(1)
      expect(targets[0].labels[0]).toBe('itg01')
    })
  })
})

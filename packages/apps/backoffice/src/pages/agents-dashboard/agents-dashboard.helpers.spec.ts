import {
  getAgentLockEnvironmentLabel,
  mapAgentLockEnvironmentsToDropdownOptions,
} from './agents-dashboard.helpers'

describe('agents-dashboard.helpers', () => {
  it('should format agent lock environment label', () => {
    expect(getAgentLockEnvironmentLabel({
      id: 1,
      name: 'ITG',
      poolName: 'pulse-itg',
    })).toBe('ITG (pulse-itg)')
  })

  it('should map agent lock environments to dropdown options', () => {
    expect(mapAgentLockEnvironmentsToDropdownOptions([
      {
        id: 1,
        name: 'ITG',
        poolName: 'pulse-itg',
      },
      {
        id: 2,
        name: 'REC',
        poolName: 'pulse-rec',
      },
    ])).toEqual([
      {
        pValue: 1,
        pLabel: 'ITG (pulse-itg)',
      },
      {
        pValue: 2,
        pLabel: 'REC (pulse-rec)',
      },
    ])
  })
})

import { buildTargetsFromValues } from '@backoffice/helpers/app-settings-targets.helper'

describe('buildTargetsFromValues', () => {
  it('should map ENV to { environment, label="", value } (env-only)', () => {
    const targets = buildTargetsFromValues({
      ITG: 'v1',
    })

    expect(targets).toEqual([{ environment: 'ITG', label: '', value: 'v1' }])
  })

  it('should map ENV:label to { environment, label, value }', () => {
    const targets = buildTargetsFromValues({
      'ITG:ITG01': 'v2',
    })

    expect(targets).toEqual([{ environment: 'ITG', label: 'ITG01', value: 'v2' }])
  })

  it('should ignore empty or whitespace values', () => {
    const targets = buildTargetsFromValues({
      ITG: '   ',
      'PRD:prd01': 'ok',
    })

    expect(targets).toEqual([{ environment: 'PRD', label: 'prd01', value: 'ok' }])
  })

  it('should return empty array when valuesByTarget is undefined', () => {
    expect(buildTargetsFromValues(undefined)).toEqual([])
  })

  it('should trim values', () => {
    const targets = buildTargetsFromValues({
      ITG: '  hello  ',
    })

    expect(targets).toEqual([{ environment: 'ITG', label: '', value: 'hello' }])
  })
})

import { buildExerciceOptions } from './format.utils'

describe('buildExerciceOptions', () => {

  it('should offer an exercice by the year it closes on', () => {
    const options = buildExerciceOptions(
      [{ exerciceId: 9, exerciceEndDate: '2025-12-31' }],
      (key, params) => `${key}:${String(params.year)}`,
      'fr-FR',
    )

    expect(options).toEqual([
      { pValue: 9, pLabel: 'keyMoments.exerciceSelect.option:2025' },
    ])
  })
})

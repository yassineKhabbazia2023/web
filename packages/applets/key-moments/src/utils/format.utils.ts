import { formatCalendarYear } from './date.utils'

/**
 * An exercice is offered by the year it closes on — one rule for every
 * surface, so the collaborator and the client read the same name. Its two
 * dates are not lost: the captions around the selector state them in full.
 */
export function buildExerciceOptions(
  catalogue: { exerciceId: number, exerciceEndDate: string }[],
  t: (key: string, params: Record<string, unknown>) => string,
  locale: string,
): { pValue: number, pLabel: string }[] {
  return catalogue.map(summary => ({
    pValue: summary.exerciceId,
    pLabel: t('keyMoments.exerciceSelect.option', {
      year: formatCalendarYear(summary.exerciceEndDate, locale),
    }),
  }))
}

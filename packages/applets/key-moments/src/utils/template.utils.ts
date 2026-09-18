import type { TemplateModel, TemplateSummary } from '../types/key-moments.types'

/**
 * Versions are compared as numbers wherever they carry one: `1.10.0` is more
 * recent than `1.9.0`, which a plain string order would deny.
 */
function compareVersionsDesc(left: TemplateSummary, right: TemplateSummary): number {
  return right.version.localeCompare(left.version, undefined, { numeric: true })
}

/** Every template of a model, the most recent version first. */
export function templateVersionsOf(catalogue: TemplateSummary[], code: string): TemplateSummary[] {
  return catalogue
    .filter(summary => summary.id === code)
    .sort(compareVersionsDesc)
}

/** The version a model opens on, which is its most recent one. */
export function latestTemplateOf(catalogue: TemplateSummary[], code: string): TemplateSummary | undefined {
  return templateVersionsOf(catalogue, code)[0]
}

/**
 * The models the catalogue carries, each named once in the order it first
 * appears, and the way its most recent version names it.
 */
export function resolveTemplateModels(catalogue: TemplateSummary[]): TemplateModel[] {
  const codes = [...new Set(catalogue.map(summary => summary.id))]

  return codes.flatMap((code) => {
    const latest = latestTemplateOf(catalogue, code)

    return latest === undefined ? [] : [{ code, label: latest.label }]
  })
}

import type { EnvironmentOption } from '@backoffice/types/environment-option.type'
import type { GroupedEnvironment } from './environment-value-editor.type'

/**
 * Manager for EnvironmentValueEditor logic.
 * Contains only UI-related helpers (no API payload building).
 */
export class EnvironmentValueEditorManager {
  /**
   * Creates a new valuesByTarget map with the updated value.
   * - Empty/whitespace value removes the key
   * - Otherwise stores the trimmed value
   */
  static setTargetValue(
    current: Record<string, string> | undefined,
    key: string,
    value: string,
  ): Record<string, string> {
    const next: Record<string, string> = current ? { ...current } : {}
    const trimmed = value.trim()

    if (trimmed.length === 0) {
      delete next[key]
    } else {
      next[key] = trimmed
    }

    return next
  }

  /**
   * Groups available environments with their labels for display.
   */
  static groupEnvironments(availableEnvironments: EnvironmentOption[]): GroupedEnvironment[] {
    return availableEnvironments.map((envOption) => ({
      environment: envOption.environment,
      labels: envOption.labels,
    }))
  }
}

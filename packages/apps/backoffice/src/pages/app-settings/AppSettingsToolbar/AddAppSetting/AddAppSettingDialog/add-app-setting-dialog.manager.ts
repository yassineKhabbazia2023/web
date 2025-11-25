import type { CreateAppSettingFormData } from './add-app-setting-dialog.type'
import type { EnvironmentOption } from '@backoffice/services/app-settings-list/app-settings-list.service.type'

/**
 * Manager for add app setting dialog logic
 * Contains pure functions for form management and data transformation
 */
export class AddAppSettingDialogManager {
  /**
   * Creates the initial form state with default values
   * @returns Initial form data
   */
  static createInitialFormState(): CreateAppSettingFormData {
    return {
      name: '',
      value: '',
      isSecret: false,
      allEnvs: false,
      withLabels: false,
      selectedEnvironments: [],
    }
  }

  /**
   * Builds target environments array from selection strings
   * Handles both environment-only selections (e.g., "ITG") and environment:label selections (e.g., "ITG:itg01")
   * @param selectedEnvironments - Array of selected environment strings
   * @returns Array of environment options with labels
   */
  static buildTargetsFromSelection(selectedEnvironments: string[]): EnvironmentOption[] {
    const targetsMap = new Map<string, Set<string>>()

    for (const selection of selectedEnvironments) {
      if (selection.includes(':') === true) {
        const [env, label] = selection.split(':')
        if (targetsMap.has(env) === false) {
          targetsMap.set(env, new Set())
        }
        targetsMap.get(env)!.add(label)
      } else if (targetsMap.has(selection) === false) {
        targetsMap.set(selection, new Set())
      }
    }

    return Array.from(targetsMap.entries()).map(([environment, labelsSet]) => ({
      environment,
      labels: Array.from(labelsSet),
    }))
  }
}

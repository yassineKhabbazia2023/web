import type { CreateAppSettingFormData } from './add-app-setting-dialog.type'

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
      valuesByTarget: {},
    }
  }
}

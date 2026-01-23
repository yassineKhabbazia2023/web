import { AddAppSettingDialogManager } from './add-app-setting-dialog.manager'

describe('AddAppSettingDialogManager', () => {
  describe('createInitialFormState', () => {
    it('should return form data with default values', () => {
      expect(AddAppSettingDialogManager.createInitialFormState()).toEqual({
        name: '',
        valuesByTarget: {},
      })
    })

    it('should create a new instance each time', () => {
      const formState1 = AddAppSettingDialogManager.createInitialFormState()
      const formState2 = AddAppSettingDialogManager.createInitialFormState()

      expect(formState1).not.toBe(formState2)
      expect(formState1.valuesByTarget).not.toBe(formState2.valuesByTarget)
    })
  })
})
